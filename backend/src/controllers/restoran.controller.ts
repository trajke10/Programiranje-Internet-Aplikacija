import express from 'express'
import RestoranModel from '../models/restoran'
import PorudzbinaModel from '../models/porudzbina'
import RezervacijaModel from '../models/rezervacija'

const fs=require('fs')
const path=require('path')


export class RestoranController{

    addRestaurant=(req:express.Request,res:express.Response)=>{

        new RestoranModel({
            naziv:req.body.naziv,
            tip:req.body.tip,
            adresa:req.body.adresa,
            opis:req.body.opis,
            kontakt:req.body.kontakt,
            ocena:0,
            raspored:req.body.raspored,
            lokacijaNaMapi:req.body.urlLokacije,
            radnoVreme:req.body.radnoVreme
        }).save().then(()=>{
            res.json({"message":"Restoran je uspesno dodat"})
        }).catch((err)=>{
            console.log(err)
        })

    }

    addMealToRestaurant=(req:express.Request,res:express.Response)=>{
        
        let destination=""
        let y
        if(req.body.slika==""){
            destination="../../images/podrazumevana"
            y=path.join(__dirname,destination)
        }else{
            let pos=req.body.slika.indexOf("base64,")
            req.body.slika=req.body.slika.slice(pos+7)
            let x=Buffer.from(req.body.slika,'base64')
            destination="../../images/"+req.body.restoran+req.body.naziv
            y=path.join(__dirname,destination)
            fs.writeFileSync(y,x,'binary')
        }

        RestoranModel.findOneAndUpdate({naziv:req.body.restoran},{$push:{jelovnik:{naziv:req.body.naziv,cena:req.body.cena,sastojci:req.body.sastojci,slika:y}}},{new:true}).then(data=>{
            if(data.jelovnik!=null && Array.isArray(data.jelovnik)){
                for(let i=0;i<data.jelovnik.length;i++){
                    const binaryD=fs.readFileSync(data.jelovnik[i].slika)
                    data.jelovnik[i].slika=binaryD.toString('base64')
                }
                res.json(data.jelovnik)
            }
            
        }).catch(err=>{
            console.log(err)
        })

    }

    getAllRestaurants=(req:express.Request,res:express.Response)=>{

        RestoranModel.find({}).then(data=>{
            for(let i=0;i<data.length;i++){
                if(data[i].jelovnik!=null && Array.isArray(data[i].jelovnik)){
                    for (let j=0;j<data[i].jelovnik.length;j++){
                        const binaryD=fs.readFileSync(data[i].jelovnik[j].slika)
                        data[i].jelovnik[j].slika=binaryD.toString('base64')
                    }
                }
            }
            res.json(data)
        }).catch(err=>{
            console.log(err)
        })

    }

    getRestaurant=(req:express.Request,res:express.Response)=>{

        RestoranModel.findOne({naziv:req.params.r}).then(data=>{
            if(data.jelovnik!=null && Array.isArray(data.jelovnik)){
                for (let j=0;j<data.jelovnik.length;j++){
                    const binaryD=fs.readFileSync(data.jelovnik[j].slika)
                    data.jelovnik[j].slika=binaryD.toString('base64')
                }
            }
            res.json(data)
        }).catch(err=>{
            console.log(err)
        })

    }

    makeOrder=(req:express.Request,res:express.Response)=>{

        new PorudzbinaModel(
            {
                datumPorudzbine:req.body.datumPorudzbine,
                restoran:req.body.restoran,
                iznos:req.body.iznos,
                status:req.body.status,
                procenjenoVreme:req.body.procenjenoVreme,
                korisnik:req.body.korisnik,
                stavke:req.body.stavke,
                datumDostave:null
            }
        ).save().then(data=>{
            res.json({"message":"OK"})
        }).catch(err=>{
            console.log(err)
            res.json({"message":"NOT OK"})
        })

    }

    getAllOrdersForUser=(req:express.Request,res:express.Response)=>{
        PorudzbinaModel.find({korisnik:req.params.k}).then(data=>{
            res.json(data)
        }).catch(err=>{
            console.log(err)
        })
    }

    getAllOrdersFromRestaurnt=(req:express.Request,res:express.Response)=>{
        PorudzbinaModel.find({restoran:req.params.r,status:"Na čekanju"}).then(data=>{
            res.json(data)
        }).catch(err=>{
            console.log(err)
        })
    }

    updateOrder=(req:express.Request,res:express.Response)=>{
       PorudzbinaModel.updateOne({datumPorudzbine:req.body.datumPorudzbine,korisnik:req.body.korisnik},{$set:{status:req.body.status,procenjenoVreme:req.body.procenjenoVreme}}).then(data=>{
        res.json({"message":"OK"})
       }).catch(err=>{
        console.log(err)
       })
    }

    makeReservation= async(req:express.Request,res:express.Response)=>{

        try {
            let max = -1;
            let inWorkTime = false;
    
            let datum = new Date(req.body.datum);
    
            let reservations = await RezervacijaModel.find({});
            if (reservations.length > 0) {
                max = Math.max(...reservations.map(r => r.idR));
            }
    
            let restaurant = await RestoranModel.findOne({ naziv: req.body.restoran });
            if (!restaurant) {
                return res.json({ "message": "Neuspešno" });
            }
    
            let dayInWeek = (datum.getDay() - 1) % 7;
            let hour = datum.getHours();
            let minutes = datum.getMinutes();
            let workDay = restaurant.radnoVreme[dayInWeek].radnoVreme;
    
            if (Array.isArray(workDay)) {
                workDay.forEach(period => {
                    let pocetakRV = period.pocetak.split(':');
                    let krajRV = period.kraj.split(':');
                    
                    if(pocetakRV.length>1){
                        let hmP = parseInt(pocetakRV[0], 10) * 60 + parseInt(pocetakRV[1], 10); // broj minuta pocetka
                        let hmZ = parseInt(krajRV[0], 10) * 60 + parseInt(krajRV[1], 10); // broj minuta kraja
        
                        if (hour * 60 + minutes >= hmP && hour * 60 + minutes <= hmZ - 180) {
                            inWorkTime = true;
                        }
                    }
                    
                });
    
                if (!inWorkTime) {
                    return res.json({ "message": "Nije moguće napraviti rezervaciju zbog radnog vremena restorana" });
                }
    
                let flag=false

                let suitableTable = null;
                for (let objekat of restaurant.raspored) {
                    if (objekat.tip === "sto" && objekat.brojStolica >= req.body.brojOsoba) {
                        suitableTable = objekat;
                        let overlappingReservation = await RezervacijaModel.find({
                            restoran: req.body.restoran,
                            idS: suitableTable.idS,
                            status:"Prihvaćena",
                            $or: [
                                {
                                    datum: {
                                        $gte: new Date(datum.getTime()),
                                        $lte: new Date(datum.getTime() + 180 * 60000)
                                    }
                                },
                                {
                                    datum: {
                                        $gte: new Date(datum.getTime() - 180 * 60000),
                                        $lte: new Date(datum.getTime())
                                    }
                                }
                            ]
                        });

                        if(overlappingReservation.length>0) continue
                        
                        await new RezervacijaModel({
                            datum: req.body.datum,
                            restoran: req.body.restoran,
                            korisnik: req.body.korisnik,
                            napomena: req.body.napomena,
                            brojOsoba: req.body.brojOsoba,
                            status: "Na čekanju",
                            idR: max + 1,
                            idS:req.body.idS,
                            konobar:""
                        }).save();
                        return res.json({ "message": "Zahtev za rezervaciju je unet u sistem" });
                    }
                }
              
                return res.json({ "message": "Nema dovoljno slobodnog mesta u restoranu za dato vreme" });
    
            }
    
        } catch (err) {
            console.log(err);
            return res.status(500).json({ "message": "Internal Server Error" });
        }
    }


    getAllReservationsForUser=(req:express.Request,res:express.Response)=>{

        RezervacijaModel.find({korisnik:req.params.k}).then(data=>{
            res.json(data)
        }).catch(err=>{
            console.log(err)
        })

    }

    getAllReservations=(req:express.Request,res:express.Response)=>{

        RezervacijaModel.find({}).then(data=>{
            res.json(data)
        }).catch(err=>{
            console.log(err)
        })

    }

    acceptReservation=(req:express.Request,res:express.Response)=>{

        RezervacijaModel.updateOne({idR:req.body.idR},{$set:{status:"Prihvaćena",konobar:req.body.konobar,idS:req.body.idS}}).then(data=>{
            RezervacijaModel.find({}).then(data=>{
                res.json(data)
            }).catch(err=>{
                console.log(err)
            })
        }).catch((err)=>{
            console.log(err)
        })

    }

    declineReservation=(req:express.Request,res:express.Response)=>{

        RezervacijaModel.updateOne({idR:req.body.idR},{$set:{status:"Odbijena",konobar:req.body.konobar,komentarOdbijanja:req.body.komentar}}).then(data=>{
            RezervacijaModel.find({}).then(data=>{
                res.json(data)
            }).catch(err=>{
                console.log(err)
            })
        }).catch(err=>{
            console.log(err)
        })

    }

    submitAppeareance=(req:express.Request,res:express.Response)=>{

        RezervacijaModel.updateOne({idR:req.body.idR},{$set:{status:req.body.status}}).then(data=>{
            res.json({"message":"OK"})
        }).catch(err=>{
            console.log(err)
        })

    }

    deleteReservation=(req:express.Request,res:express.Response)=>{

        RezervacijaModel.deleteOne({idR:req.body.idR}).then(data=>{
            res.json({"message":"OK"})
        }).catch(err=>{
            console.log(err)
        })

    }

    commentAndRating=(req:express.Request,res:express.Response)=>{

        RezervacijaModel.updateOne({idR:req.body.idR},{$set:{komentar:req.body.komentar,ocena:req.body.ocena}}).then(data=>{
            res.json({"message":"OK"})
        }).catch(err=>{
            console.log(err)
        })

    }

}
import express from 'express'
import UserModel from '../models/user'
import RegistracijaModel from '../models/registracije'
import RestoranModel from '../models/restoran'

import { Md5 } from 'ts-md5'
const fs=require('fs')
const path=require('path')

let forbiddenUsers:Array<String>=[];
let forbiddenMailAdresses:Array<String>=[];

export class UserController{
  
    login=(req:express.Request,res:express.Response)=>{
        let hash=Md5.hashStr(req.body.lozinka)
        UserModel.findOne({korisnickoIme:req.body.korisnickoIme,lozinka:hash,aktivan:true}).then((data)=>{
            if(data!=null){
                const binaryD=fs.readFileSync(data.slika)
                data.slika=binaryD.toString('base64')
            }
            res.json(data)
        }).catch(err=>{
            console.log(err)
        })

    }


    alogin=(req:express.Request,res:express.Response)=>{
        let hash=Md5.hashStr(req.body.lozinka)
        UserModel.findOne({korisnickoIme:req.body.korisnickoIme,lozinka:hash,tip:"admin"}).then((data)=>{
            if(data!=null){
                const binaryD=fs.readFileSync(data.slika)
                data.slika=binaryD.toString('base64')
            }
            res.json(data)
        }).catch(err=>{
            console.log(err)
        })

    }

    register=(req:express.Request,res:express.Response)=>{
        
        let destination=""
        let y
        if(req.body.slika==""){
            destination="../../images/podrazumevana"
            y=path.join(__dirname,destination)
        }else{
            let pos=req.body.slika.indexOf("base64,")
            req.body.slika=req.body.slika.slice(pos+7)
            let x=Buffer.from(req.body.slika,'base64')
            destination="../../images/"+req.body.korisnickoIme
            y=path.join(__dirname,destination)
            fs.writeFileSync(y,x,'binary')
        }
        
        let hash=Md5.hashStr(req.body.lozinka)

        for(let i=0;i<forbiddenUsers.length;i++){
            if(forbiddenUsers.at(i)==req.body.korisnickoIme){
                res.json({"message":"Nije moguce registrovati se sa tim korisnickim imenom"})
                return
            }
        }

        for(let i=0;i<forbiddenMailAdresses.length;i++){
            if(forbiddenMailAdresses.at(i)==req.body.imejl){
                res.json({"message":"Nije moguce registrovati se sa tom imejl adresom"})
                return
            }
        }    

        RegistracijaModel.findOne({korisnickoIme:req.body.korisnickoIme}).then((data)=>{

            if(data!=null){
                res.json({"message":"Vec postoji zahtev sa zadatim korisnickim imenom"})
            }else{
                RegistracijaModel.findOne({imejl:req.body.imejl}).then((data1)=>{
                    if(data1!=null){
                        res.json({"message":"Vec postoji zahtev sa zadatom imejl adresom"})
                    }else{
                        UserModel.findOne({korisnickoIme:req.body.korisnickoIme}).then((data)=>{
                            if(data!=null){
                                res.json({"message":"Vec postoji korisnik sa zadatim korisnickim imenom"})
                            }else{
                                UserModel.findOne({imejl:req.body.imejl}).then((data1)=>{
                                    if(data1!=null){
                                        res.json({"message":"Vec postoji korisnik sa zadatom imejl adresom"})
                                    }else{
                                        new RegistracijaModel({
                                            korisnickoIme:req.body.korisnickoIme,
                                            lozinka:hash,
                                            bezbednosnoPitanje:req.body.bezbednosnoPitanje,
                                            odgovor:req.body.odgovor,
                                            ime:req.body.ime,
                                            prezime:req.body.prezime,
                                            pol:req.body.pol,
                                            adresa:req.body.adresa,
                                            kontakt:req.body.kontakt,
                                            imejl:req.body.imejl,
                                            kreditnaKartica:req.body.kreditnaKartica,
                                            slika:y,
                                            aktivan:false,
                                            tip:"gost"           
                                        }).save().then(()=>{
                                            res.json({"message":"Uspesno poslat zahtev za registraciju"})
                                        }).catch((err2)=>{
                                            console.log(err2)
                                            res.json({"message":"Neuspesno poslat zahtev za registraciju"})
                                        })              
                                    }
                                }).catch((err1)=>{
                                    console.log(err1)
                                })
                            }
                        }).catch((err)=>{
                            console.log(err)
                        })
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }
        }).catch(err=>{
            console.log(err)
        })
    }

    changePassword=(req:express.Request,res:express.Response)=>{
        let oldHash=Md5.hashStr(req.body.staraLozinka)
        let newHash=Md5.hashStr(req.body.novaLozinka)
        UserModel.updateOne({korisnickoIme:req.body.korisnickoIme,lozinka:oldHash},{$set:{lozinka:newHash}}).then(data=>{
            if(data.modifiedCount!=0){
                res.json({"message":"OK"})
            }else{
                res.json({"message":"NOT OK"})
            }
        })
    }

    changePasswordAfterSecurityQuestion=(req:express.Request,res:express.Response)=>{
        let newHash=Md5.hashStr(req.body.novaLozinka)
        UserModel.updateOne({korisnickoIme:req.body.korisnickoIme,lozinka:req.body.staraLozinka},{$set:{lozinka:newHash}}).then(data=>{
            if(data.modifiedCount!=0){
                res.json({"message":"OK"})
            }else{
                res.json({"message":"NOT OK"})
            }
        })
    }

    getUserByUsername=(req:express.Request,res:express.Response)=>{
        UserModel.findOne({korisnickoIme:req.body.korisnickoIme}).then(data=>{
            if(data!=null){
                const binaryD=fs.readFileSync(data.slika)
                data.slika=binaryD.toString('base64')
            }
            res.json(data)
        }).catch(err=>{
            console.log(err)
        })
    }
    
    setDefaultProfilePicture=()=>{
        const imagePath = path.join(__dirname,'../../images/podrazumevana.jpg'); 
        try {

            const fileData = fs.readFileSync(imagePath);
 
            const base64Data = fileData.toString('base64');
            
            let x=Buffer.from(base64Data,'base64')

            let destination="../../images/podrazumevana"
            
            let y=path.join(__dirname,destination)
            
            fs.writeFileSync(y,x,'binary')

        } catch (error) {
            console.error('Error converting file to data URL:', error);
            return;
        }
    }

    getAllUsers=(req:express.Request,res:express.Response)=>{

        UserModel.find({tip:"gost"}).then(data=>{
            for(let i=0;i<data.length;i++ ){
                if(data[i]!=null){
                    const binaryD=fs.readFileSync(data[i].slika)
                    data[i].slika=binaryD.toString('base64')
                }
            }
            res.json(data)
        }).catch(err=>{
            console.log(err)
        })

    }

    getAllWaiters=(req:express.Request,res:express.Response)=>{

        UserModel.find({tip:"konobar"}).then(data=>{
            for(let i=0;i<data.length;i++ ){
                if(data[i]!=null){
                    const binaryD=fs.readFileSync(data[i].slika)
                    data[i].slika=binaryD.toString('base64')
                }
            }
            res.json(data)
        }).catch(err=>{
            console.log(err)
        })

    }

    getAllRequests=(req:express.Request,res:express.Response)=>{
        RegistracijaModel.find({}).then(data=>{
            for(let i=0;i<data.length;i++ ){
                if(data[i]!=null){
                    const binaryD=fs.readFileSync(data[i].slika)
                    data[i].slika=binaryD.toString('base64')
                }
            }
            res.json(data)
        }).catch(err=>{
            console.log(err)
        })
    }

    changeInfo=(req:express.Request,res:express.Response)=>{
    
        UserModel.findOneAndUpdate({korisnickoIme:req.body.korisnickoIme},{$set:{
            korisnickoIme:req.body.novoKorisnickoIme,
            ime:req.body.ime,
            prezime:req.body.prezime,
            pol:req.body.pol,
            adresa:req.body.adresa,
            kontakt:req.body.kontakt,
            imejl:req.body.imejl,
            kreditnaKartica:req.body.kreditnaKartica,
            restoran:req.body.restoran
        }},{new:true}).then((data)=>{
            
            if(data.tip=="konobar"){
                let r=data.restoran
                let konobar=data
                RestoranModel.findOneAndUpdate({naziv:data.restoran},{$pull:{konobari:{korisnickoIme:req.body.korisnickoIme}}}).then(data=>{
                    RestoranModel.updateOne({naziv:r},{$push:{konobari:konobar}}).then(data=>{
                        res.json({"message":"OK"})
                    }).catch(err=>{
                        console.log(err)
                    })
                }).catch(err=>{
                    console.log(err)
                })
            }else{
                res.json({"message":"OK"})
            }
            
        }).catch(err=>{
            console.log(err)
        })

    }

    blockUser=(req:express.Request,res:express.Response)=>{
       
        UserModel.updateOne({korisnickoIme:req.body.korisnickoIme},{$set:{aktivan:false}}).then(()=>{
            res.json({"message":"OK"})
        }).catch(err=>{
            console.log(err)
        })

    }

    unblockUser=(req:express.Request,res:express.Response)=>{
    
        UserModel.updateOne({korisnickoIme:req.body.korisnickoIme},{$set:{aktivan:true}}).then(()=>{
            res.json({"message":"OK"})
        }).catch(err=>{
            console.log(err)
        })

    }

    acceptUser=(req:express.Request,res:express.Response)=>{

        RegistracijaModel.findOne({korisnickoIme:req.body.korisnickoIme}).then(data=>{

            new UserModel({
                korisnickoIme:data.korisnickoIme,
                lozinka:data.lozinka,
                bezbednosnoPitanje:data.bezbednosnoPitanje,
                odgovor:data.odgovor,
                ime:data.ime,
                prezime:data.prezime,
                pol:data.pol,
                adresa:data.adresa,
                kontakt:data.kontakt,
                imejl:data.imejl,
                kreditnaKartica:data.kreditnaKartica,
                slika:data.slika,
                aktivan:true,
                tip:data.tip
            }).save().then(()=>{
                
                RegistracijaModel.deleteOne({korisnickoIme:req.body.korisnickoIme}).then(()=>{
                    res.json({"message":"ok"})
                }).catch((err)=>{
                    console.log(err)
                })
            
            }).catch((err)=>{
                console.log(err)
            })
            
        })      

    }


    declineUser=(req:express.Request,res:express.Response)=>{

        RegistracijaModel.findOne({korisnickoIme:req.body.korisnickoIme}).then(data=>{

            if(!data.slika.includes("podrazumevana")){ // ako je korisnik sam dodao sliku
                fs.unlink(data.slika, (err) => {
                    if (err) 
                        console.error(`Error deleting file ${data.slika}: ${err.message}`);
                });
            }

            RegistracijaModel.deleteOne({korisnickoIme:req.body.korisnickoIme}).then(()=>{
                forbiddenUsers.push(data.korisnickoIme)
                forbiddenMailAdresses.push(data.imejl)
                res.json({"message":"ok"})
            }).catch(err=>{
                console.log(err)
            })
    
        })
        
    }

    addWaiter=(req:express.Request,res:express.Response)=>{

        let destination=""
        let y
        if(req.body.slika==""){
            destination="../../images/podrazumevana"
            y=path.join(__dirname,destination)
        }else{
            let pos=req.body.slika.indexOf("base64,")
            req.body.slika=req.body.slika.slice(pos+7)
            let x=Buffer.from(req.body.slika,'base64')
            destination="../../images/"+req.body.korisnickoIme
            y=path.join(__dirname,destination)
            fs.writeFileSync(y,x,'binary')
        }
        
        let hash=Md5.hashStr(req.body.lozinka)

        RegistracijaModel.findOne({korisnickoIme:req.body.korisnickoIme}).then((data)=>{

            if(data!=null){
                res.json({"message":"Vec postoji zahtev sa zadatim korisnickim imenom"})
            }else{
                RegistracijaModel.findOne({imejl:req.body.imejl}).then((data1)=>{
                    if(data1!=null){
                        res.json({"message":"Vec postoji zahtev sa zadatom imejl adresom"})
                    }else{
                        UserModel.findOne({korisnickoIme:req.body.korisnickoIme}).then((data)=>{
                            if(data!=null){
                                res.json({"message":"Vec postoji korisnik sa zadatim korisnickim imenom"})
                            }else{
                                UserModel.findOne({imejl:req.body.imejl}).then((data1)=>{
                                    if(data1!=null){
                                        res.json({"message":"Vec postoji korisnik sa zadatom imejl adresom"})
                                    }else{
                                        RestoranModel.findOne({naziv:req.body.restoran}).then(data=>{
                                            if(data==null){
                                                res.json({"message":"Ne postoji restoran "+req.body.restoran})
                                            }else{

                                                new UserModel({
                                                    korisnickoIme:req.body.korisnickoIme,
                                                    lozinka:hash,
                                                    bezbednosnoPitanje:req.body.bezbednosnoPitanje,
                                                    odgovor:req.body.odgovor,
                                                    ime:req.body.ime,
                                                    prezime:req.body.prezime,
                                                    pol:req.body.pol,
                                                    adresa:req.body.adresa,
                                                    kontakt:req.body.kontakt,
                                                    imejl:req.body.imejl,
                                                    kreditnaKartica:req.body.kreditnaKartica,
                                                    slika:y,
                                                    aktivan:true,
                                                    tip:"konobar",
                                                    restoran:req.body.restoran,
                                                    brojNepojavljivanja:0
                                                }).save().then(()=>{ 
                                                    RestoranModel.updateOne({naziv:req.body.restoran},{$push:{"konobari":req.body}}).then(()=>{
                                                        res.json({"message":"Uspesno dodavanje konobara"})
                                                    }).catch(err=>{
                                                        console.log(err)
                                                    })
                                                    
                                                }).catch(err=>{
                                                    console.log(err)
                                                })              
                                            }
                                        }).catch(err=>{
                                            console.log(err)
                                        })
                                        
                                    }
                                }).catch((err1)=>{
                                    console.log(err1)
                                })
                            }
                        }).catch((err)=>{
                            console.log(err)
                        })
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }
        }).catch(err=>{
            console.log(err)
        })

    }

    getNumberOfGuests=(req:express.Request,res:express.Response)=>{
        UserModel.countDocuments({tip:"gost"},{}).then(data=>{
            res.json(data)
        }).catch(err=>{
            console.log(err)
        })
    }

    changeProfilePicture=(req:express.Request,res:express.Response)=>{

        UserModel.findOne({korisnickoIme:req.body.korisnickoIme}).then(data=>{

            if(!data.slika.includes("podrazumevana")){ // ako je korisnik sam dodao sliku
                fs.unlink(data.slika, (err) => {
                    if (err) 
                        console.error(`Error deleting file ${data.slika}: ${err.message}`);
                });
            }
            
            let destination=""
            let y
            if(req.body.slika==""){
                destination="../../images/podrazumevana"
                y=path.join(__dirname,destination)
            }else{
                let pos=req.body.slika.indexOf("base64,")
                req.body.slika=req.body.slika.slice(pos+7)
                let x=Buffer.from(req.body.slika,'base64')
                destination="../../images/"+req.body.korisnickoIme
                y=path.join(__dirname,destination)
                fs.writeFileSync(y,x,'binary')
            }

            UserModel.updateOne({korisnickoIme:req.body.korisnickoIme},{$set:{slika:y}}).then(data=>{
                res.json({"message":"ok"})
            }).catch(err=>{
                console.log(err)
            })

        }).catch(err=>{
            console.log(err)
        })                

    }

    incrementNoAppereance=(req:express.Request,res:express.Response)=>{

        UserModel.findOne({korisnickoIme:req.body.korisnik}).then(data=>{

            data.brojNepojavljivanja++;

            UserModel.findOneAndUpdate({korisnickoIme:req.body.korisnik},{$set:{brojNepojavljivanja:data.brojNepojavljivanja}},{new:true}).then(data=>{
                res.json(data)
            })

        })
    }

    findInBlockedUsers=(req:express.Request,res:express.Response)=>{
        
        UserModel.findOne({korisnickoIme:req.body.korisnik,aktivan:false}).then(data=>{
            res.json(data)
        }).catch(err=>{
            console.log(err)
        })

    }

}
import mongoose, { mongo } from "mongoose";
import User from "../models/user"

const RestoranSchema=new mongoose.Schema(
    {
        naziv:String,
        tip:String,
        adresa:String,
        lokacijaNaMapi:String,
        opis:String,
        kontakt:String,
        konobari:Array<{
            korisnickoIme:String,
            lozinka:String,
            bezbednosnoPitanje:String,
            odgovor:String,
            ime:String,
            prezime:String,
            pol:String,
            adresa:String,
            kontakt:String,
            imejl:String,
            kreditnaKartica:String,
            slika:String,
            aktivan:Boolean,
            tip:String,
            restoran:String
        }>,
        ocena:Number,
        jelovnik:Array<{
            naziv:String,
            slika:String,
            cena:Number,
            sastojci:String            
        }>,
        raspored:Array<{
            x:number,
            y:number,
            w:number,
            h:number,
            tip:String,
            brojStolica:number,
            idS:number,
            zauzet:Boolean
        }>,
        radnoVreme:Array<{dan:String,radnoVreme:Array<{pocetak:String,kraj:String}>}>
    },{
        versionKey:false
    }
)

export default mongoose.model("RestoranM",RestoranSchema,"restorani")
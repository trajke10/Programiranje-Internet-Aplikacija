import mongoose, { mongo } from "mongoose";

const RegistracijaSchema= new mongoose.Schema(
    {
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
        tip:String
    },{
        versionKey:false  
      }  
)

export default mongoose.model("RegistracijaM",RegistracijaSchema,"zahtevi")
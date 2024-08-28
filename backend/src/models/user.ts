import mongoose, { mongo } from "mongoose";

const UserSchema= new mongoose.Schema(
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
        tip:String,
        restoran:String,
        brojNepojavljivanja:Number
    },{
        versionKey:false  
      }  
)

export default mongoose.model("UserM",UserSchema,"korisnici")
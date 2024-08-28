import mongoose, { mongo } from "mongoose";
import restoran from "./restoran";

const RezervacijaSchema= new mongoose.Schema(
    {
        idR:Number,
        idS:Number,
        datum:Date,
        restoran:String,
        korisnik:String,
        brojOsoba:Number,
        napomena:String,
        status:String,
        konobar:String,
        komentarOdbijanja:String,
        komentar:String,
        ocena:Number
    },{
        versionKey:false  
      }  
)

export default mongoose.model("RezervacijaM",RezervacijaSchema,"rezervacije")
import mongoose, { mongo } from "mongoose";

const PorudzbinaSchema= new mongoose.Schema(
    {
        datumPorudzbine:Date,
        datumDostave:Date,
        restoran:String,
        iznos:Number,
        status:String,
        procenjenoVreme:String,
        korisnik:String,
        stavke:Array<{jelo:String,kolicina:Number}>
    },{
        versionKey:false  
      }  
)

export default mongoose.model("PorudzbinaM",PorudzbinaSchema,"porudzbine")
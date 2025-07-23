import mongoose from "mongoose";

const parcelSchema = new mongoose.Schema({
    parcelID : {
        type: String,
        required: true,
        unique: true
    },
    name : {
        type: String,
        required: true
    },
   
    NIC : {
        type: Number,
        required: true
    },
    
    details : {
        type: String,
        required: true
    },
})

const Parcel = mongoose.model("parcel", parcelSchema);
export default Parcel;
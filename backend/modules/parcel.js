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
   
    email : {
        type: String,
        required: true
    },
    address_line1 : {
        type: String,
        required: true
    },
    city : {
        type: String,
        required: true
    },
    district : {
        type: String,
        required: true
    },
    details : {
        type: String,
        required: true
    },
    estimateDate : {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'Pending'
    }
})

const Parcel = mongoose.model("parcel", parcelSchema);
export default Parcel;
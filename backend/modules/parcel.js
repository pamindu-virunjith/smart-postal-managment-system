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
    },
    // store the current known location of the parcel (updated by scanner/admin/postman)
    currentLocation: {
        type: String,
        default: ''
    },
    // timestamp of the last update (scanner/controller sets this)
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

const Parcel = mongoose.model("parcel", parcelSchema);
export default Parcel;
import Parcel from "../modules/parcel.js";

export function createParcel(req, res){
    if (req.user== null){
        res.status(403).json({
            message: "You need to login first"
        });
        return;
    }
    if (req.user.role != "admin"){
        res.status(403).json({
            message: "You are not authorized to create a parcel"
        });
        return;
    }

    const parcel = new Parcel(req.body);

    parcel.save().then(() => {
        res.json({
            message: "Parcel created successfully",
        });
    }).catch((err) => {
        res.status(500).json({
            message: "Error creating parcel",
            error: err.message
        });
    });
}

export function getParcel(req, res){

     if (req.user.role != "admin"){
        res.status(403).json({
            message: "You are not authorized to create a parcel"
        });
        return;
    }

    Parcel.find(). then(
        (parcel)=>{
            res.json(parcel)
        }
    ).catch(
        (err)=>{
            res.status(500).json({
                message : "Parcel not found"
            })
        }
    )
}

export function deleteParcel(req, res){
    if (req.user== null){
        res.status(403).json({
            message: "You need to login first"
        });
        return;
    }
    if (req.user.role != "admin"){
        res.status(403).json({
            message: "You are not authorized to delete a parcel"
        });
        return;
    }

    Parcel.findOneAndDelete({
        parcelID: req.params.parcelID
    })
    .then(() => {
        res.json({
            message: "ParcelID deleted successfully"
        });
    }).catch((err) => {
        res.status(500).json({
            message: "Error deleting parcel",
            error: err.message
        });
    });
}

export function updateParcel(req, res){
    if (req.user== null){
        res.status(403).json({
            message: "You need to login first"
        });
        return;
    }
    if (req.user.role != "admin"){
        res.status(403).json({
            message: "You are not authorized to update a parcel"
        });
        return;
    }

    Parcel.findOneAndUpdate(
        { parcelID: req.params.parcelID },
        req.body)
    .then((parcel) => {
        res.json({
            message: "Parcel updated successfully",
        });
    }).catch((err) => {
        res.status(500).json({
            message: "Error updating product",
            error: err.message
        });
    });
}

// search parcel by ID
export function searchParcel(req, res) {
    if (req.user == null) {
        res.status(403).json({
            message: "You need to login first"
        });
        return;
    }

    Parcel.findOne({ parcelID: req.params.parcelID })
        .then((parcel) => {
            if (!parcel) {
                return res.status(404).json({
                    message: "Parcel not found !!!"
                });
            }
            res.json(parcel);
        })
        .catch((err) => {
            res.status(500).json({
                message: "Error retrieving parcel",
                error: err.message
            });
        });
}
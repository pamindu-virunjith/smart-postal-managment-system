import Parcel from "../modules/parcel.js";
import nodemailer from "nodemailer";

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
    // if (req.user == null) {
    //     res.status(403).json({
    //         message: "You need to login first"
    //     });
    //     return;
    // }
    // if (req.user.role != "admin") {
    //     res.status(403).json({
    //         message: "You are not authorized to view parcels"
    //     });
    //     return;
    // }

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
    if (req.user.role != "admin" && req.user.role != "postman"){
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
    if (req.user.role != "admin" && req.user.role != "postman"){
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

export async function emailParcelDetails(req,res){
    const {
    parcelID,
    name,
    email,
    address_line1,
    city,
    district,
    details,
    estimateDate,
    status,
  } = req.body;

  try{
    const transport = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth:{
        user: "postalmanagement64@gmail.com",
        pass: "smdbujtchclirafc"
      }
    })

    const subject = `📦 Parcel Confirmation - ${parcelID}`;

     const message = `
Hello ${name},

Your parcel has been successfully registered in our system. Below are the details:

📦 Parcel Information
----------------------------
Parcel ID     : ${parcelID}
Name          : ${name}
Email         : ${email}
Address       : ${address_line1}
City          : ${city}
District      : ${district || "N/A"}
Details       : ${details || "N/A"}
Estimate Date : ${estimateDate || "Not Provided"}
Status        : ${status}

We will keep you updated as your parcel progresses.

Thank you,
Smart Postal Management System
`;

await transport.sendMail({
      from: "postalmanagement64@gmail.com",
      to: email,
      subject: subject,
      text: message, // plain text version
      html: `
        <h2>📦 Parcel Confirmation</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your parcel has been successfully registered in our system. Below are the details:</p>
        <table border="1" cellspacing="0" cellpadding="8">
          <tr><td><b>Parcel ID</b></td><td>${parcelID}</td></tr>
          <tr><td><b>Name</b></td><td>${name}</td></tr>
          <tr><td><b>Email</b></td><td>${email}</td></tr>
          <tr><td><b>Address</b></td><td>${address_line1}</td></tr>
          <tr><td><b>City</b></td><td>${city}</td></tr>
          <tr><td><b>District</b></td><td>${district}</td></tr>
          <tr><td><b>Details</b></td><td>${details}</td></tr>
          <tr><td><b>Estimate Date</b></td><td>${estimateDate || "Not Provided"}</td></tr>
          <tr><td><b>Status</b></td><td>${status}</td></tr>
        </table>
        <p>We will keep you updated as your parcel progresses.</p>
        <br>
        <p>Thank you,<br>Smart Postal Management System</p>
      `,
    });

    res.status(200).json({
        message:"Email sent Successfully"
    });

  }catch(err){
    console.log("Error sending Email:", err);
    res.status(500).json({
        message:"Error sending Email",
        error: err.message
    });
  }
}


export async function emailUpdatedParcelDetails(req,res){
    const {
    parcelID,
    name,
    email,
    address_line1,
    city,
    district,
    details,
    estimateDate,
    status,
  } = req.body;

  try{
    const transport = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth:{
        user: "postalmanagement64@gmail.com",
        pass: "smdbujtchclirafc"
      }
    })

    const subject = `📦 Your Parcel Update - ${parcelID} | Status: ${status}`;

     const message = `
Hello ${name},

Your parcel has been successfully updated in our system. Below are the updated details:

📦 Parcel Information
----------------------------
Parcel ID     : ${parcelID}
Name          : ${name}
Email         : ${email}
Address       : ${address_line1}
City          : ${city}
District      : ${district || "N/A"}
Details       : ${details || "N/A"}
Estimate Date : ${estimateDate || "Not Provided"}
Status        : ${status}

We will keep you updated as your parcel progresses.

Thank you,
Smart Postal Management System
`;

await transport.sendMail({
      from: "postalmanagement64@gmail.com",
      to: email,
      subject: subject,
      text: message, // plain text version
      html: `
        <h2>📦 Parcel Details has been changed</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your parcel has been successfully updated in our system. Below are the updated details:</p>
        <table border="1" cellspacing="0" cellpadding="8">
          <tr><td><b>Parcel ID</b></td><td>${parcelID}</td></tr>
          <tr><td><b>Name</b></td><td>${name}</td></tr>
          <tr><td><b>Email</b></td><td>${email}</td></tr>
          <tr><td><b>Address</b></td><td>${address_line1}</td></tr>
          <tr><td><b>City</b></td><td>${city}</td></tr>
          <tr><td><b>District</b></td><td>${district}</td></tr>
          <tr><td><b>Details</b></td><td>${details}</td></tr>
          <tr><td><b>Estimate Date</b></td><td>${estimateDate || "Not Provided"}</td></tr>
          <tr><td><b>Status</b></td><td>${status}</td></tr>
        </table>
        <p>We will keep you updated as your parcel progresses.</p>
        <br>
        <p>Thank you,<br>Smart Postal Management System</p>
      `,
    });

    res.status(200).json({
        message:"Email sent Successfully"
    });

  }catch(err){
    console.log("Error sending Email:", err);
    res.status(500).json({
        message:"Error sending Email",
        error: err.message
    });
  }
}
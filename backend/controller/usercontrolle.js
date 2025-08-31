import User from "../modules/user.js";
import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import OTP from "../modules/otp.js";
import nodemailer from "nodemailer";
import axios from "axios"
dotenv.config();

// This function saves a new user to the database
export function saveUser(req, res) {
    if (req.body.role == "admin") {
        if (req.user == null) {
            return res.status(403).json({
                message: "Please login as an admin to create a new admin user"
            });
            return;
        }
        if (req.user.role != "admin") {
            return res.status(403).json({
                message: "You are not authorized to create a new admin user"
            });
            return;
        }
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const user =new User({
        email: req.body.email,
        name: req.body.name,
        address: req.body.address,
        password: hashedPassword,
        role: req.body.role || "user", // Default role is 'user'
        phoneNumber: req.body.phoneNumber || "Not given", // Default phoneNumber to "Not given"
        isDisable: req.body.isDisable || false, // Default isDisable to false
        isEmailVerified: req.body.isEmailVerified || false // Default isEmailVerified to false
    })


    user.save().then(()=> {
        res.json({
            message: "User created successfully"
        })
    }).catch((err) => {
        console.error("Error creating user:", err);
        res.status(500).json({
            message: "Error creating user",
            error: err.message
        });
    })
}

// This function logs in a user by checking their email and password
export function loginUser(req, res){
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        email : email
    }).then((user) => {
        if (user == null) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        else {
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (isPasswordValid) {
                // Generate a JWT token
                const userData ={
                    email: user.email,
                    name: user.name,
                    address: user.address,
                    role: user.role,
                    phoneNumber: user.phoneNumber,
                    isDisable: user.isDisable,
                    isEmailVerified: user.isEmailVerified
                }
                const token = jwt.sign(userData,process.env.JWT_KEY)
                res.json({
                    message: "Login successfully",
                    token: token,
                    user: userData
                })

            } else {
                res.status(401).json({
                    message: "Invalid password"
                });
            }
        }
    })
}

// This function gets the user details by email
export function getUserByEmail(req, res) {
    const email = req.params.email;

    User.findOne({
        email: email
    }).then((user) => {
        if (user == null) {
            return res.status(404).json({
                message: "User not found"
            });
        } else {
            res.json(user);
        }
    }).catch((err) => {
        console.error("Error fetching user:", err);
        res.status(500).json({
            message: "Error fetching user",
            error: err.message
        });
    })
};


// get all users
export function getAllUsers(req, res) {
    if (req.user == null) {
        return res.status(403).json({
            message: "You need to login first"
        });
    }
    if (req.user.role != "admin") {
        return res.status(403).json({
            message: "You are not authorized to view all users"
        });
    }

    User.find().then((users) => {
        res.json(users);
    }).catch((err) => {
        console.error("Error fetching users:", err);
        res.status(500).json({
            message: "Error fetching users",
            error: err.message
        });
    });
}


export function getUser(req,res){
  if(req.user == null){
    res.status(403).json({
      message: "You are not authorized to view user details."
    })
    return
  }else{
    res.json({
      ...req.user
    })
  }
}

export async function loginWithGoole(req,res){
  const token = req.body.accessToken
  if(token == null){
    res.status(400).json({
      message: "Access token is required."
    })
    return;
  }
  const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",{
    headers:{
      Authorization : `Bearer ${token}`
    }
  })
//   console.log(response.data)

  const user = await User.findOne({
    email: response.data.email
  })

  if(user == null){
    const newUser = new User(
      {
        email: response.data.email,
        name: response.data.name,
        password:"googleUser",
      }
    )
    await newUser.save()
    const token = jwt.sign(
            {
              email: newUser.email,
              name: response.data.name,
              role: newUser.role,
            },
            process.env.JWT_KEY
          )

          res.json({
            message:"Login Successfully!!",
            token : token,
            role: newUser.role
          })
  }else{
    const token = jwt.sign(
            {
              email: user.email,
              name: response.data.name,
              role: user.role,
            },
            process.env.JWT_KEY
          )

          res.json({
            message:"Login Successfully!!",
            token : token,
            role: user.role
          })
  }
}

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

export async function sendOTP(req,res){
  const rendomOTP = Math.floor(100000 + Math.random()* 900000)
  const email = req.body.email
  if(email == null){
    res.status(400).json({
      message: "Email is required"
    })
    return
  }

  const user = await User.findOne({
    email: email
  })
  if(user ==  null){
    res.status(404).json({
      message:"User not Found"
    })
    return
  }

  //delete all otps
  await OTP.deleteMany({
    email: email
  })


  const message = {
    from: "postalmanagement64@gmail.com",
    to: email,
    subject: "Reset the Password for Postal Management Sysytem.",
    text: "This is your Password reset OTP: "+ rendomOTP
  }

  const otp = new OTP({
    email: email,
    otp: rendomOTP
  })
  await otp.save()

  transport.sendMail(message,(error,infor)=>{
    if(error){
      res.status(500).json({
        message: "Failed to send OTP",
        error: error
      })
    }else{
      res.json({
        message: "Otp send successfully",
        // OTP: rendomOTP
      })
    }
  })
}

export async function resetPassword(req, res) {
  const otp = req.body.otp
  const email = req.body.email
  const newPassword = req.body.newPassword

  // console.log(otp)

  const respons = await OTP.findOne({
    email: email
  })
  if(respons == null){
    res.status(500).json({
      message:"No OTP request is found. please try again!"
    })
    return
  }
  if(otp == respons.otp){
    await OTP.deleteMany({
      email: email
    })

    // console.log(newPassword)

    const hashedPassword = bcrypt.hashSync(newPassword, 10)
    const response2 = await User.updateOne(
      {email: email},
      {
        password: hashedPassword
      }
    )
    res.json({
      message: "password has been reset successfully"
    })

  }else{
    res.status(403).json({
      message: "OTPs are not matching"
    })
  }

}
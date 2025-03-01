const { SendVerificationCode, WelcomeEmail } = require("../middleware/Email.js");
const Usermodel = require("../models/User.js");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // // Check if user already exists
        const existingUser = await Usermodel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists. Please login." });
        }

        // Hash the password before saving
        const salt =10;
        const hashedPassword = await bcrypt.hash(password, salt );
        // console.log(req.body)
        const verificationCode = Math.floor(100000 + Math.random()*900000).toString();


        // Create new user
        const user = new Usermodel({
            email,
            password : hashedPassword,  // Store the hashed 
            name,
            verificationCode,
        });

        await user.save();
        SendVerificationCode(email , verificationCode , name );

        return res.status(201).json({ success: true, message: "User registered successfully!" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server bhai Error", error: error.message });
    }
};


const verifyemail = async(req ,res) =>{
    try {

        const {code} = req.body
        const user = await Usermodel.findOne({
            verificationCode: code
        })
        if(!user){
            return res.status(400).json({success:false, message:"Invalid or Expired Code"})
        }
        user.isVerified = true;
        user.verificationCode = undefined;
        await user.save();

        await WelcomeEmail(user.email , user.name)

        return res.status(200).json({success:true, message:"Code Verified Successfully"})
    
         



        
    } catch (error) {
        console.log(error);
        return res.status(500).json({success : false , message : "Internal Server Error"})
        
    }
}

export { register, verifyemail };

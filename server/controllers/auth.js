import bcrypt from 'bcrypt'    // to hash password
import jwt from 'jsonwebtoken' // to generate signed token
import {User} from '../models/User.js'

 
/* Register User */
export const register = async (req,res)=>{
    try{ 
    const {firstName,lastName,email,password,location,occupation} = req.body
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password,salt)
    if (req.file && !req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({ error: "Invalid image file type" });
      }
    const newUser = new User({
        firstName,
        lastName,
        email,
        password: passwordHash,
        picturePath: req.file.filename,
        friends: [],
        location,
        occupation,
        profileViewed : Math.floor(Math.random() * 100),
        impressions:  Math.floor(Math.random() * 100),
    })
    const savedUser = await newUser.save()
    res.status(201).json({user:savedUser}) // send back the saved user
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
}

/* LogIN */
export const Login = async(req,res)=>{
    try{
         const {email,password} = req.body
         const user = await User.findOne({email: email})
            if(!user) 
                return res.status(400).json({message: "User does not exist"})
            const isMatch = await bcrypt.compare(password,user.password)
            if(!isMatch)
                return res.status(400).json({message: "Invalid credentials"})

            const token = jwt.sign({id: user._id},process.env.JWT_SECRET)
            delete user.password; //can't send password in response
res.status(200).json({ token, user }); 

const salt = await bcrypt.genSalt();
const hashedPassword = await bcrypt.hash(password, salt);

await User.updateOne(
    { _id: user._id },
    { $set: { password: hashedPassword } }
);

    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}


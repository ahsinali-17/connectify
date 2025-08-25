import jwt from 'jsonwebtoken'

export const verifytoken = async (req,res,next)=>{
    try{
    const token = req.header('Authorization')
    if(!token)
        return res.status(403).json({message: 'Access denied!'})
        const verified = jwt.verify(token,process.env.JWT_SECRET) //true or false
        req.user = verified 
        next()
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

import {Post} from '../models/Post.js';
import { User } from '../models/User.js';
import path from 'path';

/* CREATE */
export const createPost = async (req, res) => {
    try {
      const { description, userId } = req.body;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const imageFile = req.files.image ? req.files.image[0] : null;
      const videoFile = req.files.video ? req.files.video[0] : null;
  
      if (imageFile && !imageFile.mimetype.startsWith("image/")) {
        return res.status(400).json({ message: "Invalid image file type" });
      }
  
      if (videoFile && !videoFile.mimetype.startsWith("video/")) {
        return res.status(400).json({ message: "Invalid video file type" });
      }
  
      const newPost = new Post({
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        description,
        picturePath: imageFile ? imageFile.filename : null,
        videoPath: videoFile ? videoFile.filename : null,
        userPicturePath: user.picturePath,
        likes: {},
        comments: [],
      });
  
      await newPost.save();
      const posts = await Post.find().sort({ createdAt: -1 });
      res.status(200).json("post success");
    } catch (err) {
      res.status(409).json({ message: err.message });
    }
  };
  


/* READ */
export const getFeedPosts = async (req,res) =>{
    try{
        let {id} = req.params;
        const posts = await Post.find({userId: {$ne : id}}).sort({createdAt: -1})
        res.status(200).json(posts)
    } catch(err){
        res.status(404).json({message : err.message})
    }
}

export const getUserPosts = async (req,res) =>{
    try{
    const {userId} = req.params
    const userPosts = await Post.find({userId: userId}).sort({createdAt: -1})
    res.status(200).json(userPosts)
} catch(err){
    res.status(404).json({message : err.message})
}
}

/* UPDATE */
export const likePost   =async (req,res) =>{
    try{
      const {id : postId} = req.params
      const {userId} = req.body
      const post = await Post.findById(postId)
      const isLiked = post.likes.get(userId)
      if(isLiked)
        await post.likes.delete(userId)
      else 
        await post.likes.set(userId,true) //save changes in memory
        const updatedPost = await Post.findByIdAndUpdate(postId, 
        {likes : post.likes}, //directly update post in db without fetching from memory unlike we do in post.save() 
        {new: true})  //updated document is returned
        res.status(200).json(updatedPost)

    } catch (err){
        res.status(404).json({message : err.message})
    }
}

export const commentPost = async (req,res) =>{
    try{
        const {id} = req.params
        const {user,comment} = req.body
        console.log({user,comment})
        if(!user || !comment) return res.status(400).json({message : "Invalid input"})
        console.log(req.params,{user,comment})
        const post = await Post.findById(id)
       await post.comments.push({user,comment})
        const updatedPost = await Post.findByIdAndUpdate(id,
            {comments : post.comments},
            {new: true})
        res.status(200).json(updatedPost)
    } catch(err){
        res.status(404).json({message : err.message})
    }
}
/* DELETE */
export const delPost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const {userId} = req.body;
        const post = await Post.findById(postId); 

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        await Post.findByIdAndDelete(postId); 

        const posts = await Post.find({userId: userId}).sort({ createdAt: -1 }); 
        res.status(200).json(posts); 

    } catch (err) {
        res.status(409).json({ message: err.message });
    }
}

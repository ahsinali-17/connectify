import {User} from '../models/User.js';
import {Post} from '../models/Post.js';
/* READ */
export const getUser = async (req,res) => {
    try { 
        
        const {id} = req.params
        const user = await User.findById(id)
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const getUserFriends = async (req,res) => {
    try {
        const {id} = req.params
        const user = await User.findById(id)
        const friends = await Promise.all(
            user.friends.map((id)=> User.findById(id))
        ) 
        const friendData = friends.map(
            ({_id,firstName, lastName, picturePath,occupation,location})=> { //may need to change
            return {_id,firstName, lastName, picturePath,occupation,location}
    }
)
    res.status(200).json(friendData)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

/* UPDATE */
export const addRemoveFriend = async (req,res) => {
    try{
       const {id,friendid} = req.params
       const user = await User.findById(id)
       const friend = await User.findById(friendid)
       if(user.friends.includes(friendid)){
        user.friends = user.friends.filter((id) => id !== friendid)
        friend.friends = friend.friends.filter((fid) => fid !== id)
       }
       else{
        user.friends.push(friendid)
        friend.friends.push(id)
       }
         await user.save() //as we are updating the db
         await friend.save() 

         const friends = await Promise.all(
            user.friends.map((id)=> User.findById(id))
        ) 
        const friendData = friends.map(
            ({_id,firstName, lastName, picturePath,occupation,location})=> { //may need to change
            return {_id,firstName, lastName, picturePath,occupation,location}
    }
)
    res.status(200).json(friendData)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const updateUserPicture = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      const posts = await Post.find({ userId: id });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (req.file && !req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({ message: "Invalid image file type" });
      }
  
      const file = req.file ? req.file.filename : user.picturePath;

      user.picturePath = file;

      await Promise.all(
        posts.map(async (post) => {
          post.userPicturePath = file;
          await post.save();
        })
      );

      await user.save();

      const updatedUser = await User.findById(id);
      res.status(200).json({ user: updatedUser });
  
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  
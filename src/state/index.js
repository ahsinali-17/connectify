import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode : "light", 
    user  : null,
    posts : [],
    token : null,
    friends : []
}

export const authSlice = createSlice({
    name :"auth",
    initialState,
    reducers : {
        setMode : (state) =>{
            state.mode = state.mode === "light" ? "dark" : "light"
        },
        setUser : (state,action) =>{
            state.user = action.payload.user
        },
        setLogin : (state,action) =>{
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout : (state) =>{
            state.user = null;
            state.token = null;
        },
        setFriends : (state,action) =>{
            if(state.user)
                state.friends = action.payload.friends;
            else console.error("User not logged in")
        },
        setPosts : (state,action) =>{
          state.posts = action.payload.posts;
        },
        setPost : (state,action) =>{
            const updatedPosts = state.posts.map((post)=>{
                if(post._id === action.payload.post._id) return action.payload.post
                return post
            })
            state.posts = updatedPosts
        }
    }
})

export const {setMode,setLogin,setLogout,setFriends,setPosts,setPost,setUser} = authSlice.actions;
export default authSlice.reducer;
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector, useDispatch } from "react-redux";
import { setPosts, setPost, setFriends } from "../state/index";
import { Link } from "react-router-dom";
import { toast, Bounce } from "react-toastify";

const Feed = ({ posts }) => {

  const dispatch = useDispatch();
  const User = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const mode = useSelector((state) => state.auth.mode);

  const [showcomment, setshowcomment] = useState(false);
  const [postid, setpostid] = useState(null);
  const [showimage, setshowimage] = useState(false);
  const [image, setimage] = useState(null);
  const [comment, setcomment] = useState("");
  const [editdes, seteditdes] = useState(false);
  const [des, setdes] = useState("");

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          background: "transparent",
          borderRadius: "50%",
          position: "absolute",
          right: "10px",
          zIndex: 2,
        }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          background: "transparent",
          borderRadius: "50%",
          position: "absolute",
          left: "10px",
          zIndex: 2,
        }}
        onClick={onClick}
      />
    );
  }

  const settings = {
    dots: true,
    infinite: false,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    cssEase: "linear",
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const settings2 = {
    dots: true,
    infinite: false,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    cssEase: "linear",
    arrows: false,
  };

  return (
    <div className="posts mt-2 flex flex-col gap-3">
      <div
        className={`${
          showimage ? "block" : "hidden"
        } fixed top-14 left-0 lg:left-10 w-full lg:w-[95vw] h-[90vh] ${
          mode === "light" ? "bg-black" : "bg-slate-600"
        } bg-opacity-70 z-10 flex items-center border-2 border-sky-400`}
      >
        <img
          src="/assets/cross.svg"
          alt="close"
          className="absolute top-0 right-3 w-8 h-8 cursor-pointer"
          onClick={() => {
            setshowimage(false);
          }}
        />
        <img
          className="cursor-pointer lg:w-[50%] w-[90%] h-full mx-auto object-contain"
          src={image}
          alt="user's pic"
        />
      </div>
      {posts.length !== 0 ? posts.map((post, index) => {
        return (
          <div
            className={`z-0 post px-6 py-2 flex flex-col ${
              mode === "dark" ? "bg-gray-700" : "bg-white"
            } rounded-lg`}
            key={index}
          >
            <div className="head flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <img
                  src={`http://localhost:5000/assets/${post.userPicturePath}`}
                  alt="dp"
                  className="w-12 h-12 rounded-full object-cover cursor-pointer"
                  onClick={() => {
                    setshowimage(true);
                    setimage(
                      `http://localhost:5000/assets/${post.userPicturePath}`
                    );
                  }}
                />
                <Link
                  to={`/profile/${post.userId}`}
                  className="cursor-pointer flex flex-col"
                >
                  <span className="text-md font-semibold hover:underline">
                    {post.firstName + " " + post.lastName}
                  </span>
                  <span className="text-sm text-gray-500 cursor-text">
                    {post.location}
                  </span>
                </Link>
              </div>
              <div className="left-head">
                {post.userId === User._id ? (
                  <div className="flex items-center gap-2">
                <img src="\assets\edit.svg" alt="edit" className={`h-6 w-6 cursor-pointer ${editdes?'hidden':'block'}`} onClick={()=>{
                    seteditdes(!editdes)
                    setdes(post.description)
                  }}/>
                  <img
                    src="\assets\delete.svg"
                    alt="delete"
                    className="h-6 w-6 cursor-pointer"
                    onClick={async () => {
                      let isConfirm = confirm(
                        "Are you sure you want to delete this post?"
                      );
                      if (isConfirm) {
                        let res = await fetch(
                          `http://localhost:5000/posts/${post._id}/delete`,
                          {
                            method: "DELETE",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: token,
                            },
                            body: JSON.stringify({
                              userId: User._id,
                            }),
                          }
                        );
                        let result = await res.json();
                        if (res.status === 200) {
                          dispatch(setPosts({ posts: result }));
                          toast.success("Post Deleted!", {
                            position: "top-right",
                            autoClose: 1000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                            transition: Bounce,
                          });
                        } else if (res.status === 409)
                          toast.error("Post Deletion Failed!", {
                            position: "top-right",
                            autoClose: 1000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                            transition: Bounce,
                          });
                      }
                    }}
                  />
                  </div>
                ) : (
                  <img
                    src={`${
                      User.friends.filter(
                        (friend) => friend._id === post.userId
                      ).length !== 0
                        ? "/assets/friend_added.svg"
                        : "/assets/friend.svg"
                    }`}
                    alt="add me"
                    className="w-4 h-4 cursor-pointer"
                    onClick={async () => {
                      let res = await fetch(
                        `http://localhost:5000/users/${User._id}/${post.userId}`,
                        {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: token,
                          },
                        }
                      );
                      let data = await res.json();
                      dispatch(setFriends({ friends: data }));
                    }}
                  />
                )}
              </div>
            </div>
            <p className={`my-2 text-sm ${editdes?'hidden':'block'}`}>{post.description}</p>
             <div className={`${editdes?'flex':'hidden'} items-center gap-2 mb-3`}>
              <input className="w-[85%] h-6 outline-none p-2 text-wrap" value={des} onChange={(e)=> setdes(e.target.value)}/>
              <button className="bg-sky-400 text-white p-2 px-4 rounded-full" onClick={
                async()=>{
                  seteditdes(!editdes)
                  let res = await fetch(`http://localhost:5000/posts/${post._id}/edit`,{
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: token,
                    },
                    body: JSON.stringify({
                      description: des
                    }),
                  });
                  let upd = await res.json();
                  console.log(upd)
                  if(res.status === 200)
                  dispatch(setPost({post: upd}));
                }}> Save
                </button>
             </div>

            <Slider
              {...(post.picturePath && post.videoPath ? settings : settings2)}
              className="gap-2 mb-3"
            >
              {post.picturePath && (
                <div
                  className={`w-full flex justify-center items-center bg-black`}
                >
                  <img
                    src={`http://localhost:5000/assets/${post.picturePath}`}
                    alt="post"
                    className="max-w-full mx-auto h-96 object-contain rounded-lg"
                  />
                </div>
              )}
              {post.videoPath && (
                <div className={`w-full flex items-center bg-black`}>
                  <video
                    className="max-w-full object-contain h-96 rounded-lg"
                    controls
                    autoPlay
                    muted
                    controlsList="nodownload"
                  >
                    <source
                      src={`http://localhost:5000/assets/${post.videoPath}`}
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </Slider>

            <div className="likes flex gap-6 mt-3">
              <div className="flex items-center gap-2">
                <img
                  src={
                    post.likes.hasOwnProperty(User._id)
                      ? "/assets/red_heart.svg"
                      : "/assets/heart.svg"
                  }
                  alt="like"
                  className="h-6 w-6 cursor-pointer"
                  id="like"
                  onClick={async () => {
                    let res = await fetch(
                      `http://localhost:5000/posts/${post._id}/like`,
                      {
                        method: "PATCH",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: token,
                        },
                        body: JSON.stringify({
                          userId: User._id,
                        }),
                      }
                    );
                    let upd = await res.json();
                    dispatch(setPost({ post: upd }));
                  }}
                />
                <span className="text-sm text-gray-500">
                  {Object.entries(post.likes).length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <img
                  src="\assets\comment.svg"
                  alt="comment"
                  className="h-6 w-6 cursor-pointer"
                  onClick={() => {
                    setshowcomment(!showcomment);
                    setpostid(post._id);
                  }}
                />
                <span className="text-sm text-gray-500">
                  {post.comments.length}
                </span>
              </div>
            </div>
            <div className={`comments ${
                      showcomment && postid === post._id ? "flex" : "hidden"
                    } flex-col`}>
                      
               <div className="add-comment my-3 flex gap-3">
                <input className="w-full h-10 p-3 bg-gray-100 rounded-2xl" type="text" value={comment} placeholder="Add a comment" onChange={(e)=>{setcomment(e.target.value)}}/>
                <button className="bg-sky-400 text-white px-4 py-2 rounded-full" onClick={async()=>{
                  let res = await fetch(`http://localhost:5000/posts/${post._id}/comment`,{
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: token,
                    },
                    body: JSON.stringify({
                      user:`${User.firstName} ${User.lastName}`,
                      comment: comment
                    }),
                  });
                  let upd = await res.json();
                  dispatch(setPost({post: upd}));
                  setcomment("");
                }}>Send</button>
               </div>

              {post.comments.map((comment, index) => {
                return (
                  <div
                    className= "comment flex flex-col p-2 rounded-lg"
                    key={index}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">
                        {comment.user}
                      </span>
                      <span className="text-xs text-gray-500">
                        {comment.comment}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }) : <div className="flex justify-center items-center text-red-500 text-lg font-semibold">No Posts Available!!!</div>}
    </div>
  );
};

export default Feed;

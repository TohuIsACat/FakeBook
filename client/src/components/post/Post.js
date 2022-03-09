import React, { useState, useEffect, useContext } from "react";
import "./postStyles/post.css";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import PostMenu from "../postMenu/PostMenu";
import { Avatar } from "@mui/material";
import Comment from "../comment/Comment";
import { FavoriteBorder, Favorite, FilterAlt } from "@mui/icons-material";

function Post({ post }) {
  const { currentUser, socket } = useContext(AuthContext);
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUser._id));
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [comments, setComments] = useState([]);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [sort, setSort] = useState(false);

  // user who post
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userID=${post.userID}`);
      setUser(res.data);
    };

    fetchUser();
  }, [post.userID]);

  // post's comment
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get("/comments/" + post._id);
        setComments(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchComments();
  }, [post._id]);

  // like
  const likeHandler = async () => {
    try {
      await axios.put("/posts/" + post._id + "/like", {
        userID: currentUser._id,
      });
      if (user._id !== currentUser._id && !isLiked) {
        socket.emit("sendNotification", {
          senderID: currentUser._id,
          receiverID: user._id,
          notificationType: 3,
          postNotificationType: 1,
        });
        // notification
        try {
          await axios.post("/notifications", {
            senderID: currentUser._id,
            receiverID: user._id,
            notificationType: 3,
            postNotificationType: 1,
          });
        } catch (e) {
          console.log(e);
        }
      }
    } catch (e) {
      console.log(e);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  // send comment
  const sendComment = async (e) => {
    if (e.key === "Enter") {
      const newComment = {
        postID: post._id,
        commenterID: currentUser._id,
        text: commentText,
      };
      try {
        const res = await axios.post("/comments", newComment);
        setComments(comments.concat(res.data));
        setCommentText("");
        // notification
        if (user._id !== currentUser._id) {
          socket.emit("sendNotification", {
            senderID: currentUser._id,
            receiverID: user._id,
            notificationType: 3,
            postNotificationType: 2,
          });
          try {
            await axios.post("/notifications", {
              senderID: currentUser._id,
              receiverID: user._id,
              notificationType: 3,
              postNotificationType: 2,
            });
          } catch (e) {
            console.log(e);
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  // sort
  const sortHandler = async () => {
    try {
      const res = await axios.get("/comments/" + post._id);
      sort
        ? setComments(
            res.data.sort((a, b) => {
              return new Date(a.createdAt) - new Date(b.createdAt);
            })
          )
        : setComments(
            res.data.sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            })
          );
      setSort(!sort);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <Avatar src={PF + user.profilePicture} />
            </Link>

            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            {user._id === currentUser._id && <PostMenu post={post} />}
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post.desc}</span>
          <img className="postImg" src={PF + post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            {isLiked ? (
              <Favorite className="likedIcon" onClick={likeHandler} />
            ) : (
              <FavoriteBorder className="likeIcon" onClick={likeHandler} />
            )}

            <span className="postLikeCounter">
              {like < 1 ? "Nobody like it." : like + " people like it."}
            </span>
          </div>
          <div className="postBottomRight">
            {commentOpen && (
              <FilterAlt className="sortIcon" onClick={sortHandler} />
            )}
            <span
              className="postCommentText"
              onClick={() => setCommentOpen(!commentOpen)}
            >
              {comments.length} comments
            </span>
          </div>
        </div>
        {/* comment part */}
        {commentOpen && (
          <div className="postComment">
            <div className="postCommentTop">
              <Avatar src={PF + currentUser.profilePicture} />
              <input
                type="text"
                className="commentInput"
                placeholder={
                  comments.length === 0
                    ? "Left your first comment..."
                    : "comment..."
                }
                onChange={(e) => {
                  setCommentText(e.target.value);
                }}
                value={commentText}
                onKeyDown={sendComment}
              />
            </div>
            {comments.map((c) => (
              <Comment key={c._id} comment={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;

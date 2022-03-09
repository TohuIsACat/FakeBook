import React, { useContext, useEffect, useState } from "react";
import "./feedStyles/feed.css";
import Share from "../share/Share";
import Post from "../post/Post";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useContext(AuthContext);

  //home(timeline post) or profile(personal post)
  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axios.get("/posts/profile/" + username)
        : await axios.get("posts/timeline/" + currentUser._id);

      const flatPosts = res.data.flat();
      setPosts(
        flatPosts.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [username, currentUser._id]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {/* home or currentUser's page */}
        {(!username || username === currentUser.username) && <Share />}
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}

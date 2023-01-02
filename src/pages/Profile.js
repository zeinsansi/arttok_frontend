import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const [posts, setPosts] = useState([]);
  const location = useLocation();
  const username = location.state;

  useEffect(() => {
      axios
        .get(`/image/profile/${username}`)
        .then((res) => {
          setPosts(res.data)
        });
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <div className="container" key={post.id}>
          <Link to={"/post"} state={post.id}>
            <div className="base">
              <img
                src={`data:image/jpeg;base64,${post.image}`}
                alt="post"
                className="image"
              />
            </div>
          </Link>
          <br/>
          <h6>{post.description}</h6>
        </div>
      ))}
    </div>
  );
}

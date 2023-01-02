import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("/image/home").then((res) => {
      setPosts(res.data);
    });
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <div className="container" key={post.id}>
          <Link to={"/profile"} state={post.user.username} style={{textDecoration: "none" ,color: "black"}}><h4>{post.user.username}</h4></Link>
          <p>{post.description}</p>
          <Link to={"/post"} state={post.id}>
            <div className="base">
              <img
                src={`data:image/jpeg;base64,${post.image}`}
                alt="post"
                className="image"
              />
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Home;

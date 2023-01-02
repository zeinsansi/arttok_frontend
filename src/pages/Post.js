import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Post.css";
import { useLocation } from "react-router-dom";
import { Input } from "reactstrap";
import Stomp from "stompjs";
import SockJS from "sockjs-client";

var stompClient = null;
export default function Posts() {
  const [post, setPost] = useState({});
  let [comments, setComments] = useState([]);
  const [commentMessage, setCommentMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const location = useLocation();
  const postId = location.state;

  useEffect(() => {
    async function fetchData() {
      try {
        console.log(postId)
        const [postResponse, commentsResponse] = await Promise.all([
          axios.get(`/image/fileSystem/${postId}`),
          axios.get(`http://localhost:8081/comment/getComments/${postId}`)
        ]);

        setPost(postResponse.data);
        setComments(
          comments = commentsResponse.data
        );
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
    registerClient();
  }, []);

  const registerClient = () => {
    let Sock = new SockJS("http://localhost:8081/ws");
    stompClient = Stomp.over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setConnected(true);
    setTimeout(function() {
      stompClient.subscribe("/comments", onCommentReceived );
  },100)};

  const onError=(err)=>{
    console.log(err);
  }

  const onCommentReceived =(payload) =>{
    let payLoadData = JSON.parse(payload.body)
    comments.push(payLoadData.body)
    setComments([...comments])
  } 

  async function addComment() {
    try {
      let commentDAO = {
        message: commentMessage.commentMessage,
        username: post.user.username,
        postId: postId,
    };
      stompClient.send("/app/add",{}, JSON.stringify(commentDAO));
      setCommentMessage("");
    } catch (err) {
      console.error(err);
    }
  }

  function commentChangeHandeler(e) {
    setCommentMessage({
      commentMessage: e.target.value,
    });
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      addComment();
      event.target.value = "";
    }
  };

  return (
    <div className="container1">
      <div className="container2">
        <img
          src={`data:image/jpeg;base64,${post.image}`}
          alt="Post"
          className="image2"
        />
      </div>
      <div className="container3">
        <div className="commentContainer">
          {comments.map((comment) => (
            <div className="container4" key={comment.id}>
              <span className="text">{comment.username}</span>
              <span className="text1">{comment.message}</span>
            </div>
          ))}
        </div>
        <Input
          type="text"
          placeholder="Nieuwe comment"
          className="textinput"
          onChange={commentChangeHandeler}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}

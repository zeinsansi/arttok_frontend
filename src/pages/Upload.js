import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";
import "./Upload.css";

export default function Upload() {
  const [file, setImage] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch("api/user", { credentials: "include" })
      .then((response) => response.text())
      .then((body) => {
        if (body === "") {
          setAuthenticated(false);
        } else {
          setAuthenticated(true);
        }
      });
  }, [setAuthenticated]);

  const login = () => {
    let port = window.location.port ? ":" + window.location.port : "";
    if (port === ":3000") {
      port = ":8080";
    }
    window.location.href = `//${window.location.hostname}${port}/private`;
  };

  function fileChangeHandler(e) {
    e.preventDefault();
    setImage({
      file: e.target.files[0],
    });
  }

  function saveDiscription(e) {
    e.preventDefault();
    setDescription({
      description: e.target.value,
    });
  }

  function fileUploadHandeler() {
    const formData = new FormData();
    if (file != null) {
      formData.append("file", file.file);      
      formData.append("description", description.description)
      axios
        .post("/image/fileSystem", formData, {
          headers: { "content-type": "multipart/form-data" },
        })
        .then((res) => {
          console.log(res);
        });
    }
  }

  const uploadPage = authenticated ? (
    <div>
      <label>
        <img
          src="https://play.teleporthq.io/static/svg/default-img.svg"
          alt="upload"
          className="page-image"
        />
        <input
          type="file"
          onChange={fileChangeHandler}
          style={{ display: "none" }}
        />
      </label>
      <button className="page-button button" onClick={fileUploadHandeler}>
        Upload
      </button>
      <input
        type="text"
        placeholder="Description"
        className="page-textinput input"
        onChange={saveDiscription}
      />
    </div>
  ) : (
    <div>
      <p>pleas Login</p>
      <Button style={{ background: "#c100e8", border: "none" }} onClick={login}>
        Login
      </Button>
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-base">{uploadPage}</div>
      <footer className="page-footer">
        <div className="page-separator"></div>
        <div className="page-container2">
          <span className="page-text">© 2022 arttok, All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  );
}

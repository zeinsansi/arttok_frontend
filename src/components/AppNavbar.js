import React, { useEffect, useState } from "react";
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler } from "reactstrap";
import { Link } from "react-router-dom";
import Logo_Arttok from "../images/Logo_Arttok.png";
import { Button } from "reactstrap";
import { useCookies } from "react-cookie";
import "./AppNavbar.css";
import Avatar from "boring-avatars";

const AppNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [cookies] = useCookies(["XSRF-TOKEN"]);

  useEffect(() => {
    fetch("api/user", { credentials: "include" })
      .then((response) => response.text())
      .then((body) => {
        if (body === "") {
          setAuthenticated(false);
        } else {
          setUser(JSON.parse(body));
          setAuthenticated(true);
        }
      });
  }, [setAuthenticated, setUser]);

  const login = () => {
    let port = window.location.port ? ":" + window.location.port : "";
    if (port === ":3000") {
      port = ":8080";
    }
    window.location.href = `//${window.location.hostname}${port}/private`;
  };

  const logout = () => {
    fetch("/api/logout", {
      method: "POST",
      credentials: "include",
      headers: { "X-XSRF-TOKEN": cookies["XSRF-TOKEN"] },
    })
      .then((res) => res.json())
      .then((response) => {
        window.location.href = `${response.logoutUrl}&returnTo=${window.location.origin}`;
      });
  };

  const button = authenticated ? (
    <div>
      <Link to={"/upload"} className="uploadLink">
        Upload
      </Link>
        <Link to={"/profile"} state={user.nickname}>
          <Avatar
            size={40}
            name={user.nickname}
            variant="beam"
            colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
          />
        </Link>
      <Button
        style={{ background: "#c100e8", border: "none", marginLeft: "20px" }}
        onClick={logout}
      >
        Logout
      </Button>
    </div>
  ) : (
    <div>
      <Button style={{ background: "#c100e8", border: "none" }} onClick={login}>
        Login
      </Button>
    </div>
  );

  return (
    <Navbar
      style={{
        padding: "0px 200px",
        background:
          "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(93,31,94,1) 0%, rgba(128,26,143,1) 36%, rgba(69,112,195,1) 75%, rgba(0,212,255,1) 100%",
      }}
      expand="lg"
      fixed="top"
    >
      <NavbarBrand tag={Link} to="/">
        <img src={Logo_Arttok} width="100" height="100" alt="Arttok logo" />
      </NavbarBrand>
      <NavbarToggler
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="justify-content-end" style={{ width: "100%" }} navbar>
          {button}
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default AppNavbar;

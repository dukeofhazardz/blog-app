import React, { useState, useEffect } from "react";
import api from "../api";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate, useLocation } from "react-router-dom";

const MyNav = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/user")
      .then(function (res) {
        setCurrentUser(res.data.user);
      })
      .catch(function (error) {
        setCurrentUser(null);
      });
  }, []);

  function logOut() {
    api.post("/api/logout", {
      refresh_token: localStorage.getItem("refresh_token"),
    });
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    api.defaults.headers["Authorization"] = null;
    setCurrentUser(null);
    navigate("/login", { state: { message: "Logout successful" } });
  }

  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand href="/home">Blogsite</Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="custom-navbar-toggle"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="justify-content-end" activeKey={location.pathname}>
            {currentUser ? (
              <>
                <Nav.Link href="/home">Home</Nav.Link>
                <Nav.Link href="/profile">Profile</Nav.Link>
                <Nav.Link href="/tags">Tags</Nav.Link>
                <Nav.Link href="/categories">Categories</Nav.Link>
                <Nav.Link href="/create-blog">Create Blog</Nav.Link>
                <Nav.Link onClick={() => logOut()}>Log out</Nav.Link>
                <Navbar.Text>
                  Signed in as: {currentUser.first_name} {currentUser.last_name}
                </Navbar.Text>
              </>
            ) : (
              <>
                <Nav.Link href="/register">Register</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNav;

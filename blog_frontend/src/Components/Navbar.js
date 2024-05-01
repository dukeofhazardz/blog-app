import React, { useState, useEffect } from 'react';
import api from '../api';
import Container from "react-bootstrap/Container";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from "react-bootstrap/Button";
import { Link } from 'react-router-dom';
import Form from "react-bootstrap/Form";
import { useNavigate } from 'react-router-dom';


const MyNav = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/user")
    .then(function(res) {
      setCurrentUser(res.data);
    })
    .catch(function(error) {
      setCurrentUser(null);
    });
  }, []);

  function submitLogout(e) {
    e.preventDefault();
    api.post(
      "/api/logout",
    ).then(function(res) {
      setCurrentUser(false);
      navigate("/login", { state: {message: "Logout successful"} });
    });
  }
  
  return (
    <div>
      <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/home">Blogsite</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/home">Home</Nav.Link>
          </Nav>
          {currentUser ? (
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                <Link to="/tags">
                  <Button id="form_btn" variant="light">Tags</Button>
                </Link>
              </Navbar.Text>
              <Navbar.Text>
                <Link to="/categories">
                  <Button id="form_btn" variant="light">Categories</Button>
                </Link>
              </Navbar.Text>
              <Navbar.Text>
                <Link to="/create-blog">
                  <Button id="form_btn" variant="light">Create Blog</Button>
                </Link>
              </Navbar.Text>
              <Navbar.Text>
                <form onSubmit={e => submitLogout(e)}>
                  <Button type="submit" variant="light">Log out</Button>
                </form>
              </Navbar.Text>
              <Navbar.Text>
                Signed in as: {currentUser.user.first_name} {currentUser.user.last_name}
              </Navbar.Text>
            </Navbar.Collapse>
          ) : (
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                <Link to="/register">
                  <Button id="form_btn" variant="light">Register</Button>
                </Link>
              </Navbar.Text>
              <Navbar.Text>
                <Link to="/login">
                  <Button id="form_btn" variant="light">Login</Button>
                </Link>
              </Navbar.Text>
            </Navbar.Collapse>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </div>
  )
}

export default MyNav;

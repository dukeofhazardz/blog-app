import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import MyNav from "../Components/Navbar";
import AppFooter from "../Components/Footer";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/esm/Container";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Register = () => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function submitRegistration(e) {
    e.preventDefault();
    if (
      !first_name.trim() ||
      !last_name.trim() ||
      !email.trim() ||
      !username.trim() ||
      !password.trim()
    ) {
      setError("All fields are required");
      return;
    }

    // Email validation
    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(email)) {
      setError("Invalid email address");
      return;
    }

    // Password validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    api
      .post("/api/register", {
        first_name: first_name,
        last_name: last_name,
        email: email,
        username: username,
        password: password,
      })
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setUsername("");
        setPassword("");
        setError("Registration failed");
      });
  }

  return (
    <div>
      <MyNav />
      <section id="blog" className="block blog-block">
        <Container fluid>
          <div className="title-holder">
            <h2>Register</h2>
            <div className="subtitle">register to join our community</div>
          </div>
        </Container>
        <div className="center">
          <Form onSubmit={(e) => submitRegistration(e)}>
            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter First Name"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter Last Name"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            {error && (
              <Alert key="danger" variant="danger">
                {error}
              </Alert>
            )}
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </section>
      <footer id="footer">
        <AppFooter />
      </footer>
    </div>
  );
};

export default Register;

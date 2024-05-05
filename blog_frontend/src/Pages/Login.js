import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import MyNav from "../Components/Navbar";
import AppFooter from "../Components/Footer";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/esm/Container";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function submitLogin(e) {
    e.preventDefault();

    // Basic validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    api
      .post("/api/token/", {
        email: email,
        password: password,
      })
      .then((res) => {
        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh);
        api.defaults.headers["Authorization"] =
          "JWT " + localStorage.getItem("access_token");
        setError("");
        setEmail("");
        setPassword("");
        navigate("/home", { state: { message: "Login successful" } });
      })
      .catch((error) => {
        setError("Invalid email or password");
        console.error("Login failed:", error);
      });
  }

  return (
    <div>
      <MyNav />
      <section id="blog" className="block blog-block">
        <Container fluid>
          <div className="title-holder">
            <h2>Login</h2>
            <div className="subtitle">login to engage with latest blogs</div>
          </div>
        </Container>
        <div className="center">
          <Form onSubmit={(e) => submitLogin(e)}>
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

export default Login;

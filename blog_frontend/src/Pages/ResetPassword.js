import React, { useState, useEffect } from "react";
import AppFooter from "../Components/Footer";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import MyNav from "../Components/Navbar";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";
import api from "../api";

const ResetPassword = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current user data
    api
      .get("/api/user")
      .then(function (res) {
        setCurrentUser(res.data.user);
      })
      .catch(function (error) {
        navigate("/login");
      });
  }, [navigate]);

  function submitLogin(e) {
    e.preventDefault();
    setMessage("");
    // Basic validation
    if (!password1.trim()) {
      setError("Password is required");
      return;
    }

    if (!password2.trim()) {
      setError("Password is required");
      return;
    }

    if (password1 !== password2) {
      setError("Passwords must match");
      return;
    }

    api
      .put(`/api/reset-password/${currentUser.id}/`, {
        password: password1,
      })
      .then(function (res) {
        setMessage("Password reset successfully");
        api.post("/api/logout").then(function (res) {
          setCurrentUser(null);
          navigate("/login", { state: { message: "Logout successful" } });
        });
      })
      .catch((error) => {
        setError("Invalid password");
        console.error("Password Reset Failed", error);
      });
  }

  return (
    <div>
      <MyNav />
      <section id="reset" className="block reset-block">
        <Container fluid>
          <div className="title-holder">
            <h2>Reset Your Password</h2>
            <div className="subtitle">be secured</div>
          </div>
          <Form className="reset-form" onSubmit={(e) => submitLogin(e)}>
            <Row className="justify-content-center">
              <Col sm={4}>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  required
                  value={password1}
                  onChange={(e) => setPassword1(e.target.value)}
                />
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col sm={4}>
                <Form.Control
                  type="password"
                  placeholder="Enter new password again"
                  required
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                />
              </Col>
            </Row>
            {error && (
              <Alert key="danger" variant="danger">
                {error}
              </Alert>
            )}
            {message && (
              <Alert key="success" variant="success">
                {message}
              </Alert>
            )}
            <div className="btn-holder">
              <Button type="submit">Submit</Button>
            </div>
          </Form>
        </Container>
      </section>

      <footer id="footer">
        <AppFooter />
      </footer>
    </div>
  );
};

export default ResetPassword;

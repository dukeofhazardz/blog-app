import React, { useState, useEffect } from "react";
import MyNav from "../Components/Navbar";
import AppFooter from "../Components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import api from "../api";

const UpdateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/user")
      .then(() => {
        return api.get(`/api/blog/${id}/`);
      })
      .then((res) => {
        setTitle(res.data.title);
        setContent(res.data.content);
      })
      .catch(function (error) {
        navigate("/login");
      });
  }, [navigate, id]);

  function updateBlog(e) {
    e.preventDefault();
    setMessage("");
    // Basic validation
    if (!title.trim() || !content.trim()) {
      setFormError("Please fill out all required fields");
      return;
    }

    const formData = new FormData();

    // Check if image is provided and is an image file
    if (image && image.type && !image.type.startsWith("image")) {
      setFormError("Please provide a valid image file");
      return;
    }

    // Check if image is provided and is an image file
    if (image && image.type && image.type.startsWith("image")) {
      formData.append("image", image);
    }

    formData.append("title", title);
    formData.append("content", content);

    api
      .put(`/api/update/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setMessage("Blogpost updated");
        setFormError("");
        setTitle("");
        setContent("");
        setImage("");
        navigate("/profile");
      })
      .catch((error) => {
        console.error("Error processing content", error);
      });
  }

  return (
    <div>
      <MyNav />
      <section id="update" className="block update-block">
        <Container fluid>
          <div className="title-holder">
            <h2>Update Blog</h2>
            <div className="subtitle">tell us what has changed</div>
          </div>
          <Form className="update-form" onSubmit={(e) => updateBlog(e)}>
            <Row className="justify-content-center">
              <Col sm={4}>
                <Form.Control
                  type="text"
                  placeholder="Enter new title here"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Form.Group>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setImage(e.target.files[0]);
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Form.Control
                  as="textarea"
                  placeholder="Enter new content here"
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </Col>
            </Row>
            {formError && (
              <Alert key="danger" variant="danger">
                {formError}
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

export default UpdateBlog;

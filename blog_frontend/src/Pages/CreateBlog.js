import React, { useState, useEffect } from "react";
import MyNav from "../Components/Navbar";
import AppFooter from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import moment from "moment";
import api from "../api";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [formError, setFormError] = useState("");
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current user data
    api
      .get("/api/user")
      .then(function (res) {
        setCurrentUser(res.data.user);
        api
          .get(`/api/blogs/author/${res.data.user.id}`)
          .then(function (res) {
            setUserBlogs(res.data.reverse());
          })
          .catch(function (error) {
            console.error("Error fetching user blogs:", error);
          });
      })
      .catch(function (error) {
        navigate("/login");
      });
  }, [navigate]);

  function postBlog(e) {
    e.preventDefault();
    setMessage("");

    // Basic validation
    if (!title.trim() || !content.trim() || !category.trim()) {
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
    formData.append("category", category);
    formData.append("tags", tags);

    api
      .post(`/api/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setFormError("");
        setTitle("");
        setContent("");
        setImage("");
        setCategory("");
        setTags("");
        setMessage("Blogpost created successfully");
        api
          .get(`/api/blogs/author/${currentUser.id}`)
          .then(function (res) {
            // Reverse the order of blogs to get the most recent first
            setUserBlogs(res.data.reverse());
          })
          .catch(function (error) {
            console.error("Error fetching user blogs:", error);
          });
      })
      .catch((error) => {
        console.error("Error processing content", error);
      });
  }

  function deleteBlog(blogId) {
    api
      .delete(`/api/delete/${blogId}`)
      .then(function (res) {
        setUserBlogs((prevUserBlogs) =>
          prevUserBlogs.filter((blog) => blog.id !== blogId)
        );
      })
      .catch(function (error) {
        console.error("Error deleting blog:", error);
      });
  }

  return (
    <div>
      <MyNav />
      <section id="create" className="block create-block">
        <Container fluid>
          <div className="title-holder">
            <h2>Create Blog Post</h2>
            <div className="subtitle">craft an amazing blogpost</div>
          </div>
          <Form className="create-form" onSubmit={(e) => postBlog(e)}>
            <Row>
              <Col sm={4}>
                <Form.Control
                  type="text"
                  placeholder="Enter your post title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Col>
              <Col sm={4}>
                <Form.Control
                  type="text"
                  placeholder="Enter your post category (e.g Technology)"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </Col>
              <Col sm={4}>
                <Form.Control
                  type="text"
                  placeholder="Enter your post tags (e.g #code #life)"
                  required
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
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
                  placeholder="Write your blogpost"
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

      {/* Display user blogs */}
      <section id="blog" className="block blog-block">
        <Container fluid>
          <div className="title-holder">
            <h2>Your blogposts</h2>
            <div className="subtitle">here are all of your uploaded posts</div>
          </div>
          <Row className="justify-content-center">
            {userBlogs.length > 0 ? (
              userBlogs.map((blog) => (
                <Col sm={4} key={blog.id}>
                  <div className="holder">
                    <Card>
                      <Card.Img variant="top" src={blog.image} />
                      <Card.Body>
                        <time>
                          {moment(blog.created_at).format(
                            "DD MMM YYYY, h:mm A"
                          )}
                        </time>
                        <Card.Title>{blog.title}</Card.Title>
                        <Card.Text>{blog.content}</Card.Text>
                        <a
                          href={`/blog-details/${blog.id}`}
                          className="btn btn-primary"
                        >
                          Read More <i className="fas fa-chevron-right"></i>
                        </a>
                        <div className="button-container">
                          <Button
                            variant="info"
                            href={`/update-blog/${blog.id}`}
                          >
                            Update Blog
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => deleteBlog(blog.id)}
                          >
                            Delete Blog
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
              ))
            ) : (
              <Col sm={4}>
                <div className="center">
                  <Card
                    style={{ width: "60rem" }}
                    border="warning"
                    className="text-center"
                  >
                    <Card.Body>Blogs will appear here.</Card.Body>
                  </Card>
                </div>
              </Col>
            )}
          </Row>
        </Container>
      </section>
      <footer id="footer">
        <AppFooter />
      </footer>
    </div>
  );
};

export default CreateBlog;

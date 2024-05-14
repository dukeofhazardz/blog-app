import React, { useState, useEffect } from "react";
import MyNav from "../Components/Navbar";
import AppFooter from "../Components/Footer";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import Carousel from "react-bootstrap/Carousel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import moment from "moment";
import api from "../api";

const BlogDetails = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [blog, setBlog] = useState({});
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);
  const [commentError, setCommentError] = useState("");
  const [message, setMessage] = useState("");
  const { id } = useParams();
  const baseURL = "http://127.0.0.1:8000/";

  useEffect(() => {
    // Fetch the current user data
    api
      .get("/api/user")
      .then((res) => {
        setCurrentUser(res.data.user);
      })
      .catch((error) => {
        console.log("Not Authenticated");
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the blog details
        const blogResponse = await api.get(`/api/blog/${id}`);
        const blogData = blogResponse.data;
        setBlog(blogData);

        // Fetch the user data for the blog author
        const userResponse = await api.get(`/api/user/${blogData.author}`);
        const userData = userResponse.data;
        setBlog((prevBlog) => ({ ...prevBlog, user: userData }));
      } catch (error) {
        console.error("Error fetching blog details:", error);
        setBlog({});
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the comments
        const commentsResponse = await api.get(`/api/comments/${id}`);
        const commentsData = commentsResponse.data.reverse();
        setComments(commentsData);

        // Fetch user data for each comment author
        const commentsWithData = await Promise.all(
          commentsData.map(async (comment) => {
            const userResponse = await api.get(`/api/user/${comment.author}`);
            const userData = userResponse.data.user;
            return { ...comment, user: userData };
          })
        );

        setComments(commentsWithData);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
      }
    };

    fetchData();
  }, [id]);

  function submitComment(e) {
    e.preventDefault();
    setMessage("");

    // Basic validation
    if (!content.trim()) {
      setCommentError("Comment cannot be empty");
      return;
    }

    api
      .post(`/api/comment/${id}/`, {
        content: content,
      })
      .then(() => {
        setCommentError("");
        setContent("");
        setMessage("Comment uploaded successfully");
        api
          .get(`/api/comments/${id}`)
          .then(function (res) {
            setComments(res.data.reverse());
          })
          .catch(function (error) {
            setComments([]);
          });
      })
      .catch((error) => {
        console.error("Error processing comment", error);
      });
  }

  return (
    <div>
      <MyNav />
      <section id="details" className="block bd-block">
        <Container fluid>
          <div className="title-holder">
            <h2>{blog.title}</h2>
            <div className="subtitle">details</div>
          </div>
          <Row>
            <Col sm={6}>
              <Image src={baseURL + blog.image} />
            </Col>
            <Col sm={6}>
              <Card>
                <Card.Body>
                  <blockquote className="blockquote mb-0">
                    <p> {blog.content} </p>
                    {blog.user && (
                      <footer className="blockquote-footer">
                        Posted by{" "}
                        <cite title="Source Title">
                          {blog.user.user.first_name} {blog.user.user.last_name}{" "}
                          {moment(blog.created_at).fromNow()}
                        </cite>
                      </footer>
                    )}
                  </blockquote>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Display Comment Form */}
      <section id="comment-form" className="block comment-block">
        <Container fluid>
          <div className="title-holder">
            <h2>Comment</h2>
            <div className="subtitle">engage with this post</div>
          </div>
          {currentUser ? (
            <Form className="comment-form" onSubmit={(e) => submitComment(e)}>
              <Row>
                <Col sm={12}>
                  <Form.Control
                    as="textarea"
                    placeholder="Enter your comment here"
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </Col>
              </Row>
              {commentError && (
                <Alert key="danger" variant="danger">
                  {commentError}
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
          ) : (
            <Row className="justify-content-center">
              <Col sm={4}>
                <div className="center">
                  <Card
                    style={{ width: "60rem" }}
                    border="warning"
                    className="text-center"
                  >
                    <Card.Body>Sign in to comment on this post.</Card.Body>
                  </Card>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      {/* Display comments */}
      <section id="comments" className="comments-block">
        <Container fluid>
          <div className="title-holder">
            <h2>Comments</h2>
            <div className="subtitle">
              what people are saying about this post
            </div>
          </div>
          <Carousel controls={false}>
            {comments.map((comment) => {
              return (
                <Carousel.Item key={comment.id}>
                  <blockquote>
                    <p>{comment.content}</p>
                    <cite>
                      <span className="name">
                        {comment.user && comment.user.first_name}{" "}
                        {comment.user && comment.user.last_name} @
                        {comment.user && comment.user.username}
                      </span>
                      <span className="designation">
                        {moment(comment.created_at).fromNow()}
                      </span>
                    </cite>
                  </blockquote>
                </Carousel.Item>
              );
            })}
          </Carousel>
        </Container>
      </section>

      <footer id="footer">
        <AppFooter />
      </footer>
    </div>
  );
};

export default BlogDetails;

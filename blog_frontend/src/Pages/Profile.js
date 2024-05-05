import React, { useState, useEffect } from "react";
import MyNav from "../Components/Navbar";
import ProfileInfo from "../Components/ProfileInfo";
import AppFooter from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import moment from "moment";
import api from "../api";

const Profile = () => {
  const [userBlogs, setUserBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current user data
    api
      .get("/api/user")
      .then(function (res) {
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
      {/* Display Profile details */}
      <div id="profile">
        <ProfileInfo />
      </div>

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

export default Profile;

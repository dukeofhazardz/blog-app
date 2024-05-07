import React, { useState, useEffect } from "react";
import MyNav from "../Components/Navbar";
import AppHero from "../Components/Hero";
import AppFooter from "../Components/Footer";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import moment from "moment";
import api from "../api";

const Home = () => {
  const [allBlogs, setallBlogs] = useState([]);
  const baseURL = "http://127.0.0.1:8000/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogsResponse = await api.get("/api/blog");
        const blogs = blogsResponse.data.reverse();
        setallBlogs(blogs);
      } catch (error) {
        setallBlogs([]);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <MyNav />
      <AppHero />
      <section id="blog" className="block blog-block">
        <Container fluid>
          <div className="title-holder">
            <h2>Latest from blog</h2>
            <div className="subtitle">get latest blogs from blogsite</div>
          </div>
          <Row className="justify-content-center">
            {allBlogs.length > 0 ? (
              allBlogs.map((blog) => (
                <Col sm={4} key={blog.id}>
                  <div className="holder">
                    <Card>
                      <Card.Img variant="top" src={baseURL + blog.image} />
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

export default Home;

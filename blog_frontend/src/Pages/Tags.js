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
import Badge from "react-bootstrap/Badge";
import moment from "moment";
import api from "../api";

const Tags = () => {
  const [allTags, setAllTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [taggedBlogs, setTaggedBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current user data
    api.get("/api/user").catch(function (error) {
      navigate("/login");
    });
  }, [navigate]);

  useEffect(() => {
    // Fetch all tags
    api
      .get("/api/tags")
      .then(function (res) {
        setAllTags(res.data);
      })
      .catch(function (error) {
        console.error("Error fetching tags:", error);
        setAllTags([]);
      });
  }, []);

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Fetch blogs based on selected tag
    const fetchData = async () => {
      try {
        const blogsResponse = await api.get(`/api/tag/${selectedTag}`);
        const blogs = blogsResponse.data.reverse();

        setTaggedBlogs(blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setTaggedBlogs([]);
      }
    };

    fetchData();
  };

  return (
    <div>
      <MyNav />
      <section id="tags" className="block tags-block">
        <Container fluid>
          <div className="title-holder">
            <h2>Filter Blogposts by Tag</h2>
            <div className="subtitle">search for your favourite #tags</div>
          </div>
          <Form className="tags-form" onSubmit={handleSubmit}>
            <Row className="justify-content-center">
              <Col sm={4}>
                <Form.Select onChange={handleTagChange} value={selectedTag}>
                  <option value="">Select...</option>
                  {allTags.map((tag) => (
                    <option key={tag.id} value={tag.name}>
                      {tag.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
            <div className="btn-holder">
              <Button type="submit">Submit</Button>
            </div>
          </Form>
        </Container>
      </section>

      <section id="blog" className="block blog-block">
        <Container fluid>
          <div className="title-holder">
            <h2>Results</h2>
            <div className="subtitle">
              blogs tagged &nbsp;<Badge bg="secondary">#{selectedTag}</Badge>
            </div>
          </div>
          <Row className="justify-content-center">
            {taggedBlogs.length > 0 ? (
              taggedBlogs.map((blog) => (
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
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
              ))
            ) : (
              <Col sm={4}>
                <div className="center">
                  <Card style={{ width: "60rem" }} className="text-center">
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

export default Tags;

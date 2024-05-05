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

const Category = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categorizedBlogs, setCategorizedBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current user data
    api.get("/api/user").catch(function (error) {
      navigate("/login");
    });
  }, [navigate]);

  useEffect(() => {
    // Fetch all categories
    api
      .get("/api/categories")
      .then(function (res) {
        setAllCategories(res.data);
      })
      .catch(function (error) {
        console.error("Error fetching categories:", error);
        setAllCategories([]);
      });
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Fetch blogs based on selected category
    const fetchData = async () => {
      try {
        const blogsResponse = await api.get(
          `/api/category/${selectedCategory}`
        );
        const blogs = blogsResponse.data.reverse();

        setCategorizedBlogs(blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setCategorizedBlogs([]);
      }
    };

    fetchData();
  };

  return (
    <div>
      <MyNav />
      <section id="category" className="block category-block">
        <Container fluid>
          <div className="title-holder">
            <h2>Filter by Category</h2>
            <div className="subtitle">select your category</div>
          </div>
          <Form className="category-form" onSubmit={handleSubmit}>
            <Row className="justify-content-center">
              <Col sm={4}>
                <Form.Select
                  onChange={handleCategoryChange}
                  value={selectedCategory}
                >
                  <option value="">Select...</option>
                  {allCategories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
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
              blogs categorized by &nbsp;
              <Badge bg="secondary">{selectedCategory}</Badge>
            </div>
          </div>
          <Row className="justify-content-center">
            {categorizedBlogs.length > 0 ? (
              categorizedBlogs.map((blog) => (
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

export default Category;

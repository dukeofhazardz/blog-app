import React, { useState, useEffect } from 'react';
import MyNav from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import api from '../api';

const Category = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categorizedBlogs, setCategorizedBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current user data
    api.get("/api/user")
      .then(function(res) {
        setCurrentUser(res.data);
      })
      .catch(function(error) {
        setCurrentUser(null);
        navigate("/login");
      });
  }, []);

	useEffect(() => {
    // Fetch all categories
    api.get("/api/categories")
      .then(function(res) {
        setAllCategories(res.data);
      })
      .catch(function(error) {
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
    if (selectedCategory) {
      api.get(`/api/category/${selectedCategory}`)
        .then(function(res) {
          setCategorizedBlogs(res.data);
        })
        .catch(function(error) {
          console.error("Error fetching blogs based on category:", error);
          setCategorizedBlogs([]);
        });
    } else {
      setCategorizedBlogs([]);
    }
  };

  return (
    <div>
      <MyNav />
      <div className="custom-container">
        <h5>Select Category</h5>
      </div>
      <div className="center">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formCategory">
            <Form.Label>Select a category:</Form.Label>
            <Form.Select onChange={handleCategoryChange} value={selectedCategory}>
              <option value="">Select...</option>
              {allCategories.map(category => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
      <div className="custom-container">
        <h5>Categorized Blogs</h5>
      </div>
      <div className="center">
        {categorizedBlogs.map(blog => (
          <Card key={blog.id} style={{ width: '18rem', margin: '0.5rem' }}>
            <Card.Body>
              <Card.Title>{blog.title}</Card.Title>
              <Card.Text>
                {blog.content}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Category;

import React, { useState, useEffect } from 'react';
import MyNav from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import moment from 'moment';
import api from '../api';

const Category = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categorizedBlogs, setCategorizedBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current user data
    api.get("/api/user")
      .catch(function(error) {
        navigate("/login");
      });
  }, [navigate]);

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
    const fetchData = async () => {
      try {
        const blogsResponse = await api.get(`/api/category/${selectedCategory}`);
        const blogs = blogsResponse.data.reverse();
  
        const blogsWithData = await Promise.all(
          blogs.map(async (blog) => {
            const userResponse = await api.get(`/api/user/${blog.author}`);
            const user = userResponse.data.user;
            return { ...blog, user };
          })
        );
  
        setCategorizedBlogs(blogsWithData);
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
          <Button className="mt-3" variant="outline-warning" type="submit">
            Submit
          </Button>
        </Form>
      </div>
      <div className="custom-container">
        <h5>Blogs Categorized by &nbsp;<Badge bg="secondary">{selectedCategory}</Badge></h5>
      </div>

      <div className="custom-container">
        {categorizedBlogs ? (
          <ul>
            {categorizedBlogs.map(blog => (
              <div className='center' key={blog.id}>
                <Card style={{ width: '60rem' }} border='warning' className='text-center'>
                  {blog.user ? (
                    <>
                      <Card.Header><strong>{blog.user.first_name} {blog.user.last_name}</strong></Card.Header>
                    </>
                  ) : (
                    <Card.Header>Loading user...</Card.Header>
                  )}
                  <Card.Body>
                    <Card.Title>{blog.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{selectedCategory}</Card.Subtitle>
                    <Card.Text>
                      {blog.content}
                    </Card.Text>
                    <Button variant="outline-dark" href={`/blog-details/${blog.id}`}>Details</Button>
                  </Card.Body>
                  <Card.Footer className="text-muted">{moment(blog.created_at).fromNow()}</Card.Footer>
                </Card>
              </div>
            ))}
          </ul>
        ) : (
          <p>No blogs found.</p>
        )}
      </div>
    </div>
  );
};

export default Category;

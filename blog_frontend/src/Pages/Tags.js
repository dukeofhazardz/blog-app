import React, { useState, useEffect } from 'react';
import MyNav from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import api from '../api';

const Tags = () => {
  const [allTags, setAllTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [taggedBlogs, setTaggedBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current user data
    api.get("/api/user")
      .catch(function(error) {
        navigate("/login");
      });
  }, [navigate]);

	useEffect(() => {
    // Fetch all tags
    api.get("/api/tags")
      .then(function(res) {
        setAllTags(res.data);
      })
      .catch(function(error) {
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
  
        const blogsWithData = await Promise.all(
          blogs.map(async (blog) => {
            const userResponse = await api.get(`/api/user/${blog.author}`);
            const user = userResponse.data.user;
            return { ...blog, user };
          })
        );
  
        setTaggedBlogs(blogsWithData);
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
      <div className="custom-container">
        <h5>Filter blogs by Tag</h5>
      </div>
      <div className="center">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTag">
            <Form.Label>Select a tag:</Form.Label>
            <Form.Select onChange={handleTagChange} value={selectedTag}>
              <option value="">Select...</option>
              {allTags.map(tag => (
                <option key={tag.id} value={tag.name}>{tag.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
      <div className="custom-container">
        <h5>Blogs Tagged #{selectedTag}</h5>
      </div>
      
      <div className="custom-container">
        {taggedBlogs ? (
          <ul>
            {taggedBlogs.map(blog => (
              <div className='center' key={blog.id}>
                <Card style={{ width: '60rem' }}>
                  <Card.Body>
                    {blog.user ? (
                      <>
                        <Card.Title>{blog.user.first_name} {blog.user.last_name}</Card.Title>
                      </>
                    ) : (
                      <Card.Title>Loading user...</Card.Title>
                    )}
                    <Card.Title>{blog.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{blog.created_at}</Card.Subtitle>
                    <Card.Text>
                      {blog.content}
                    </Card.Text>
                    <Button variant="primary" href={`/blog-details/${blog.id}`}>Details</Button>
                  </Card.Body>
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

export default Tags;

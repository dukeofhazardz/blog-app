import React, { useState, useEffect } from 'react';
import MyNav from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import moment from 'moment';
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
          <Button className="mt-3" variant="outline-info" type="submit">
            Submit
          </Button>
        </Form>
      </div>
      <div className="custom-container">
        <h5>Blogs Tagged &nbsp;<Badge bg="secondary">#{selectedTag}</Badge></h5>
      </div>
      
      <div className="custom-container">
        {taggedBlogs ? (
          <ul>
            {taggedBlogs.map(blog => (
              <div className='center' key={blog.id}>
                <Card style={{ width: '60rem' }} border='info' className='text-center'>
                  {blog.user ? (
                    <>
                      <Card.Header><strong>{blog.user.first_name} {blog.user.last_name}</strong></Card.Header>
                    </>
                  ) : (
                    <Card.Header>Loading user...</Card.Header>
                  )}
                  <Card.Body>
                    <Card.Title>{blog.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">#{selectedTag}</Card.Subtitle>
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

export default Tags;

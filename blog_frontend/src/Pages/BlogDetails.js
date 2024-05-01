import React, { useState, useEffect } from 'react';
import MyNav from '../Components/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import api from '../api';

const BlogDetails = () => {
  const [blog, setBlog] = useState({});
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);
  const [commentError, setCommentError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Fetch the current user data
    api.get("/api/user")
      .catch(function(error) {
        navigate("/login");
      });
  }, [navigate]);


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
        setBlog(prevBlog => ({ ...prevBlog, user: userData }));
      } catch (error) {
        console.error("Error fetching blog details:", error);
        setBlog({});
      }
    };
  
    fetchData();
  }, [id]);

  useEffect(() => {
    api.get(`/api/comments/${id}`)
      .then(function(res) {
        setComments(res.data);
      })
      .catch(function(error) {
        setComments([]);
      });
  }, [id]);

  function submitComment(e) {
    e.preventDefault();

    // Basic validation
    if (!content.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }

    api.post(
      `/api/comment/${id}/`,
      {
        content: content
      },
    ).then(() => setCommentError('')).catch(error => {
      console.error('Error processing comment', error);
    });
  }

  return (
    <div>
      <MyNav />
      <div className="custom-container">
        <h5>Blog Details Page</h5>
      </div>
      <div className='center'>
        <Card style={{ width: '60rem' }}>
          <Card.Body>
            {blog.user && (
              <Card.Title>{blog.user.user.first_name} {blog.user.user.last_name}</Card.Title>
            )}
            <Card.Title>{blog.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{blog.created_at}</Card.Subtitle>
            <Card.Text>
              {blog.content}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
      <div className='center'>
        <Form onSubmit={e => submitComment(e)}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Comment</Form.Label>
            <Form.Control size="lg" type="text" placeholder="Enter comment here" value={content} onChange={e => setContent(e.target.value)} />
          </Form.Group>
          {commentError && <p className="text-danger">{commentError}</p>}
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
      {/* Display comments */}
      <div className="center">
        {comments.map(comment => (
          <Card key={comment.id} style={{ width: '60rem', marginTop: '20px' }}>
            <Card.Body>
              <Card.Title>A user commented</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Time: {comment.created_at}</Card.Subtitle>
              <Card.Text>
                {comment.content}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogDetails;
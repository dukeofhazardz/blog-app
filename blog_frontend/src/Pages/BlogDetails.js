import React, { useState, useEffect } from 'react';
import MyNav from '../Components/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import moment from 'moment';
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
    ).then(() => {
      setCommentError('')
      setContent('');
      api.get(`/api/comments/${id}`)
      .then(function(res) {
        setComments(res.data.reverse());
      })
      .catch(function(error) {
        setComments([]);
      });
    }).catch(error => {
      console.error('Error processing comment', error);
    });
  }

  return (
    <div>
      <MyNav />
      <div className="custom-container">
        <h5>View Blog</h5>
      </div>
      <div className='center'>
        <Card style={{ width: '60rem' }} border='info' className='text-center'>
          {blog.user && (
            <Card.Header><strong>{blog.user.user.first_name} {blog.user.user.last_name}</strong></Card.Header>
          )}
          <Card.Body>
            <Card.Title>{blog.title}</Card.Title>
            <Card.Text>
              {blog.content}
            </Card.Text>
          </Card.Body>
          <Card.Footer className="text-muted">{moment(blog.created_at).fromNow()}</Card.Footer>
        </Card>
      </div>
      <div className='center'>
        <Form onSubmit={e => submitComment(e)}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Control as="textarea" rows={3} size="lg" type="text" placeholder="Enter comment here" value={content} onChange={e => setContent(e.target.value)} />
          </Form.Group>
          {commentError && <Alert key='danger' variant='danger'>{commentError}</Alert>}
          <Button variant="outline-info" type="submit">
            Submit
          </Button>
        </Form>
      </div>
      {/* Display comments */}
      <div className="custom-container">
        <ul>
          {comments.map(comment => (
            <div className='center' key={comment.id}>
              <Card id={comment.id} border='warning' className='text-center'style={{ width: '60rem', marginBottom: '-25px' }}>
                <Card.Header><strong>@{comment.user && comment.user.username} commented</strong></Card.Header>
                <Card.Body>
                  <Card.Text>
                    {comment.content}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="mb-2 text-muted">{moment(comment.created_at).fromNow()}</Card.Footer>
              </Card>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BlogDetails;
import React, { useState, useEffect } from 'react';
import MyNav from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import moment from 'moment';
import api from '../api';

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [formError, setFormError] = useState("");
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current user data
    api.get("/api/user")
      .then(function(res) {
        setCurrentUser(res.data.user);
        api.get(`/api/blogs/author/${res.data.user.id}`)
          .then(function(res) {
            setUserBlogs(res.data.reverse());
          })
          .catch(function(error) {
            console.error("Error fetching user blogs:", error);
          });
      })
      .catch(function(error) {
        navigate("/login");
      });
  }, [navigate]);


  function postBlog(e) {
    e.preventDefault();
    setMessage("")

     // Basic validation
     if (!title.trim() || !content.trim() || !category.trim()) {
      setFormError('Please fill out all required fields');
      return;
    }

    api.post(
      `/api/create`,
      {
        title: title,
        content: content,
        category: category,
        tags: tags
      }
    ).then(() => {
      setFormError("");
      setTitle("");
      setContent("");
      setCategory("");
      setTags("");
      setMessage('Blogpost created successfully')
      api.get(`/api/blogs/author/${currentUser.id}`)
        .then(function(res) {
          // Reverse the order of blogs to get the most recent first
          setUserBlogs(res.data.reverse());
        })
        .catch(function(error) {
          console.error("Error fetching user blogs:", error);
        });
    }).catch(error => {
      console.error('Error processing content', error);
    });
  }

  function deleteBlog(blogId) {
    api.delete(`/api/delete/${blogId}`)
    .then(function(res) {
      setUserBlogs(prevUserBlogs => prevUserBlogs.filter(blog => blog.id !== blogId));
    })
		.catch(function(error) {
      console.error("Error deleting blog:", error);
    });
  }

  return (
    <div>
      <MyNav />
      <div className="custom-container">
        <h5>Create Blog Post</h5>
      </div>
      <div className='center'>
        <Form onSubmit={e => postBlog(e)}>
          <Form.Group className="mb-3" controlId="formBasicTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" placeholder="Enter Title here" value={title} onChange={e => setTitle(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicContent">
            <Form.Label>Content</Form.Label>
            <Form.Control as="textarea" rows={3} size="lg" type="text" placeholder="Enter Content here" value={content} onChange={e => setContent(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCategory">
            <Form.Label>Category</Form.Label>
            <Form.Control type="text" placeholder="(e.g Technology)" value={category} onChange={e => setCategory(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicTags">
            <Form.Label>Tags</Form.Label>
            <Form.Control type="text" placeholder="(e.g #code #life)" value={tags} onChange={e => setTags(e.target.value)} />
          </Form.Group>
          {formError && <Alert key='danger' variant='danger'>{formError}</Alert>}
          {message && <Alert key='success' variant='success'>{message}</Alert>}

          <Button variant="outline-info" type="submit">
            Submit
          </Button>
        </Form>
      </div>
      {/* Display user blogs */}
      <div className="custom-container">
        <h5>Your Blogs</h5>
        {userBlogs.length > 0 ? (
          <ul>
            {userBlogs.map(blog => (
              <div className='center' key={blog.id}>
                <Card style={{ width: '60rem' }} border='info' className='text-center'>
                  {currentUser ? (
                    <>
                      <Card.Header><strong>{currentUser.first_name} {currentUser.last_name}</strong></Card.Header>
                    </>
                  ) : (
                    <Card.Header>Loading user...</Card.Header>
                  )}
                  <Card.Body>
                    <Card.Title>{blog.title}</Card.Title>
                    <Card.Text>
                      {blog.content}
                    </Card.Text>
                    <div className="button-container">
											<Button variant="info" href={`/blog-details/${blog.id}`}>Details</Button>    
											<Button variant="info" href={`/update-blog/${blog.id}`}>Update Blog</Button>
											<Button variant="danger" onClick={() => deleteBlog(blog.id)}>Delete Blog</Button>
										</div>
                  </Card.Body>
                  <Card.Footer className="text-muted">{moment(blog.created_at).fromNow()}</Card.Footer>
                </Card>
              </div>
            ))}
          </ul>
        ) : (
          <div className='center'>
            <Card style={{ width: '60rem' }} border='warning' className='text-center'>
              <Card.Body>Blogs will appear here.</Card.Body>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateBlog

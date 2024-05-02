import React, { useState, useEffect } from 'react';
import MyNav from '../Components/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import api from '../api';

const UpdateBlog = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [ message, setMessage ] = useState("")
    const [formError, setFormError] = useState('');
    const { id } = useParams();
  
    const navigate = useNavigate();
  
    useEffect(() => {
      api.get("/api/user")
        .catch(function(error) {
          navigate("/login");
        });
    }, [navigate]);
  
  
    function updateBlog(e) {
      e.preventDefault();
			setMessage('')
      // Basic validation
			if (!title.trim() || !content.trim()) {
        setFormError('Please fill out all required fields');
        return;
      }
  
      api.put(
        `/api/update/${id}/`,
        {
          title: title,
          content: content
        }
      ).then(() => {
        setMessage('Blogpost updated')
        setFormError("");
        setTitle("");
        setContent("");
        navigate("/profile");
      }).catch(error => {
        console.error('Error processing content', error);
      });
    }

    return (
      <div>
        <MyNav />
        <div className="custom-container">
          <h5>Update Blog Post</h5>
        </div>
        <div className='center'>
          <Form onSubmit={e => updateBlog(e)}>
            <Form.Group className="mb-3" controlId="formBasicTitle">
              <Form.Label>Update Title</Form.Label>
              <Form.Control type="text" placeholder="Enter new Title here" value={title} onChange={e => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicContent">
              <Form.Label>Update Content</Form.Label>
              <Form.Control as="textarea" rows={3} size="lg" type="text" placeholder="Enter new Content here" value={content} onChange={e => setContent(e.target.value)} />
            </Form.Group>
            {formError && <Alert key='danger' variant='danger'>{formError}</Alert>}
            {message && <Alert key='success' variant='success'>{message}</Alert>}
            <Button variant="outline-primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    )
}

export default UpdateBlog

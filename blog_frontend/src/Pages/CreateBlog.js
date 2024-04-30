import React, { useState, useEffect } from 'react';
import MyNav from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import api from '../api';
import Cookies from 'js-cookie';

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [formError, setFormError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

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

  function postBlog(e) {
    e.preventDefault();

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
      }, { withCredentials: true, withXSRFToken: true, headers: { 'X-CSRFToken': Cookies.get('csrftoken') }},
    ).then(() => {
      setFormError('');
    }).catch(error => {
      console.error('Error processing comment', error);
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
            <Form.Control size="lg" type="text" placeholder="Enter Content here" value={content} onChange={e => setContent(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCategory">
            <Form.Label>Category</Form.Label>
            <Form.Control type="text" placeholder="(e.g Technology)" value={category} onChange={e => setCategory(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicTags">
            <Form.Label>Tags</Form.Label>
            <Form.Control type="text" placeholder="(e.g #code #life)" value={tags} onChange={e => setTags(e.target.value)} />
          </Form.Group>
          {formError && <p className="text-danger">{formError}</p>}
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default CreateBlog

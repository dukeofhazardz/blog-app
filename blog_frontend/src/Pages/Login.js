import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import MyNav from '../Components/Navbar';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  function submitLogin(e) {
    e.preventDefault();

    // Basic validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    api.post(
      "/api/login",
      {
        email: email,
        password: password
      }
    ).then(function(res) {
      setError('');
      setEmail('');
      setPassword('');
      navigate("/home", { state: {message: "Login successful"} });
    }).catch(error => {
      setError('Invalid email or password');
      console.error('Login failed:', error);
    });
  }

  return (
    <div>
      <MyNav />
      <div className="custom-container">
        <h5>Login Page</h5>
      </div>
      <div className='center'>
        <Form onSubmit={e => submitLogin(e)}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          </Form.Group>
          {error && <Alert key='danger' variant='danger'>{error}</Alert>}
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default Login

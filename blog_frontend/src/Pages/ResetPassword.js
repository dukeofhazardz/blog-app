import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import MyNav from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ResetPassword = () => {
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  function submitLogin(e) {
    e.preventDefault();
    setMessage('')
    // Basic validation
    if (!password1.trim()) {
      setError('Password is required');
      return;
    }

    if (!password2.trim()) {
      setError('Password is required');
      return;
    }

    if (password1 !== password2) {
      setError('Passwords must match');
      return;
    }

    api.post(
      "/api/login",
      {
        password1: password1,
        password2: password2
      }
    ).then(function(res) {
      setMessage('Password reset successfully')
      setError('');
      navigate("/profile", { state: {message: "Password reset successful"} });
    }).catch(error => {
      setError('Invalid password');
      console.error('Password Reset Failed', error);
    });
  }

  return (
    <div>
      <MyNav />
      <div className="custom-container">
        <h5>Reset Password</h5>
      </div>
      <div className='center'>
        <Form onSubmit={e => submitLogin(e)}>
        <Form.Group className="mb-3" controlId="formBasicPassword1">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter new password" value={password1} onChange={e => setPassword1(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword2">
            <Form.Label>Password again</Form.Label>
            <Form.Control type="password" placeholder="Enter new password again" value={password2} onChange={e => setPassword2(e.target.value)} />
          </Form.Group>
          {message && <p className="text-success">{message}</p>}
          {error && <p className="text-danger">{error}</p>}
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default ResetPassword

import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import MyNav from '../Components/Navbar';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ResetPassword = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
		// Fetch the current user data
		api.get("/api/user")
			.then(function(res) {
        setCurrentUser(res.data.user)
			})
			.catch(function(error) {
				navigate("/login");
			});
	}, [navigate]);

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

    api.put(
      `/api/reset-password/${currentUser.id}/`,
      {
        password: password1
      }
    ).then(function(res) {
      setMessage('Password reset successfully')
      api.post(
        "/api/logout",
      ).then(function(res) {
        setCurrentUser(null);
        navigate("/login", { state: {message: "Logout successful"} });
      });
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
          {error && <Alert key='danger' variant='danger'>{error}</Alert>}
          {message && <Alert key='success' variant='success'>{message}</Alert>}
          <Button variant="outline-primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default ResetPassword

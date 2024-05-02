import React, { useState, useEffect } from 'react';
import MyNav from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import Badge from 'react-bootstrap/Badge';
import moment from "moment";
import api from '../api';

const Profile = () => {
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
				{/* Display user details */}
			<div className="center profile">
					{currentUser && (
					<Card style={{ width: '60rem' }} border='warning' className='text-center'>
							<Card.Header as="h4">Profile</Card.Header>
							<Card.Body>
							<Card.Title>{currentUser.first_name} {currentUser.last_name}</Card.Title>
							<Card.Title><Badge bg="dark" text="light">@{currentUser.username}</Badge></Card.Title>
							<Card.Title>📧 <Badge bg="info">{currentUser.email}</Badge></Card.Title>
							<div className='button-container profile'>
								<Button variant="warning" href={'/create-blog'}>Create Blogpost</Button>
								<Button variant="outline-danger" href={'/reset-password'}>Reset Password</Button>
							</div>
							</Card.Body>
					</Card>
					)}
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
							<Card.Body>Your blogs will appear here.</Card.Body>
						</Card>
					</div>
				)}
			</div>
		</div>
	);
}

export default Profile

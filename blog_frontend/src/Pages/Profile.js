import React, { useState, useEffect } from 'react';
import MyNav from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
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
			<div className="custom-container">
					{currentUser && (
					<Card style={{ width: '60rem' }}>
							<Card.Body>
							<Card.Title>{currentUser.first_name} {currentUser.last_name}</Card.Title>
							<Card.Title>EMAIL: {currentUser.email}</Card.Title>
							<Card.Title>Username: @{currentUser.username}</Card.Title>
							<div className='button-container'>
								<Button variant="primary" href={'/create-blog'}>Create Blogpost</Button>
								<Button variant="danger" href={'/reset-password'}>Reset Password</Button>
							</div>
							</Card.Body>
					</Card>
					)}
			</div>

			{/* Display user blogs */}
			<div className="custom-container">
				<h5>Your Blogs</h5>
				{userBlogs ? (
					<ul>
						{userBlogs.map(blog => (
							<div className='center' key={blog.id}>
								<Card style={{ width: '60rem' }}>
									<Card.Body>
										{currentUser ? (
											<>
												<Card.Title>{currentUser.first_name} {currentUser.last_name}</Card.Title>
											</>
										) : (
											<Card.Title>Loading user...</Card.Title>
										)}
										<Card.Title>{blog.title}</Card.Title>
										<Card.Subtitle className="mb-2 text-muted">{blog.created_at}</Card.Subtitle>
										<Card.Text>
											{blog.content}
										</Card.Text>
										<div className="button-container">
											<Button variant="primary" href={`/blog-details/${blog.id}`}>Details</Button>    
											<Button variant="primary" href={`/update-blog/${blog.id}`}>Update Blog</Button>
											<Button variant="danger" onClick={() => deleteBlog(blog.id)}>Delete Blog</Button>
										</div>
									</Card.Body>
								</Card>
							</div>
						))}
					</ul>
				) : (
					<p>Your blogs will appear here.</p>
				)}
			</div>
		</div>
	);
}

export default Profile

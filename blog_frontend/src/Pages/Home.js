import React, { useState, useEffect } from 'react';
import MyNav from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import api from '../api';

const Home = () => {
  const [ allBlogs, setallBlogs ] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogsResponse = await api.get("/api/blog");
        const blogs = blogsResponse.data;
  
        const blogsWithData = await Promise.all(
          blogs.map(async (blog) => {
            const userResponse = await api.get(`/api/user/${blog.author}`);
            const user = userResponse.data;
            return { ...blog, user };
          })
        );
  
        setallBlogs(blogsWithData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setallBlogs([]);
      }
    };
  
    fetchData();
  }, []);

  return (
    <div>
      <MyNav />
      <div className="custom-container">
        <h5>Welcome to Blogsite</h5>
        {allBlogs ? (
          <ul>
            {allBlogs.map(blog => (
              <div className='center' key={blog.id}>
                <Card style={{ width: '60rem' }}>
                  <Card.Body>
                    {blog.user ? (
                      <>
                        <Card.Title>{blog.user.user.first_name} {blog.user.user.last_name}</Card.Title>
                      </>
                    ) : (
                      <Card.Title>Loading user...</Card.Title>
                    )}
                    <Card.Title>{blog.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{blog.created_at}</Card.Subtitle>
                    <Card.Text>
                      {blog.content}
                    </Card.Text>
                    <Card.Link href={`/blog-details/${blog.id}`}>Details</Card.Link>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </ul>
        ) : (
          <p>No blogs found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
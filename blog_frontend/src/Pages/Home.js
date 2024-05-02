import React, { useState, useEffect } from 'react';
import MyNav from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import api from '../api';

const Home = () => {
  const [ allBlogs, setallBlogs ] = useState([]);
  const navigate = useNavigate();


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
        const blogsResponse = await api.get("/api/blog");
        const blogs = blogsResponse.data.reverse();
  
        const blogsWithData = await Promise.all(
          blogs.map(async (blog) => {
            const userResponse = await api.get(`/api/user/${blog.author}`);
            const user = userResponse.data.user;
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
        {allBlogs.length > 0 ? (
          <ul>
            {allBlogs.map(blog => (
              <div className='center' key={blog.id}>
                <Card style={{ width: '60rem' }} border='info' className='text-center'>
                  {blog.user ? (
                    <>
                      <Card.Header><strong>{blog.user.first_name} {blog.user.last_name}</strong></Card.Header>
                    </>
                  ) : (
                    <Card.Header>Loading user...</Card.Header>
                  )}
                  <Card.Body>
                    <Card.Title>{blog.title}</Card.Title>
                    <Card.Text>
                      {blog.content}
                    </Card.Text>
                    <Button variant="info" href={`/blog-details/${blog.id}`}>Details</Button>
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
  );
};

export default Home;
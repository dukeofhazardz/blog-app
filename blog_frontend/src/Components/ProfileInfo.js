import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import api from "../api";

function ProfileInfo() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    api
      .get("/api/user")
      .then(function (res) {
        setCurrentUser(res.data.user);
      })
      .catch(function (error) {
        setCurrentUser(null);
      });
  }, []);

  return (
    <Container fluid>
      {currentUser ? (
        <>
          <h2 className="profile-info title">
            {currentUser.first_name} {currentUser.last_name}
          </h2>
          <p className="profile-info">@{currentUser.username}</p>
          <p className="profile-info">📧 {currentUser.email}</p>
          <div className="button-container profile">
            <Button variant="outline-light" href={"/create-blog"}>
              Create Blogpost
            </Button>
            <Button variant="outline-light" href={"/reset-password"}>
              Reset Password
            </Button>
          </div>
          <div className="socials">
            <ul>
              <li>
                <a href="https://www.facebook.com">
                  <i className="fab fa-facebook-f"></i>
                </a>
              </li>
              <li>
                <a href="https://www.twitter.com">
                  <i className="fab fa-twitter"></i>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <div>Loading user...</div>
      )}
    </Container>
  );
}

export default ProfileInfo;

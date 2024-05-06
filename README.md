## BlogSite Application

Welcome to BlogSite, an advanced blogging platform that empowers users to create, manage, and share their thoughts and ideas with the world. With a beautiful user interface and a wide range of features, BlogSite offers everything you need to express yourself and connect with others through written content.

### Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
    - [User Authentication](#authentication)
    - [User Registration](#registration)
    - [User Login](#login)
    - [Create Blog Post](#create-blog)
    - [Update Blog Post](#update-blog)
    - [Delete Blog Post](#delete-blog)
    - [Filter Posts](#filter-posts)
    - [Reset Password](#reset-password)
3. [Technologies](#technologies)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Contributing](#contributing)
7. [Authors](#authors)
8. [License](#license)

<a name="introduction"></a>
### Introduction

BlogSite is a full-featured blogging application that provides users with a seamless experience for creating, editing, and managing their blog posts. Built using Python Django for the backend and React Bootstrap for the frontend, BlogSite offers a modern and responsive user interface.

<a name="features"></a>
### Features

<a name="authentication"></a>
#### User Authentication

BlogSite utilizes JWT (JSON Web Tokens) for user authentication, ensuring secure access to user accounts and blog-related functionalities.

<a name="registration"></a>
#### User Registration

![register](https://github.com/dukeofhazardz/blog-app/assets/113605239/1230ec80-0a93-477d-8967-8b07b422cb52)

Users can easily register for a new account on BlogSite by providing basic information such as username, email address, and password.

<a name="login"></a>
#### User Login

![login](https://github.com/dukeofhazardz/blog-app/assets/113605239/62beb8d1-eaf4-48b4-89d9-432597fb5d9b)

Registered users can securely log in to their accounts using their email address and password.

<a name="create-blog"></a>
#### Create Blog Post

![create](https://github.com/dukeofhazardz/blog-app/assets/113605239/396b72e3-9de1-4e06-9d1c-ca9ce479acf0)

Once logged in, users can create new blog posts by entering a title, content, and optionally adding tags or selecting a category.

<a name="update-blog"></a>
#### Update Blog Post

![update](https://github.com/dukeofhazardz/blog-app/assets/113605239/645bf71b-3b94-4fb8-b746-a7aae8419d2f)

Users have the ability to update their existing blog posts, allowing them to make edits or additions as needed.

<a name="delete-blog"></a>
#### Delete Blog Post

![delete](https://github.com/dukeofhazardz/blog-app/assets/113605239/5edbf8ba-77dc-4ac8-89d9-55b79b57cb87)

In addition to updating blog posts, users can also delete their own blog posts if desired.

<a name="filter-posts"></a>
#### Filter Posts

![tag](https://github.com/dukeofhazardz/blog-app/assets/113605239/f5aa0e85-d242-4415-9512-ac775fd7710c)

![category](https://github.com/dukeofhazardz/blog-app/assets/113605239/6d18b4f9-aeb0-41e4-8752-8c5bbf6dffb6)

BlogSite enables users to filter posts by categories or tags, making it easy to discover content based on specific topics or interests.

<a name="reset-password"></a>
#### Reset Password

![reset-pw](https://github.com/dukeofhazardz/blog-app/assets/113605239/11ff994e-d536-4a85-97bf-71ef31eb650b)

For added security and convenience, BlogSite includes a password reset feature that allows users to reset their password in case they forget it.

<a name="technologies"></a>
### Technologies

BlogSite is built using the following technologies:

- **Python Django**: A high-level Python web framework that encourages rapid development and clean, pragmatic design.
- **React Bootstrap**: A front-end framework built on top of React, offering a set of responsive and reusable components for building user interfaces.
- **PostgreSQL**: A powerful, open-source relational database management system.
- **JWT (JSON Web Tokens)**: A compact, URL-safe means of representing claims to be transferred between two parties.

<a name="installation"></a>
### Installation

To install and run BlogSite locally, follow these steps:

1. Clone the GitHub repository to your local machine.
2. Navigate to the project directory.
3. Install the required dependencies using `pip install -r requirements.txt`.
4. Configure the PostgreSQL database settings in the `settings.py` file.
5. Run the Django migrations to create the necessary database tables.
6. Start the Django development server.
7. Navigate to the frontend directory and install the required dependencies using `npm install`.
8. Start the React development server.

<a name="usage"></a>
### Usage

Once BlogSite is up and running, users can access the various features through the intuitive user interface:

- Register for a new account or log in with an existing account.
- Create new blog posts, update existing posts, or delete posts.
- Filter posts by categories or tags to discover relevant content.
- Reset password if needed.

<a name="contributing"></a>
### Contributing

Contributions to BlogSite are welcome! If you have any suggestions, feature requests, or bug reports, please feel free to open an issue or submit a pull request on the GitHub repository.

<a name="authors"></a>
### Authors

BlogSite is developed and maintained by Nnaemeka Daniel John.

<a name="license"></a>
### License

BlogSite is open-source software licensed under the MIT License. See the [LICENSE](https://github.com/dukeofhazardz/blogsite/blob/main/LICENSE) file for more information.

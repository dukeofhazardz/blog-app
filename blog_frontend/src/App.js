import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import CreateBlog from "./Pages/CreateBlog";
import BlogDetails from "./Pages/BlogDetails";
import Tags from "./Pages/Tags";
import Category from "./Pages/Category";
import Profile from "./Pages/Profile";
import UpdateBlog from "./Pages/UpdateBlog";
import ResetPassword from "./Pages/ResetPassword";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blog-details/:id" element={<BlogDetails />} />
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/update-blog/:id" element={<UpdateBlog />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

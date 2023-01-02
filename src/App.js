import React from "react";
import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Upload from "./pages/Upload";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
import AppNavbar from "./components/AppNavbar";
import { CookiesProvider } from 'react-cookie';

const App = () => {
  return (
    <Router>
      <CookiesProvider>
        <AppNavbar />
      </CookiesProvider>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/upload" element={<Upload />} />
        <Route path="/post" element={<Post />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;

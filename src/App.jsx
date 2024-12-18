import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./companents/navbar";
import Home from "./page/Home";
import Drug from "./page/Drug";
import Blog from "./page/Blog";
import BlogPost from "./page/Blogpost";
import Consult from "./page/Consult";
import Footer from "./companents/flooter";
import ContactUs from "./page/About";
// import Modal_save from "./companents/Modal_save";
import './App.css';
export const URI = "https://student.crru.ac.th/651463045/drugapi/";
// export const URI = "http://localhost/drug_api/";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        {/* <img src="./image/allfood.jpg" alt="" /> */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Drug />} />
            <Route exact path="/Home" element={<Home />} />
            <Route exact path="/drug/:id" element={<Drug />} />
            <Route exact path="/drug" element={<Drug />} />
            <Route exact path="/Blog" element={<Blog />} />
            <Route exact path="/Blog/:blogId" element={<BlogPost />} />
            <Route exact path="/Consult" element={<Consult />} />
            <Route exact path="/Contact" element={<ContactUs />} />
            {/* <Route exact path="/Save" element={<Modal_save />} /> */}
          </Routes>
        </div>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;

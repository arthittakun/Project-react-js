import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { Container, Nav, Navbar as Navber, NavDropdown, Button } from 'react-bootstrap';
import LoginModal from "./Madal_login";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { URI } from "../App";
import '../App.css';
import { Link } from "react-router-dom";
import Modal_save from "./Modal_save";

function Navbar() {
  const MySwal = withReactContent(Swal);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const fname = localStorage.getItem('fname');
  const lname = localStorage.getItem('lname');
 
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token !== ""){
      setIsLoggedIn(token);
    }
    axios.get(URI+'categories.php')
      .then(response => setMenuItems(response.data))
      .catch(error => console.error('Error fetching menu:', error));
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false); // ปิด modal เมื่อสำเร็จ
  };

  const toggleColorMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? '#333' : '#f0f0f0';
    document.body.style.color = isDarkMode ? '#f0f0f0' : '#333';
  }, [isDarkMode]);

  const logout = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        }).then(() => {
          localStorage.removeItem("token");
          localStorage.removeItem('email');
          localStorage.removeItem('fname');
          localStorage.removeItem('lname');
          setIsLoggedIn(null);
        }).then(() => {
          window.location.reload();
        });
      }
    })
  };

  return (
    <div>
      <Navber collapseOnSelect expand="lg" style={{ backgroundColor: '#006400' }} className="bg-body-tertiary">
        <Container>
          <Navber.Brand as={Link} to="/home">ยาและสุขภาพ</Navber.Brand>
          <Navber.Toggle aria-controls="responsive-navbar-nav" />
          <Navber.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/home">หน้าแรก</Nav.Link>
              <NavDropdown title="ข้อมูลยา" id="collapsible-nav-dropdown">
                <NavDropdown.Item as={Link} to={`/Drug`}>ข้อมูลยา</NavDropdown.Item>
                {Array.isArray(menuItems) && menuItems.length > 0 ? (
                  menuItems.map(item => (
                    <li key={item.CategoryID}>
                      <NavDropdown.Item as={Link} to={`/Drug/${item.CategoryID}`}>{item.CategoryName}</NavDropdown.Item>
                    </li>
                  ))
                ) : null}



              </NavDropdown>
              <Nav.Link as={Link} to="/Blog">Blogs</Nav.Link>
              <Nav.Link as={Link} to="/Consult">ปรึกษาเรา</Nav.Link>
              <Nav.Link as={Link} to="/Contact">ติดต่อเรา</Nav.Link>
            </Nav>
            <Nav>
              {isLoggedIn ? (
                <NavDropdown title={fname + " " + lname} id="collapsible-nav-dropdown">
                  <NavDropdown.Item >
                    <li onClick={handleShow}>
                      บทความที่บันทึก
                    </li>
                    <Modal_save
                      show={showModal}
                      handleClose={handleClose}
                    />
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logout}>ออกจากระบบ</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Button variant="primary" onClick={() => setShowLoginModal(true)}>ล็อกอิน</Button>
              )}
            </Nav>
          </Navber.Collapse>
        </Container>
      </Navber>

      <LoginModal
        show={showLoginModal}
        handleClose={() => setShowLoginModal(false)}
        handleLogin={handleLogin}
      />
    </div>
  );
}

export default Navbar;

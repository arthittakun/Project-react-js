import axios from 'axios';
import { useState } from 'react';
import { Modal, Form, Button } from "react-bootstrap";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { URI } from '../App';

function LoginModal({ show, handleClose, handleLogin }) {
  const MySwal = withReactContent(Swal);

  const [user, setUser] = useState({
    email: "",
    password: "",
    cpassword: "",
    fname: "",
    lname: ""
  });
  const [isRegister, setIsRegister] = useState(false);
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const submit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    
    if (isRegister) {
      // Registration Process
      if(user.email.trim() !== "" && user.password.trim() !== "" && user.cpassword.trim() !== "" && user.lname.trim() !== "" && user.fname.trim() !== ""){
        if(user.password === user.cpassword){
          form.append("email", user.email);
          form.append("password", user.password);
          form.append("fname", user.fname);
          form.append("lname", user.lname);

          await axios.post(URI+'register.php', form)
            .then((res) => {
              if(res.data.status === "success"){
                localStorage.setItem("token", res.data.token);
                MySwal.fire({
                  title: "Registration Successful!",
                  text: res.data.message,
                  icon: "success",
                  confirmButtonText: "OK",
                }).then(() => {
                  handleLogin(res.data.token);
                  localStorage.setItem('email', res.data.email);
                  localStorage.setItem('fname', res.data.fname);
                  localStorage.setItem('lname', res.data.lname);
                }).then(() => {
                  window.location.reload();
                });
              } else {
                MySwal.fire({
                  title: "Error!",
                  text: res.data.message,
                  icon: "error",
                  confirmButtonText: "OK",
                });
              }
            });
        } else {
          MySwal.fire({
            title: "Error!",
            text: "Passwords do not match!",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } else {
        MySwal.fire({
          title: "Error!",
          text: "Please fill all the fields",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } else {
      // Login Process
      form.append("email", user.email);
      form.append("password", user.password);
      await axios.post(URI+'login.php', form)
        .then((res) => {
          if(res.data.status === "success"){
            localStorage.setItem("token", res.data.token);
            MySwal.fire({
              title: "Login Successful!",
              text: res.data.message,
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              handleLogin(res.data.token);
              localStorage.setItem('email', res.data.email);
              localStorage.setItem('fname', res.data.fname);
              localStorage.setItem('lname', res.data.lname);
            }).then(() => {
              window.location.reload();
            });
          } else {
            MySwal.fire({
              title: "Error!",
              text: res.data.message,
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        });
    }
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isRegister ? 'Register' : 'Login'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submit}>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              name="email"
              onChange={handleChange}
              type="email"
              placeholder="Enter email"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              onChange={handleChange}
              type="password"
              placeholder="Password"
            />
          </Form.Group>

          {/* Additional fields for registration */}
          {isRegister && (
            <>
              <Form.Group className="mb-3" controlId="formGroupcPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  name="cpassword"
                  onChange={handleChange}
                  type="password"
                  placeholder="Confirm Password"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGroupfname">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  name="fname"
                  onChange={handleChange}
                  type="text"
                  placeholder="First Name"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGrouplname">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  name="lname"
                  onChange={handleChange}
                  type="text"
                  placeholder="Last Name"
                />
              </Form.Group>
            </>
          )}

          <div className="d-flex">
            <Button className="m-2" type="submit">
              {isRegister ? 'Register' : 'Login'}
            </Button>
            <Button
              className="m-2"
              type="button"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? 'Back to Login' : 'Register'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default LoginModal;

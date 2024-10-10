import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const Modal_save = ({ show, handleClose }) => {
    const [likedItems, setLikedItems] = useState([]); // เก็บ array ของบทความที่ถูกไลค์
    const navigate = useNavigate();
  // ดึงข้อมูลจาก LocalStorage เมื่อ component ถูกโหลด
  useEffect(() => {
    const storedLikes = localStorage.getItem('likes'); // ดึงข้อมูลทั้งหมดจาก LocalStorage
    if (storedLikes) {
      setLikedItems(JSON.parse(storedLikes)); // แปลงเป็น array ของบทความที่ถูกใจแล้วเก็บใน state
    }
  }, [show]); // ทำงานเมื่อ component ถูกโหลดครั้งแรกเท่านั้น

  return (
    <>
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>บทความที่ถูกใจ</Modal.Title> {/* ตั้งค่าชื่อเรื่องไว้ตรงนี้ */}
      </Modal.Header>
      <Modal.Body>
      {likedItems.length === 0 ? (
        <p>ไม่มีบทความที่ถูกใจ</p> // แสดงข้อความเมื่อไม่มีบทความที่ถูกไลค์
      ) : (
        <ul>
          {likedItems.map(item => (
            <li onClick={() => {
                navigate(`/Blog/${item.id}`)
                handleClose();
            }} key={item.id} style={{backgroundColor:'#2828'}}>
              <h3>{item.title}</h3>
            </li>
          ))}
        </ul>
      )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
    </>
   
  );
};

export default Modal_save;

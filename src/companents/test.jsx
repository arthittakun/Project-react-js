import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalComponent = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modal Title</Modal.Title> {/* ตั้งค่าชื่อเรื่องไว้ตรงนี้ */}
      </Modal.Header>
      <Modal.Body>
      <div>
      <h1>บทความที่ถูกใจ</h1>

      {likedItems.length === 0 ? (
        <p>ไม่มีบทความที่ถูกใจ</p> // แสดงข้อความเมื่อไม่มีบทความที่ถูกไลค์
      ) : (
        <ul>
          {likedItems.map(item => (
            <li key={item.id}>
              <h3>{item.title}</h3>
            </li>
          ))}
        </ul>
      )}
    </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComponent;

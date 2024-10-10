import axios from 'axios';
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const MySwal = withReactContent(Swal);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // แสดง alert เพื่อรอการส่งข้อมูล
    MySwal.fire({
      title: 'กรุณารอสักครู่...',
      html: 'กำลังส่งข้อความของคุณ...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // แสดงสถานะการโหลด
      }
    });

    const form = new FormData();
    form.append('phone', formData.phone);
    form.append('email', formData.email);
    form.append('content', formData.message);
    form.append('name', formData.name);

    try {
      // เรียกใช้ API โดยใช้ axios
      const res = await axios.post("https://student.meomiw.online/mailer-api.php", form);
      
      // เมื่อได้รับการตอบกลับแล้วให้ปิด alert การโหลด
      Swal.close();

      if (res.data.status === 'success') {
        MySwal.fire({
          icon: 'success',
          title: 'สำเร็จ!',
          text: 'ข้อความของคุณได้ถูกส่งเรียบร้อยแล้ว!',
          confirmButtonText: 'ตกลง'
        });
      } else {
        // กรณีที่การตอบกลับไม่สำเร็จ
        MySwal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: 'ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง',
          confirmButtonText: 'ตกลง'
        });
      }
    } catch (error) {
      // เมื่อเกิดข้อผิดพลาดในการเรียก API ให้ปิด alert การโหลด
      Swal.close();

      MySwal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด!',
        text: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง',
        confirmButtonText: 'ตกลง'
      });
      console.error('Error:', error);
    }

    console.log('Form submitted:', formData);
  };

  return (
    <div>
      <header className="text-center py-3">
        <h1>ติดต่อเรา</h1>
      </header>

      <Container className="mt-5">
        <Row>
          {/* ข้อมูลติดต่อและแผนที่ */}
          <Col md={5}>
            <Card className="p-3" style={{ backgroundColor: '#007bff', color: '#fff' }}>
              <Card.Body>
                <Card.Title>CSIT มหาลัยราชภัฏเชียงาย</Card.Title>
                <Card.Text>
                  <p>มหาวิทยาลัยราชภัฏเชียงราย 80 หมู่ 9 ต.บ้านดู่ อ.เมือง จ.เชียงราย 57100</p>
                  <p>โทร: 083-702-6011</p>
                  <p>อีเมล: 651463045@crru.ac.th</p>
                </Card.Text>
                <div className="mt-3">
                  <iframe
                    title="Hospital Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.560455227939!2d99.84310658000506!3d19.984979040389582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30d70122afc33789%3A0x2182f8de52c82021!2z4Liq4Liz4LiZ4Lix4LiB4Lin4Li04LiX4Lii4Lia4Lij4Li04LiB4Liy4Lij4LmB4Lil4Liw4LmA4LiX4LiE4LmC4LiZ4LmC4Lil4Lii4Li14Liq4Liy4Lij4Liq4LiZ4LmA4LiX4LioIOC4oeC4q-C4suC4p-C4tOC4l-C4ouC4suC4peC4seC4ouC4o-C4suC4iuC4oOC4seC4j-C5gOC4iuC4teC4ouC4h-C4o-C4suC4og!5e0!3m2!1sth!2sth!4v1728213825342!5m2!1sth!2sth"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* ฟอร์มติดต่อสอบถาม */}
          <Col md={7}>
            <Card className="p-4">
              <Card.Body>
                <h2 className="mb-4">ส่งข้อความหาเรา</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formName" className="mb-3">
                    <Form.Label>ชื่อ</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="กรอกชื่อของคุณ"
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>อีเมล</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="กรอกอีเมลของคุณ"
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formPhone" className="mb-3">
                    <Form.Label>เบอร์โทร</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="กรอกเบอร์โทรของคุณ"
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formMessage" className="mb-3">
                    <Form.Label>ข้อความ</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="กรอกข้อความของคุณ"
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    ส่งข้อความ
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ContactUs;

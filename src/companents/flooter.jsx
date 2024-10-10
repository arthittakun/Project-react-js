import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer style={{ backgroundColor: '#f8f9fa', padding: '20px 0', textAlign: 'center' }}>
      <Container>
        <Row>
          <Col >
            <p>ติดต่อเรา: 651463045@crru.ac.th | โทร: 083-702-6011</p>
            <div>
              <a href="https://www.facebook.com/profile.php?id=100027513083974" target="_blank" rel="noopener noreferrer">Facebook</a> 
            </div>
          </Col>
        </Row>
        <hr />
        <Col >
            <p style={{fontSize: '12px'}}>© 2024 MyWebsite. All Rights Reserved. | By นักศึกษาสำนักเทคโนโลยีสารสนเทศ วิทยาการคอมพิวเตอร์</p>
          </Col>
      </Container>
    </footer>
  );
}

export default Footer;

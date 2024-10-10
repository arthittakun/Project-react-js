import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Col, Row, Card, Button, Modal, Form, Pagination,Image} from "react-bootstrap";
import axios from 'axios';
import '../App.css';
import { URI } from '../App';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import LoginModal from '../companents/Madal_login';



function Drug() {
  const sweet = withReactContent(Swal);
  const { id } = useParams();
  const [drugDetails, setDrugDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [link, setLink] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [likedImages, setLikedImages] = useState({});
  const [showModallogin, setShowModallogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);


  const fetchData = async () => {
    try {
      const response = id
        ? await axios.get(`${URI}medications.php?id=${id}`)
        : await axios.get(`${URI}medications.php`);
      setDrugDetails(response.data);
    } catch (error) {
      console.error('Error fetching drug details:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [id]);






  const checkLikes = async () => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
      if (!token || !email || !drugDetails || !Array.isArray(drugDetails)) return;

      // สร้าง array ของ promises สำหรับการตรวจสอบแต่ละ MedicationID
      const promises = drugDetails.map(async (detail) => {
          try {
              const res = await axios.get(`${URI}like.php`, {
                  params: {
                      email: email,
                      medicationId: detail.MedicationID
                  }
              });
              return {
                  id: detail.MedicationID,
                  liked: res.data.liked
              };
          } catch (error) {
              console.error(`Error checking like status for MedicationID ${detail.MedicationID}:`, error);
              return {
                  id: detail.MedicationID,
                  liked: false
              };
          }
      });

      // รอจนกว่าทุก promise จะเสร็จสิ้น
      const results = await Promise.all(promises);

      // อัปเดตสถานะ likedImages โดยใช้ข้อมูลจาก results
      setLikedImages(prevState => {
          const newState = { ...prevState };
          results.forEach(({ id, liked }) => {
              newState[id] = liked;
          });
          return newState;
      });
  };
  useEffect(() => {
    checkLikes();
}, [drugDetails]);


  const handleShowModal = async (drug) => {
    setSelectedDrug(drug);
    setShowModal(true);
  
    try {
      const response = await axios.get(`${URI}likeshop.php?id=${drug.MedicationID}`);
      setLink(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const filteredDrugDetails = Array.isArray(drugDetails) ? drugDetails.filter(drug =>
    drug.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.CategoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.TypeName.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDrugDetails.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredDrugDetails.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (drugDetails.length === 0) {
    return <p>กำลังโหลดข้อมูล...</p>;
  }

  const handleClick = async (id) => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const form = new FormData();
      form.append("email", email);
      form.append("medicationId", id);
      form.append("token", token);
    if(token){
      setLikedImages(prevState => ({
        ...prevState,
        [id]: !prevState[id],
      }));

     if(likedImages[id]){
      
      const res = await axios.post(URI + "removelike.php", form).then((res) => {
        if (res.data.status === "success") {
          fetchData();
        }
        if (res.data.status === "errortoken") {
          sweet.fire({
            title: "error!",
            text: res.data.message,
            icon: "error",
          }).then(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
          }).then(() => {
            window.location.reload();
          });
        }
      });


     }else{
      const res = await axios.post(URI+'addlike.php', form).then((res) =>{
      if(res.data.status === 'success'){
        fetchData();
      }
      if(res.data.status === 'errortoken'){
        sweet.fire({
          title: "error!",
          text: res.data.message,
          icon: "error"
        }).then(() =>{
          localStorage.removeItem('token');
          localStorage.removeItem('email');
        }).then(() => {
          window.location.reload();
        });
      }
    })}
    }else{
      handleClose(true);
    }
    
  };


  
  const handleClose = (e) => setShowModallogin(e);
  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowModallogin(false); // ปิด modal เมื่อสำเร็จ
  };

  const domain = window.location.hostname;
  
  return (
    
    <Container className='m-5'>
      <LoginModal 
        show={showModallogin} 
        handleClose={handleClose}
        handleLogin={handleLogin} 
      />
      <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder="ค้นหาชื่อยา"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>

      <Row>
  {currentItems.map((drug, index) => (
    <Col key={index} sm={12} md={6} lg={4} xl={3} className="mb-4">
      <Card className="h-100"> {/* ใช้ h-100 เพื่อให้การ์ดมีความสูงเท่ากัน */}
        <Image variant="top" src={drug.img} alt={drug.Name} thumbnail />
        <Card.Body className="d-flex flex-column justify-content-between">
          <Card.Title>{drug.Name || 'ไม่พบชื่อยา'}</Card.Title>
          <Card.Text>หมวดหมู่: {drug.CategoryName || 'ไม่มีข้อมูล'}</Card.Text>
          <Card.Text>ประเภท: {drug.TypeName || 'ไม่มีข้อมูล'}</Card.Text>
          <div className='d-flex'>
            <Button className='m-3' variant="primary" onClick={() => handleShowModal(drug)}>
              ดูเพิ่มเติม
            </Button>
            <div className='m-3 d-flex'>
              <img
                key={drug.MedicationID}
                id={drug.MedicationID}
                onClick={() => handleClick(drug.MedicationID)}
                src={likedImages[drug.MedicationID] ? "https://student.crru.ac.th/651463045/drug/image/heart.png" : "https://student.crru.ac.th/651463045/drug/image/heart_b.png"} 
                style={{ width: '28px', height: '28px', cursor: 'pointer' }}
                alt=""
              />
              <p className='ms-2'>{drug.like_count}</p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  ))}
</Row>

      <Pagination>
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      <Modal show={showModal} onHide={handleCloseModal}>
        {selectedDrug && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedDrug.Name || 'ไม่พบชื่อยา'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Card.Img variant="top" src={selectedDrug.img} alt={selectedDrug.Name}  />
              <div className='m-3'>
              <h3>คำอธิบาย</h3>
              <Card.Text>ชื่อสามัญ: {selectedDrug.GenericName || 'ไม่มีข้อมูล'}</Card.Text>
              <Card.Text>หมวดหมู่: {selectedDrug.CategoryName || 'ไม่มีข้อมูล'}</Card.Text>
              <Card.Text>ประเภท: {selectedDrug.TypeName || 'ไม่มีข้อมูล'}</Card.Text>
              <Card.Text>คำอธิบาย: {selectedDrug.Description || 'ไม่มีข้อมูล'}</Card.Text>
              <Card.Text>ขนาดยา: {selectedDrug.Dosage || 'ไม่มีข้อมูล'}</Card.Text>
              <Card.Text>ข้อควรระวัง: {selectedDrug.Precautions || 'ไม่มีข้อมูล'}</Card.Text>
              <Card.Text>ผลข้างเคียง: {selectedDrug.SideEffects || 'ไม่มีข้อมูล'}</Card.Text>
              <Card.Text>การเก็บรักษา: {selectedDrug.StorageInstructions || 'ไม่มีข้อมูล'}</Card.Text>
              <Card.Text>ผู้ที่ไม่ควรทานยาชนิดนี้: {selectedDrug.Contraindications || 'ไม่มีข้อมูล'}</Card.Text>
              <Card.Text>สิ่งที่ไม่ควรใช้ร่วม: {selectedDrug.DrugInteractions || 'ไม่มีข้อมูล'}</Card.Text>
              <Card.Text>การใช้งาน: {selectedDrug.Usages || 'ไม่มีข้อมูล'}</Card.Text>
              </div>
             <div className='m-3'>
              <h3>ร้านค้าที่เเนะนำ</h3>
              {Array.isArray(link) && link.length > 0 ? (
                link.map(link => (
                  <Card.Text className='linkshop' key={link.linkID}>
                    {link.linkname ? <a href={link.linkname} target="_blank" rel="noopener noreferrer"> {link.description}</a> : 'ไม่มีข้อมูล'}
                  </Card.Text>
                ))
              ) : (
                <Card.Text>ไม่มีข้อมูล</Card.Text>
              )}
             </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </Container>
  );
}

export default Drug;

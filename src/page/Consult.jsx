import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, Form, InputGroup } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import LoginModal from '../companents/Madal_login';
import axios from 'axios';
import { URI } from '../App';

function Consult() {
    const [showModallogin, setShowModallogin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [show, setShow] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [consults, setConsults] = useState([]);
    const [chat, setChat] = useState(null);

    const API_KEY = 'AIzaSyBDOBKkZPMNfuVwQZCwqDuZNu4RrHJ4674';
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);

    // Function to save chat history and email to localStorage
    const saveChatToLocalStorage = (messages, email) => {
        localStorage.setItem(`chatHistory_${email}`, JSON.stringify(messages));
        localStorage.setItem('email', email);
    };

    // Function to load chat history from localStorage
    const loadChatFromLocalStorage = () => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            const storedMessages = localStorage.getItem(`chatHistory_${storedEmail}`);
            if (storedMessages) {
                setMessages(JSON.parse(storedMessages));
            }
        }
    };

    useEffect(() => {
        loadChatFromLocalStorage();
    }, []);

    const fetchConsults = async () => {
        try {
            const response = await axios.get(URI + 'consult.php');
            if (response.data) {
                setConsults(response.data);
            }
        } catch (error) {
            console.error('Error fetching consult data:', error);
        }
    };

    useEffect(() => {
        fetchConsults();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ตรวจสอบ input ก่อน
        if (!input.trim()) {
            console.log("Input is empty, not proceeding.");
            return;
        }

        const email = localStorage.getItem("email") || "guest"; // เก็บ email ที่ใช้ใน localStorage หรือ 'guest' หากไม่มี

        // สร้าง userinput หลังจากตรวจสอบแล้ว
        let userinput = "นี่คือการสนทนาเกี่ยวกับยาเเละสุขภาพ ชื่อของคุณในการตอบกลับคือ โทโมเอะ " +
            "ถ้าหากสนทนานอกเรื่องให้ตอบกลับว่า ไม่สามารถตอบคำถามนี้ได้ โทโมเอะให้คำปรึกษาเฉพาะยาเเละสุขภาพ";

        if (chat) {
            userinput += "/t นี่คือข้อความสนทนาที่เเล้ว" + chat;
        }

        userinput += "นี่คือคำถามจากผู้ใช้ปัจุบัน :" + input;

        // console.log("Prepared userinput:", userinput);

        // ดำเนินการต่อหลังจากตรวจสอบและเตรียมข้อมูลเรียบร้อยแล้ว
        const userMessage = { role: email, content: input }; // Set role as the email
        setMessages(prev => [...prev, userMessage]);
        saveChatToLocalStorage([...messages, userMessage], email); // Save chat after user sends a message
        setInput('');
        setIsLoading(true);

        try {
            // ส่งคำขอไปยัง API
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userinput }] }]
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // จัดการกับ token และ email
            const token = localStorage.getItem("token");
            const form = new FormData();
            form.append('token', token);
            form.append('chattext', input);
            form.append('email', email);

            const respon = await axios.post(URI + "chat.php", form);
            console.log(respon.data)
            const data = await response.json();

            // ตรวจสอบโครงสร้างของ response
            if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
                const aiMessage = { role: 'ai', content: data.candidates[0].content.parts[0].text };
                setMessages(prev => [...prev, aiMessage]);
                saveChatToLocalStorage([...messages, userMessage, aiMessage], email); // Save chat after AI response
                console.log("AI response:", aiMessage.content);
                setChat(aiMessage.content);
            } else {
                throw new Error('Unexpected API response structure');
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMsg = { role: 'ai', content: `An error occurred: ${error.message}` };
            setMessages(prev => [...prev, errorMsg]);
            saveChatToLocalStorage([...messages, userMessage, errorMsg], email); // Save chat in case of error
        } finally {
            setIsLoading(false);
        }
    };

    const formatMessage = (content) => {
        return content.replace(/^\*\s/gm, '• ');
    };

    const renderMessage = (msg) => {
      const formattedContent = formatMessage(msg.content);
      return (
          <ReactMarkdown>
              {formattedContent}
          </ReactMarkdown>
      );
  };
  

    const chatchang = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            handleClose(true);
        } else {
            setShow(true);
        }
    };

    const handleClose = (e) => setShowModallogin(e);
    const handleLogin = () => {
        setIsLoggedIn(true);
        setShowModallogin(false); // ปิด modal เมื่อสำเร็จ
        loadChatFromLocalStorage(); // Load chat for the logged-in user
    };

    return (
        <>
            <LoginModal
                show={showModallogin}
                handleClose={handleClose}
                handleLogin={handleLogin}
            />
            <div className="content m-5 pl-5">
                <h3>สิ่งที่คุณควรรู้ก่อนการขอคำปรึกษา</h3>
                <ul>
                    <li><b>ข้อมูลที่ควรเตรียม :</b>กรุณาเตรียมข้อมูลเกี่ยวกับอาการป่วยหรือปัญหาสุขภาพที่คุณประสบอยู่ รวมถึงข้อมูลยาและการรักษาที่คุณใช้ในปัจจุบัน</li>
                    <li><b>การสอบถาม :</b>คิดคำถามที่คุณต้องการถามก่อนเข้าปรึกษา เพื่อให้การให้คำปรึกษามีประสิทธิภาพมากที่สุด</li>
                    <li><b>ความเป็นส่วนตัว:</b> ข้อมูลที่คุณให้จะถูกเก็บเป็นความลับและใช้เฉพาะในการให้คำปรึกษาเท่านั้น</li>
                </ul>
                <p>หากคุณมีข้อสงสัยหรือคำถามเพิ่มเติม คุณสามารถติดต่อเราผ่านช่องทางที่มีอยู่ในเว็บไซต์ของเราได้ตลอดเวลา</p>
                <h3>คำถามที่พบบ่อย (FAQ)</h3>
                <h4 id='inden'>คำถามเกี่ยวกับการเเชท</h4>
                <ul>
                    <b>ฉันควรเตรียมข้อมูลอะไรบ้างสำหรับการให้คำปรึกษา?</b>
                    <li>ควรเตรียมข้อมูลเกี่ยวกับอาการป่วยที่คุณประสบอยู่ รวมถึงประวัติการใช้ยาและการรักษาที่คุณได้รับ</li>
                    <b>คำปรึกษามีค่าใช้จ่ายหรือไม่?</b>
                    <li>การให้คำปรึกษาผ่านเว็บไซต์ของเราไม่เสียค่าใช้จ่ายใดๆ คุณสามารถขอคำปรึกษาได้ฟรี</li>
                    <b>จะได้รับคำตอบเมื่อไหร่หลังจากส่งคำถาม?</b>
                    <li>ทีมงานของเราจะพยายามตอบคำถามของคุณภายใน 24-48 ชั่วโมง ขึ้นอยู่กับจำนวนคำถามที่เรามีในขณะนั้น</li>
                    <b>ฉันสามารถติดต่อผู้เชี่ยวชาญได้ทางช่องทางไหนบ้าง?</b>
                    <li>คุณสามารถติดต่อเราผ่านฟอร์มการติดต่อในเว็บไซต์หรือทางอีเมลที่ระบุไว้ในหน้า ติดต่อเรา</li>
                    <b>ฉันต้องการคำปรึกษาผ่านโทรศัพท์หรือการประชุมวิดีโอ สามารถทำได้หรือไม่?</b>
                    <li>ขณะนี้เรามีบริการให้คำปรึกษาผ่านข้อความเท่านั้น แต่เรากำลังพิจารณาเพิ่มเติมบริการอื่นๆ ในอนาคต</li>
                </ul>
                <h4 id='inden'>คำถามเกี่ยวกับสุขภาพ</h4>
                <ul>
                    {Array.isArray(consults) && consults.length > 0 ? (
                        consults.map((consult) => (
                            <div key={consult.consultID}>
                                <b>{consult.chattext}</b>
                                <li>{consult.consultName}</li>
                            </div>
                        ))
                    ) : (
                        <p>ไม่มีข้อมูล</p>
                    )}
                </ul>
                <Button
                    variant="primary"
                    className="bottom-0 m-3 "
                    style={{ width: '160px', height: '60px' }}
                    onClick={chatchang}
                >
                    <i className="bi bi-chat-dots">แชทกับเรา</i>
                </Button>
            </div>

            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>เเชทอัตโนมัติกับโทโมเอะ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ height: '300px', overflowY: 'auto' }} className="mb-3">
                        {messages.map((msg, index) => (
                            <div key={index} className={`d-flex ${msg.role === 'ai' ? 'justify-content-start' : 'justify-content-end'} mb-2`}>
                                <div className={`p-2 rounded ${msg.role === 'ai' ? 'bg-light' : 'bg-primary text-white'}`}>
                                    {renderMessage(msg)}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <Form onSubmit={handleSubmit}>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                            />
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Sending...' : 'Send'}
                            </Button>
                        </InputGroup>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Consult;

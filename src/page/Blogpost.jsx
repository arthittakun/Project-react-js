import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from "axios";
import { Container, Form , Button} from 'react-bootstrap';
import { URI } from '../App';
import LoginModal from "../companents/Madal_login";

function BlogPost() {
  const Myswal = withReactContent(Swal);
  const { blogId } = useParams(); // Extract blogId from the URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState([]);
  const [sencomment, setSencomment] = useState(false);
  const [formData, setFormData] = useState({
    comment: "",
  });
  const [showModallogin, setShowModallogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [showAllComments, setShowAllComments] = useState(false); // ควบคุมการแสดงผลความคิดเห็นทั้งหมด
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');
  const [likedItems, setLikedItems] = useState([]);

  const comments = async () => {
    try {
      const res = await axios.get(`${URI}comment.php?id=${blogId}`);
      setComment(res.data.comments);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`${URI}blogpost.php?id=${blogId}`);
      setBlog(res.data[0]);
      console.log(res.data[0])
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    const commentform = new FormData();
    commentform.append("email" , email);
    commentform.append("token" , token);
    commentform.append("postid" , blogId);
    commentform.append("comment" , formData.comment);
    if (!token) {
      handleClose(true);
    } else {
      await axios.post(URI+"insert_comment.php", commentform)
        .then((res) => {
          console.log(res.data);
        })
        .then(() => {
          setSencomment(true);
        });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const storedLikes = localStorage.getItem('likes');
    if (storedLikes) {
      setLikedItems(JSON.parse(storedLikes)); // แปลงเป็น array ของสินค้าที่ถูกใจแล้วเก็บใน state
    }
    comments();
    fetchBlog();
    const fname = localStorage.getItem('fname');
    console.log(fname);
  }, [blogId]);

  useEffect(() => {
    comments();
  }, [sencomment]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!blog) {
    return <div>Blog post not found</div>;
  }

  const handleClose = (e) => setShowModallogin(e);
  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowModallogin(false); // ปิด modal เมื่อสำเร็จ
  };

  // ฟังก์ชันสำหรับการแสดง/พับ "Read More" และ "Hide Comments"
  const toggleComments = () => {
    setShowAllComments(!showAllComments);
  };

  const commentdelete = (id) => {
    Myswal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Myswal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        }).then(() => {
          const form = new FormData();
          form.append('token', token);
          form.append('commentid', id);
          axios.post(URI+"remove_comment.php", form)
            .then((res) => {
              console.log(res.data);
              comments();
            });
        });
      }
    });
  };

  const handleLike = () => {
    const likedItem = { id: blogId, title: blog.title }; // เก็บข้อมูล id และชื่อบทความ

    // เช็คว่าบทความนี้ถูกไลค์แล้วหรือยัง
    const isLiked = likedItems.some(item => item.id === blogId);

    const newLikedItems = isLiked
      ? likedItems.filter(item => item.id !== blogId) // ถ้ากดแล้ว (Unlike) ให้ลบ id ออกจาก array
      : [...likedItems, likedItem]; // ถ้ายังไม่กด (Like) ให้เพิ่มบทความลงใน array

    setLikedItems(newLikedItems); // อัปเดต state
    localStorage.setItem('likes', JSON.stringify(newLikedItems)); // บันทึก array ของบทความที่ถูกใจลงใน LocalStorage
  };

  // ฟังก์ชันสำหรับเช็คว่าบทความนี้ถูกไลค์หรือยัง
  const isBlogLiked = () => {
    const storedLikes = localStorage.getItem('likes'); // ดึงข้อมูลจาก LocalStorage

    if (storedLikes) {
      const parsedLikes = JSON.parse(storedLikes);
      return parsedLikes.some(item => item.id === blogId); // เช็คว่ามีบทความนี้อยู่ใน likes หรือไม่
    }

    return false; // ถ้าไม่มีข้อมูลใน localStorage
  };

  return (
    <Container className="mt-4">
      <LoginModal 
        show={showModallogin} 
        handleClose={handleClose}
        handleLogin={handleLogin} 
      />
      <h2 className="text-center">{blog.title}</h2>
      <div>
      <div className="imgstyle">
      {blog.img && (
                  <img 
                          variant="top"
                          src={blog.img}
                          alt={`Blog Image `}
                          style={{ width: '100%', height: 'auto' }}
                          />
                      )}
      </div>
      <div >
      {blog.content.split('<br>').map((paragraph, index) => (
          <p key={index} style={{ textIndent: '2em' }}>
            {paragraph.trim()}
          </p>
        ))}
      </div>
      </div>
      <h3>Comments</h3>
      
      <div>
        <ul>
          {comment && comment.length > 0 ? (
            comment
              .slice(0, showAllComments ? comment.length : 2) // แสดง 2 คอมเมนต์แรก หรือทั้งหมดถ้ากด Read More
              .map((comment, index) => (
                <li key={index}>
                  <b>{comment.user.fname + " " + comment.user.lname}</b>
                  <p>
                    {comment.comment_text + " "} 
                    {comment.user.fname === localStorage.getItem('fname') ? (
                    <>
                      <button type="button" className="btn btn-danger" onClick={() => commentdelete(comment.comment_id)}>ลบ</button>
                    </>
                  ) : ""}
                  </p>
                </li>
              ))
          ) : (
            null
          )}
        </ul>

        {/* แสดงปุ่ม Read More/Hide Comments เมื่อมีความคิดเห็นมากกว่า 2 */}
        {comment && comment.length > 2 ? (
          <button onClick={toggleComments}>
            {showAllComments ? 'Hide Comments' : 'Read More'}
          </button>
        ) : null}

        {/* Comment submission form */}
        <Form onSubmit={submit}>
          <Form.Group className="mb-3" controlId="formGroupPassword">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              name="comment"
              onChange={handleChange}
              type="text"
              placeholder="Enter comment"
              value={formData.comment}
            />
          </Form.Group>
          <button className="m-3" style={{backgroundColor:'#0066FF'}} type="submit">Submit</button>
        </Form>
      </div>
      <button 
      className="m-3"
        onClick={handleLike} 
        style={{ backgroundColor: isBlogLiked() ? '	#FF0000' : '#FF99FF' }}
      >
        { isBlogLiked() ? 'ยกเลิกบันทึก' : 'บันทึกบทความ' }
      </button>
    </Container>
  );
}

export default BlogPost;

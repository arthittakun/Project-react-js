import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Container } from 'react-bootstrap';
import { URI } from '../App';

function Blog() {
  const [categories, setCategories] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const navigate = useNavigate(); // useNavigate to navigate to full blog post

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(URI + 'blogs.php')
        .then((res) => {
          const categorizedBlogs = categorizeBlogs(res.data);
          setCategories(categorizedBlogs);
          console.log(res.data);
        })
        .catch((err) => console.error(err));
    };
    fetchData();
  }, []);

  // Function to categorize blogs by category_id
  const categorizeBlogs = (blogs) => {
    return blogs.reduce((acc, blog) => {
      const categoryId = blog.blogstypename;
      if (!acc[categoryId]) {
        acc[categoryId] = {
          name: blog.category_name || ` ${categoryId}`,
          blogs: []
        };
      }
      acc[categoryId].blogs.push(blog);
      return acc;
    }, {});
  };

  // Toggle expanded state for a category
  const handleToggleExpand = (categoryId) => {
    setExpandedCategories((prevState) => ({
      ...prevState,
      [categoryId]: !prevState[categoryId]
    }));
  };

  // Navigate to full blog post
  const handleReadMore = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  return (
    <Container className="mt-4">
      {Object.entries(categories).map(([categoryId, categoryData]) => {
        const isExpanded = expandedCategories[categoryId];

        return (
          <div key={categoryId} className="mb-5">
            <h3>{categoryData.name}</h3>
            <Row className="g-4">
              {(isExpanded ? categoryData.blogs : categoryData.blogs.slice(0, 3)).map((blog, index) => {
                return (
                  <Col md={4} key={index} className="d-flex align-items-stretch">
                    <Card className="mb-4 h-100">
                      {/* หากมีรูปภาพใน blog สามารถดึงจาก API ถ้ามี */}
                      {blog.img && (
                        <Card.Img
                          variant="top"
                          src={blog.img}
                          alt={`Blog Image ${index}`}
                          style={{ width: '100%', height: 'auto' }}
                        />
                      )}
                      <Card.Body className="d-flex flex-column">
                        <Card.Title>{blog.title}</Card.Title>
                        {/* แสดงส่วนแรกของ content */}
                        <Card.Text className="flex-grow-1">{blog.content.slice(0, 100)}...</Card.Text>
                        <Button variant="primary" onClick={() => handleReadMore(blog.id)}>Read More</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
            {categoryData.blogs.length > 3 && (
              <Button
                variant="secondary"
                className="mt-3"
                onClick={() => handleToggleExpand(categoryId)}
              >
                {isExpanded ? "Show Less" : "Show More"}
              </Button>
            )}
          </div>
        );
      })}
    </Container>
  );
}

export default Blog;

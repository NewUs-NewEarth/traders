/**
 * @author jeongyearim
 * @email [example@mail.com]
 * @create date 2023-10-06 17:44:23
 * @modify date 2023-10-19 20:16:59
 * @desc [환경 관련 뉴스기사 출력]
 */

/**
 * @author hyunseul
 * @create date 2023-10-19 18:32:07
 * @modify date 2023-10-19 18:32:22
 * @desc [css]
 */

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import {AiOutlinePlus} from 'react-icons/ai'

function NewsList() {
  const [newsList, setNewsList] = useState([]);
  const [showMore, setShowMore] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    // 뉴스 데이터를 가져오는 요청
    axios
      .get('/api/sns/showNews')
      .then((response) => {
        setNewsList(response.data);
      })
      .catch((error) => {
        console.error('뉴스 데이터를 가져오는 중 오류 발생:', error);
      });
  }, []);

  const displayedNews = showMore ? newsList : newsList.slice(0, 6);

  return (
    <div > 
      <Container id='scrollable-area' className=" d-flex flex-row justify-content-center">
        <Row style={{ width: '80%'}}>
          <div className="news-header">
            <p>
              News list
              <AiOutlinePlus className="plus-btn" onClick={() => setShowMore(!showMore)} />
            </p>
          </div>
          <br />
          {displayedNews.map((news, index) => (
            <Col key={index} sm={6} md={4}>
              <div className="news-item" ref={index === displayedNews.length - 1 ? scrollRef : null}>
                <img src={news.imageUrl} alt={news.articleTitle} className="news-img" />
                <p className="news-title">{news.articleTitle}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default NewsList;






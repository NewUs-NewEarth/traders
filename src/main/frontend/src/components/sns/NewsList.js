/**
 * @author jeongyearim
 * @email [example@mail.com]
 * @create date 2023-10-06 17:44:23
 * @modify date 2023-10-27 11:36:52
 * @desc [환경 관련 뉴스기사 출력]
 */

/**
 * @author hyunseul
 * @create date 2023-10-19 18:32:07
 * @modify date 2023-10-19 18:32:22
 * @desc [메인 페이지 템플릿 전체 css]
 */

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { AiOutlinePlus } from "react-icons/ai";
import TokenRefresher from "../util/TokenRefresher";

function NewsList() {
  const [newsList, setNewsList] = useState([]);
  const [showMore, setShowMore] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    // 뉴스 데이터를 가져오는 요청
    TokenRefresher.get("http://localhost:8080/api/sns/showNews")
      .then((response) => {
        setNewsList(response.data);
      })
      .catch((error) => {
        console.error("뉴스 데이터를 가져오는 중 오류 발생:", error);
      });
  }, []);

  const displayedNews = showMore ? newsList : newsList.slice(0, 6);

  return (
    <div>
      <Container
        id="scrollable-area"
        className=" d-flex flex-row justify-content-center"
      >
        <Row style={{ width: "80%" }}>
          <div className="news-header">
            <p>
              News list
              <AiOutlinePlus
                className="plus-btn"
                onClick={() => setShowMore(!showMore)}
              />
            </p>
          </div>
          <br />
          {displayedNews.map((news, index) => (
            <Col key={index} sm={6} md={4}>
              <div
                className="news-item"
                ref={index === displayedNews.length - 1 ? scrollRef : null}
              >
                <img
                  src={news.imageUrl}
                  alt={news.articleTitle}
                  className="news-img"
                />
                <a
                  href={news.articleLink}
                  style={{
                    textDecoration: "none",
                    color: "black",
                    fontFamily: "Pretendard-Regular",
                  }}
                >
                  <p className="news-title">{news.articleTitle}</p>
                </a>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default NewsList;

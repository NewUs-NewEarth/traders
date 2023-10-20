import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container'; 
import TokenRefresher from '../service/TokenRefresher';


const CampaignDetails = ({ campaignId }) => {
  //const { id } = useParams();
  const id = campaignId;
  const history = useHistory();

  useEffect(() => {
    TokenRefresher
      .get(`/sns/showCampaign/${id}`)
      .then((res) => setData(res.data))
      .catch((error) => {
        if (error.response) {
          const errorResponse = error.response.data;
          console.log(errorResponse);
        }
      });
  }, [id]);

  const [data, setData] = useState({});
  const { title, organizer, description, verificationMethod, tags, dueDate } =
    data;


  const goBack = () => {
    history.goBack();
  };

  // 현재 시간
  const currentDate = new Date();

  // 캠페인 마감일
  const campaignDueDate = new Date(dueDate);

  // 남은 시간 계산 (밀리초로 계산)
  const timeRemaining = campaignDueDate - currentDate;

  // 만료 여부 확인
  const isExpired = timeRemaining <= 0;

  // 시간 형식으로 변환
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (timeRemaining > 0) {
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        setTime({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [timeRemaining]);

  return (
    <Container style={{maxWidth:"1040px"}}> 
      <div>
        <h1>캠페인 상세보기</h1>
        <button onClick={goBack}>뒤로가기</button>
        <h2>이름 - {title}</h2>
        <hr />
        <h3> 주최자 - {organizer}</h3>
        {data.images && data.images.map((image, index) => (
          <img
            key={index}
            src={image.filepath}
            alt={`Image ${index}`}
            style={{ maxWidth: '200px', maxHeight: '200px' }}
          />
        ))}
        <h3> 상세 설명 - {description}</h3>
        <h3> 인증 방법 - {verificationMethod}</h3>
        <h3> 태그 - {tags}</h3>
        <h3> 기한 - {dueDate}</h3>
        <h3>
          {isExpired ? (
            "캠페인 만료"
          ) : (
            `남은 시간: ${time.days}일 ${time.hours}시간 ${time.minutes}분 ${time.seconds}초`
          )}
        </h3>
        {/* Conditionally render the button with data.tags as a parameter */}
        {!isExpired && (
          // <Link to={`/sns/snsRegistration?tags=${data.tags}`}>
          <Link to={{
            pathname: "/sns/snsRegistration",
            state: { tags } // 데이터를 보냅니다.
          }}>
            <button>인증하기</button>
          </Link>
        )}
      </div>
    </Container>
  );
};

export default CampaignDetails;

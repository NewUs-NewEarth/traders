/**
 * @author jeongyearim
 * @email [example@mail.com]
 * @create date 2023-10-20 11:17:23
 * @modify date 2023-10-20 11:19:11
 * @desc [snsList와 snsDetails를 감싸고 있음]
 */
import React, { useState, useEffect } from 'react';
import SnsList from './SnsList';
import SnsDetails from './SnsDetails';
import Container from 'react-bootstrap/Container';
import { Link } from "react-router-dom";
import TokenRefresher from '../service/TokenRefresher';

const SnsManage = ({campaigns}) => {
  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    // 데이터 가져오는 API 요청
    TokenRefresher
      .get("/sns/list")
      .then((res) => setPosts(res.data))
      .catch((error) => {
        if (error.response) {
          const errorResponse = error.response.data;
          console.log(errorResponse);
        }
      });
  }, []);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleListClick = () => {
    setSelectedImage(null);
  };

  const handleTagButtonClick = (tag) => {
    setSelectedTag(tag);

    // 추가로 이미지와 태그를 비교하여 필요하다면 selectedImage를 null로 설정
    if (selectedImage && selectedImage.tags !== tag) {
      setSelectedImage(null);
    }
  }


  return (
    <Container style={{maxWidth:"1040px"}}> 
      <div style={{ display: 'flex' }}>
        <div className="tag-buttons">
          <button onClick={() => setSelectedTag(null)}>전체</button>
          {campaigns && campaigns.map((campaign) => {
            //console.log('캠페인 태그: '+ campaign.tags); // campaign의 tags를 console.log에 출력
            return (
              <button key={campaign.id} onClick={() => handleTagButtonClick(campaign.tags)}>
                {`${campaign.tags}`}
              </button>
            );
          })}
        </div>
        <Link to={`/sns/snsRegistration`}>
          <button>글쓰기</button>
        </Link>
        <SnsList posts={posts} onImageClick={handleImageClick} selectedTag={selectedTag}/>
        <SnsDetails selectedImage={selectedImage} />  
      </div>
    </Container>
  );
};

export default SnsManage;

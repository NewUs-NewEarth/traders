/**
 * @author jeongyearim
 * @email [example@mail.com]
 * @create date 2023-10-17 17:33:57
 * @modify date 2023-10-20 11:23:16
 * @desc [snsManage의 하위항목]
 */
import React, { useState } from 'react';
import Ratio from 'react-bootstrap/Ratio';
import './css/SnsList.css';
import Container from 'react-bootstrap/Container';

const SnsList = ({ posts, onImageClick, selectedTag }) => {
  

  const dividePosts = (posts) => {
    const arr = [...posts];
    const tmp = [];
    while (arr.length > 0) {
      tmp.push(arr.splice(0, 3)); // 한 번에 3개의 이미지를 행으로 추가
    }
    return tmp;
  };

  const handleMouseOver = (event) => {
    event.currentTarget.querySelector('.image-overlay').style.display = 'block';
    event.currentTarget.querySelector('.banner').style.opacity = 0.5;
  };

  const handleMouseOut = (event) => {
    event.currentTarget.querySelector('.image-overlay').style.display = 'none';
    event.currentTarget.querySelector('.banner').style.opacity = 1;
  };

  const filterImagesByTag = (posts, tag) => {
    if (!tag) {
      return posts; // 모든 포스트를 반환
    }
    console.log('태그: ' + tag);
  
    posts.map((post) => {
      console.log('post.tags: ' + post.tags);
    });
  
    return posts.filter((post) => post.tags === tag);
  };
  

  return (
    <Container style={{maxWidth:"1040px"}}> 
      <div className="post_table">
      

        {dividePosts(posts).map((row, rowIndex) => (
          <div className="posts_row" key={rowIndex.toString()}>
            {filterImagesByTag(row, selectedTag).map((post, colIndex) => (
              <div className="post_container" key={colIndex} style={{ display: 'inline-block' }}>
                <div className="post_image_container">
                  {post.images && post.images.map((image, imageIndex) => (
                    <div key={imageIndex} className="image-container" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                      {/* 이미지 클릭 시 상세 정보를 보여주는 이벤트 처리 */}
                      <div style={{ width: '150px', height: '150px', position: 'relative' }}
                        onClick={() => {
                          onImageClick(post); // Handle image click
                        }}
                      >
                        <Ratio aspectRatio="1x1">
                          <img
                            src={image.filepath}
                            alt={image.filepath}
                            className="banner"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Ratio>
                        <div className="image-overlay" style={{ display: 'none' }}>
                          <div className="banner-txt">
                            {post.tags}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Container>
  );
};

export default SnsList;

/**
 * @author jeongyearim
 * @email [example@mail.com]
 * @create date 2023-10-12 09:44:24
 * @modify date 2023-10-12 11:39:41
 * @desc [캠페인 상세보기]
 */

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom";

const CampaignDetails = () => {
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`/api/sns/showCampaign/${id}`)
      .then((res) => setData(res.data))
      .catch((error) => {
        if (error.response) {
          const errorResponse = error.response.data;
          console.log(errorResponse);
        }
      });
  }, [id]);

  const [data, setData] = useState({});
  const { title, organizer, description, verificationMethod, status, tags, dueDate } =
    data;

  return (
    <div>
      {/* <h1> 조건문 달아서 사용자가 작성자와 일치할 때만 링크 보이게</h1> */}
      {/* <Link to={`/products/update/${id}`} state={{ data }}>
        수정하기
      </Link> */}
      <h1>캠페인 상세보기</h1>
      <h2>이름 - {title}</h2>
      <hr />
      <h3> 주최자 - {organizer}</h3>
      <h3> 상세 설명 - {description}</h3>
      <h3> 인증 방법 - {verificationMethod}</h3>
      <h3> 상태 - {status}</h3>
      <h3> 태그 - {tags}</h3>
      <h3> 기한 - {dueDate}</h3>
      {/* <h3>
        {images.map((image, index) => (
          <div key={index}>
            <img src={image.filepath} width={200} />
          </div>
        ))}
      </h3>  */}
    </div>
  );
};

export default CampaignDetails;


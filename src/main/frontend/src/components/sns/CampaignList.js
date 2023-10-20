/**
 * @author jeongyearim
 * @email [example@mail.com]
 * @create date 2023-10-20 11:16:53
 * @modify date 2023-10-20 11:24:55
 * @desc [CampaignDatails와 SnsManage의 상위 컴포넌트]
 */
import React, { useState, useEffect } from "react";
import { Link, Route, Switch } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import SnsManage from "./SnsManage";
import CampaignDetails from "./CampaignDatails";
import Accordion from 'react-bootstrap/Accordion';
import TokenRefresher from '../service/TokenRefresher';


const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [showExpired, setShowExpired] = useState(false);

  useEffect(() => {
    TokenRefresher
      .get("/sns/showCampaign")
      .then((response) => setCampaigns(response.data))
      .catch((error) => console.error("API Error:", error));
  }, []);

  // Filter campaigns based on the expiration date
  const currentDate = new Date();

  const expiredCampaigns = campaigns.filter((campaign) => {
    const dueDate = new Date(campaign.dueDate);
    return dueDate < currentDate;
  });

  const activeCampaigns = showExpired
    ? campaigns
    : campaigns.filter((campaign) => {
        const dueDate = new Date(campaign.dueDate);
        return dueDate >= currentDate;
      });

  return (
    <Container style={{maxWidth:"1040px"}}> 
      <div>
        <h1>Campaign List</h1>
        <button onClick={() => setShowExpired(!showExpired)}>
          {showExpired ? "기한 지나지 않은 캠페인 보기" : "종료 캠페인 포함"}
        </button>
        <Accordion defaultActiveKey={[]}>
          <ul>
            {activeCampaigns.map((campaign, index) => (
              <li key={campaign.id}>
                <Accordion.Item eventKey={index.toString()}>
                  <Accordion.Header>
                    {campaign.title} / {campaign.dueDate}
                  </Accordion.Header>
                  <Accordion.Body>
                    {/* <Link to={`campaign/${campaign.id}`}>
                      <button>참여하기</button>
                    </Link> */}
                    <CampaignDetails campaignId={campaign.id} />
                  </Accordion.Body>
                </Accordion.Item>
              </li>
            ))}
          </ul>
        </Accordion>
        <SnsManage campaigns={campaigns}/>
      </div>
    </Container>
  );
};

export default CampaignList;

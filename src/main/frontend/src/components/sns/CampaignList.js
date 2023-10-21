/**
 * @author jeongyearim
 * @email [example@mail.com]
 * @create date 2023-10-12 11:38:02
 * @modify date 2023-10-20 13:20:27
 * @desc [캠페인 리스트 출력]
 */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, Route, Switch } from "react-router-dom";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    axios
      .get("/api/sns/showCampaign")
      .then((response) => setCampaigns(response.data))
      .catch((error) => console.error("API Error:", error));
  }, []);

  return (
    <div>
      <h1>Campaign List</h1>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign.id}>
            <Link to={`campaign/${campaign.id}`}>{campaign.title}</Link>
          </li>
        ))}
      </ul>   
    </div>
  );
};

export default CampaignList;

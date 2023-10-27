/**
 * @author hyunseul
 * @create date 2023-10-04 13:02:02
 * @modify date 2023-10-28 06:55:04
 */

/**
 * @author wheesunglee
 * @create date 2023-10-19 23:22:49
 * @modify date 2023-10-19 23:22:56
 */

import "bootstrap/dist/css/bootstrap.min.css";
import jwt_decode from "jwt-decode";
import React, { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import { AiOutlineCalendar } from "react-icons/ai";
import { MdArrowBackIosNew } from "react-icons/md";
import { PiCreditCard } from "react-icons/pi";
import Clock from "react-live-clock";
import { withRouter } from "react-router-dom";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import "../../assets/css/ChatStyle.css";
import { fetchProduct } from "../../assets/js/product";
import TokenRefresher from "../util/TokenRefresher";
import ChatScheduleModal from "./ChatScheduleModal";

// 채팅 내용
const ChatBox = (props) => {
  const [receiver, setReceiver] = useState();
  const [productId, setProductId] = useState();
  const [product, setProduct] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const eventSourceRef = useRef(null);
  const messageRef = useRef(null);
  const history = useHistory();
  const [isModalVisible, setModalVisible] = useState(false);
  const [reservedData, setReservedData] = useState(null);
  const messageEndRef = useRef(null);
  const [savedData, setSavedData] = useState(null);
  const [showSavedData, setShowSavedData] = useState(false);

  ////////////////////////////////////////
  const roomNum = useParams().roomNum;
  const sender = window.user;

  useEffect(() => {
    setInfo(roomNum, window.user);
    fetchPrevMessage();
  }, []);
  useEffect(() => {
    fetchProduct(productId).then((response) => {
      if (response) {
        setProduct(response.data);
      }
    });
  }, [productId]);

  ///////////////////////////////////////

  const toggleModal = () => {
    setModalVisible((prevModalVisible) => !prevModalVisible);
  };

  useEffect(() => {
    eventSourceRef.current = new EventSource(
      `http://localhost:8080/api/chat/roomNum/${roomNum}`
    );

    eventSourceRef.current.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      if (!messages.some((msg) => msg.id === newData.id)) {
        setMessages((prevMessages) => [...prevMessages, newData]);
      }
    };
    scrollToBottom();

    return () => {
      eventSourceRef.current.close();
    };
  }, [messages]);

  const scrollToBottom = () => {
    messageRef.current.scrollTop = messageRef.current.scrollHeight;
  };

  const handleSaveModal = async (data) => {
    const notice = {
      text: "[공지] 거래 일정이 잡혔습니다.",
      sender: sender,
      receiver: receiver,
      roomNum: roomNum,
      date: data.date,
      location: data.location,
    };

    try {
      await TokenRefresher.post("http://localhost:8080/api/chat/save", notice);

      setSavedData({
        date: data.date,
        location: data.location,
      });
      setShowSavedData(true);
    } catch (error) {
      console.error("메시지 전송 또는 데이터 저장 실패:", error);
    }

    setModalVisible(false);
  };

  const getSendMsgBox = (data) => {
    const createdAt = data.createdAt;
    if (createdAt) {
      const tm = data.createdAt.substring(11, 16);

      return (
        <div>
          <div className="sent_msg">
            <p className="message-content">{data.text}</p>
          </div>
          <span className="sent_time_date">{tm}</span>
        </div>
      );
    }
    return null;
  };

  const getReceiveMsgBox = (data) => {
    const createdAt = data.createdAt;
    if (createdAt) {
      const tm = data.createdAt.substring(11, 16);
      return (
        <div>
          <div className="received_withd_msg">
            <p className="message-content">{data.text}</p>
          </div>
          <span className="time_date">{tm}</span>
        </div>
      );
    }
    return null;
  };

  const saveData = (data) => {
    return (
      <div>
        <div className="notice-box">
          <div className="notice-message">
            <p className="notice-header">
              <b style={{ color: "green" }}>{data.sender}</b>님이 약속을
              잡았습니다!
            </p>

            <li className="notice-content">약속일: {data.date}</li>
            <li className="notice-content">약속 장소: {data.location}</li>
          </div>
        </div>
      </div>
    );
  };

  const traded = (data) => {
    return (
      <div>
        <div className="notice-box">
          <div className="notice-message">
            <p className="notice-header">
              <b style={{ color: "green" }}>거래</b>가 완료되었습니다!
            </p>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (reservedData) {
      setMessages((prevMessages) => [...prevMessages, reservedData]);
    }
  }, [reservedData]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      sendMessageToServer(message);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleBackButtonClick = () => {
    history.goBack();
  };

  const handleCardClick = () => {
    history.push(`../../payment/transfer/${productId}`);
  };
  const fetchPrevMessage = async () => {
    try {
      const response = await TokenRefresher.get(
        `http://localhost:8080/api/chat/roomNum/${roomNum}`
      );
      const chatData = response.data || [];

      if (chatData) {
        setMessages([chatData]);
      } else {
        console.error("서버에서 받아온 데이터가 올바른 형식이 아닙니다.");
      }
    } catch (error) {
      console.error("이전 채팅 내용을 가져오는 데 실패했습니다.", error);
    }
  };

  function setInfo(roomNum, sender) {
    const data = jwt_decode(roomNum);

    setProductId(data.productId);
    const seller = data.seller;
    const buyer = data.buyer;

    if (sender == seller) {
      setReceiver(buyer);
    } else {
      setReceiver(seller);
    }
  }

  const sendMessageToServer = async (message) => {
    if (typeof message === "string" && message.trim() !== "") {
      const chat = {
        text: message,
        sender: sender,
        receiver: receiver,
        roomNum: roomNum,
      };
      try {
        if (reservedData && reservedData.date && reservedData.location) {
          setSavedData({
            date: reservedData.date,
            location: reservedData.location,
          });
          setShowSavedData(true);
          // 예약 데이터 전송
          await TokenRefresher.post(
            "http://localhost:8080/api/chat/save",
            reservedData
          );
        }

        await TokenRefresher.post("http://localhost:8080/api/chat", chat);
        setMessage("");
        scrollToBottom();
        setMessages((prevMessages) => [...prevMessages, chat]);
      } catch (error) {
        console.error("메시지 전송 오류:", error);
      }
    }
  };

  return (
    <>
      <Container style={{ width: "750px", marginTop: "150px" }}>
        <ChatScheduleModal
          show={isModalVisible}
          handleClose={toggleModal}
          onsave={handleSaveModal}
        />
        <div>
          <div className="message-container" ref={messageRef}>
            <div className="message-header">
              <div className="message-header-icons">
                <MdArrowBackIosNew
                  size="20px"
                  onClick={handleBackButtonClick}
                />

                <div
                  className="list-receiver"
                  style={{ fontSize: "15pt", marginLeft: "15px" }}
                >
                  {receiver}
                </div>
                <AiOutlineCalendar
                  className="icon-calendar"
                  size="35px"
                  onClick={toggleModal}
                />
                <PiCreditCard
                  className="icon-card"
                  size="35px"
                  onClick={handleCardClick}
                ></PiCreditCard>
              </div>
            </div>
            <div className="message-box">
              <div className="clock-container">
                <div className="clock">
                  <span>
                    <Clock
                      format={"YYYY년 MM월 DD일"}
                      ticking={false}
                      timezone={"Asia/Seoul"}
                    />
                  </span>
                </div>
              </div>
              {messages.map((data, index) => {
                if (data.text === "[공지] 거래 일정이 잡혔습니다.") {
                  return <div key={index}>{saveData(data)}</div>;
                } else if (data.text === "거래완료") {
                  return <div key={index}>{traded(data)}</div>;
                } else if (data.sender === sender && !data.date) {
                  return <div key={index}>{getSendMsgBox(data)}</div>;
                } else if (data.sender !== sender && !data.date) {
                  return <div key={index}>{getReceiveMsgBox(data)}</div>;
                }
                return null;
              })}
              <div ref={messageEndRef}></div>
            </div>
            <div style={{ float: "left", clear: "both" }}></div>
            <div className="message-footer">
              <div className="input_msg_write">
                <input
                  type="text"
                  placeholder="메시지를 입력하세요."
                  value={message}
                  onChange={handleInputChange}
                  onKeyDown={handleEnterPress}
                />
                <button
                  className="msg_send_btn"
                  type="button"
                  onClick={sendMessage}
                >
                  전송
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default withRouter(ChatBox);

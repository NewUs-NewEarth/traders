/**
 * @author hyunseul
 * @create date 2023-10-04 13:02:02
 * @modify date 2023-10-19 15:30:55
 */

import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useRef, useState } from "react";
import Container from 'react-bootstrap/Container';
import {  AiOutlineCalenda r } from "react-icons/ai";
import {  MdArrowBackIosNe w } from "react-icons/m;d";
import {  PiCreditCar d } from "react-iconpi';
imsort Clock from 'react-l/ve-clockp;
import { useParams } from "react-router-dom";i";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import '../../assets/css/ChatStyle.css';
import Chatprofile from "../../assets/img/Chatprofile.png";
import ChatScheduleModal from "./ChatScheduleModal";

// 채팅 내용
const ChatBox = () => {
  const { roomNum } = useParams();
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const eventSourceRef = useRef(null);
  const messageRef = useRef(null);
  const history = useHistory();
  const [isModalVisible, setModalVisible] = useState(false); // 모달
  const [reservedData, setReservedData] = useState(null); // 예약 정보 저장
  const messageEndRef = useRef(null);
  const [savedData, setSavedData] = useState(null);
  const [showSavedData, setShowSavedData] = useState(false);

  const toggleModal = () => {
    setModalVisible((prevModalVisible) => !prevModalVisible);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messageRef.current.scrollTop = messageRef.current.scrollHeight;
  };

  // 이전 채팅 내용을 서버에서 가져오기
  useEffect(() => {
    setUsername(prompt("sender:"));
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/chat/roomNum/${roomNum}`
        );
        const chatData = response.data || [];

        console.log("서버에서 받아온 데이터:", chatData); // 이 부분을 추가하여 데이터를 콘솔에 출력
        if (chatData) {
          setMessages([chatData]);
        } else {
          console.error("서버에서 받아온 데이터가 올바른 형식이 아닙니다.");
        }
      } catch (error) {
        console.error("이전 채팅 내용을 가져오는 데 실패했습니다.", error);
      }
    };
    fetchData(); // 이전 채팅 내용을 가져오기
  }, [roomNum]);

  // EventSource 초기화 및 메시지 받아오기
  useEffect(() => {
    eventSourceRef.current = new EventSource(
      `http://localhost:8080/api/chat/roomNum/${roomNum}`
    );

    eventSourceRef.current.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      // 이전 메시지와 새로운 메시지를 비교하여 새로운 메시지만 업데이트
      if (!messages.some((msg) => msg.id === newData.id)) {
        setMessages((prevMessages) => [...prevMessages, newData]);
      }
    };
    scrollToBottom();

    return () => {
      eventSourceRef.current.close();
    };
  }, [messages]); // messages가 변경될 때마다 useEffect가 호출됨

  // 서버에 메세지 보내기
  const sendMessageToServer = async (message) => {
    if (typeof message === "string" && message.trim() !== "") {
      const chat = {
        text: message,
        sender: username,
        // receiver:username,
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
          await axios.post("http://localhost:8080/api/chat/save", reservedData);
        }

        await axios.post("http://localhost:8080/api/chat", chat);
        console.log("메시지 전송 완료 " + chat);
        setMessage("");
        scrollToBottom();
        setMessages((prevMessages) => [...prevMessages, chat]);
      } catch (error) {
        console.error("메시지 전송 오류:", error);
      }
    }
  };

  const handleSaveModal = async (data) => {
    console.log("모달에서 받은 데이터:", data);

    // 예약 정보 메시지를 서버에 전송
    const notice = {
      text: "일정잡힘",
      sender: username,
      // receiver: username,
      roomNum: roomNum,
      date: data.date,
      location: data.location,
    };

    try {
      // 메시지 전송
      await axios.post("http://localhost:8080/api/chat/save", notice);
      console.log("모달 메시지 전송 완료:", notice);

      // 데이터 상태 변수 업데이트 (date와 location만 저장)
      setSavedData({
        date: data.date,
        location: data.location,
      });
      setShowSavedData(true);
    } catch (error) {
      console.error("메시지 전송 또는 데이터 저장 실패:", error);
    }

    setModalVisible(false); // 모달 닫기
  };

  // 보내는 사람 대화박스(블루)
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

  // 받는 사람 대화박스(그레이)
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
    //qkrtlconsole.log(sender)

    // if (showSavedData && savedData && savedData.date === data.date
    //   && savedData.location === data.location) {
    //     console.log("예약 메세지 출력하는 곳")
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
  //return null;
  //

  // 예약 정보가 있는 경우에만 추가하도록 변경
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
      console.log("Enter pressed");
    }
  };

  // 뒤로가기 버튼 클릭 이벤트 함수
  const handleBackButtonClick = () => {
    history.push("/chat/list");
  };

  const handleCardClick = () => {
    history.push("/");
  };

  return (
    <>
      <Container style={{ maxWidth: "1040px" }}>
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
                　
                <img
                  src={Chatprofile}
                  className="profile_img"
                  alt="상품 이미지"
                  value={username}
                />
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
              </div>{" "}
              {/* message-header-icons 끝 */}
            </div>{" "}
            {/* message-header 끝 */}
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
                </div>{" "}
                {/* clock 끝 */}
              </div>{" "}
              {/* clock-container 끝 */}
              {messages.map((data, index) => {
                // if (data.date && data.location) {
                console.log(typeof data.text);

                if (data.text === "일정잡힘") {
                  return <div key={index}>{saveData(data)}</div>;
                } else if (data.sender === username && !data.date) {
                  return <div key={index}>{getSendMsgBox(data)}</div>;
                } else if (data.sender !== username && !data.date) {
                  return <div key={index}>{getReceiveMsgBox(data)}</div>;
                }
                return null;
              })}
              <div ref={messageEndRef}></div>
              {/* 모달 및 채팅창 UI 코드 (기존 코드) */}
            </div>{" "}
            {/* message-box 끝 */}
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
            </div>{" "}
            {/* input_msg_write 끝 */}
          </div>{" "}
          {/* message-container 끝 */}
        </div>{" "}
        {/* message 끝 */}
      </Container>
    </>
  );
};

export default ChatBox;

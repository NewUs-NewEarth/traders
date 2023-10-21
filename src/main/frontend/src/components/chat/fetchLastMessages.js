/**
 * @author hyunseul
 * @create date 2023-10-17 16:30:32
 * @modify date 2023-10-20 16:08:47
 */
/**
 * @author wheesunglee
 * @create date 2023-10-19 10:08:23
 * @modify date 2023-10-20 16:08:26
 * @desc 백엔드 연결
 */

import axios from "axios";

const fetchLastMessages = async (roomNum) => {
    try {
        const response = await axios.get(
            `http://localhost:8080/api/chat/roomNum/${roomNum}`
        );
        const chatData = response.data || {};
        console.log(chatData);

        const lastMsg = chatData
            .split("data")
            .slice(-1)[0]
            .split(",")[1]
            .split(":");
        const sender = chatData.split("data").slice(-1)[0].split(",")[2].split(":");
        const receiver = chatData
            .split("data")
            .slice(-1)[0]
            .split(",")[5]
            .split(":");

        if (lastMsg[1] && sender[1] && receiver) {
            const lastText = lastMsg[1].replace(/"/g, "");

            const lastSender = sender[1].replace(/"/g, "");

            const lastReceiver = receiver[1].replace(/"/g, "");

            return {
                lastMessage: lastText,
                sender: lastSender,
                receiver: lastReceiver,
            };
        } else {
            console.log("마지막 메시지 형식이 잘못되었습니다.");
            return null;
        }
    } catch (error) {
        console.error(
            `채팅방 ${roomNum}의 마지막 메시지를 가져오는 데 실패했습니다:`,
            error
        );
        throw error;
    }
};

export {fetchLastMessages};

/**
 * @author hyunseul
 * @create date 2023-10-17 16:30:43
 * @modify date 2023-10-17 16:30:50
 */

// ScheduleDatePicker 컴포넌트
import React, {useState} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../assets/css/ChatMapModal.css';
import ko from 'date-fns/locale/ko';

const ScheduleDatePicker = ({onChange, onClick}) => {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);

        // ChatScheduleModal로 날짜 넘기기
        if (date instanceof Date) {
            const formattedDate = date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            });
            onChange(formattedDate); // 날짜 문자열로 변환
        } else {
            onChange(date); // 이미 문자열인 경우 그대로 전달
        }
    };

    const handleDatePickerClick = () => {
        if (onClick) {
            onClick(); // onClick 콜백 함수 호출하여 모달 닫기
        }
    };

    return (
        <div className="form-group">
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                showTimeSelect
                timeFormat="HH:mm "
                timeIntervals={30}
                dateFormat="yyyy년MM월dd일 aa HH:mm"
                className="form-control react-datepicker"
                placeholderText="날짜 및 시간을 선택하세요."
                style={{width: '100%'}}
                popperPlacement="bottom-end"
                locale={ko}
                onClick={handleDatePickerClick}

            />
        </div>
    );
};

export default ScheduleDatePicker;

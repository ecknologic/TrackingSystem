import React, { useEffect, useState } from 'react'
import { Row, Col, DatePicker, Card, Button } from 'antd'
import {
    LeftOutlined, RightOutlined, CalendarOutlined
} from '@ant-design/icons';
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';


const CustomDatePicker = (props) => {
    const [noOfDays, setNoOfDays] = useState(0);
    const [currentYear, setCurrentYear] = useState(0)
    const [currentMonth, setCurrentMonth] = useState(0)
    const [currentDay, setCurrentDay] = useState(0)
    const [currentDate, setCurrentDate] = useState(0)
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    useEffect(() => {
        let todayDate = moment(new Date(), dateFormat)
        setDate(todayDate)
    }, [])
    const setDate = (date) => {
        let formatedDate = moment(date).format(dateFormat)
        props.onDateChange(formatedDate)
        setCurrentDate(formatedDate)
        setNoOfDays(moment(date).daysInMonth());
        setCurrentMonth(date.format('M'))
        setCurrentYear(date.format('Y'))
        setCurrentDay(date.format('D'))
    }
    const onCardClick = (i) => {
        setCurrentDay(i)
        let date = `${currentYear}-${currentMonth}-${i}`
        setCurrentDate(date)
        props.onDateChange(date)
    }
    const onDateChange = (e) => {
        let date = moment(new Date(e), dateFormat)
        setDate(date)
    }
    const getCurrentMonthDetails = () => {
        let arr = [];
        [...Array(noOfDays)].map((e, i) => {
            arr.push(<Card onClick={() => onCardClick(String(i + 1).padStart(2, '0'))} style={{ color: (i + 1) == currentDay ? '#fff' : '#000', backgroundColor: (i + 1) == currentDay ? '#3E72FF' : '#fff' }}>
                <p>{i + 1}</p>
                <p>{days[moment(`${currentYear}-${currentMonth}-${(i + 1)}`).day()]}</p>
            </Card>)
        })
        return arr
    }
    return (
        <div className="date_picker_maincomp">
            <Row>
                <Col span={4}>
                    <p className="dateMonthtext">{months[currentMonth - 1]} - 19 to 25</p>
                </Col>
                <Col span={16} className="date_picker_date_col">
                    <div className="swiper_prevbtns">
                        <span className="slider-btn btn-l" onClick={() => this.handleClick('prev')}><LeftOutlined /></span>
                    </div>
                    <div className="swiper_cardslist">
                        <div className="DatePicker_comp_card">
                            {
                                getCurrentMonthDetails()
                            }
                        </div>
                    </div>
                    <div className="swiper_nextbtns">
                        <span className="slider-btn btn-r" onClick={() => this.handleClick('next')}><RightOutlined /></span>
                    </div>
                </Col>
                <Col span={4}>
                    <DatePicker value={moment(currentDate) || undefined} onChange={(e) => onDateChange(e)} placeholder="Select Date" style={{ backgroundColor: 'transparent', marginTop: '50px', border: 'none' }} format={dateFormat} />
                </Col>
            </Row>
        </div>
    )
}

export default CustomDatePicker;
import React from 'react'
import { Row, Col, Card,Button } from 'antd'
import {
    LeftOutlined,RightOutlined,CalendarOutlined
  } from '@ant-design/icons';


const CustomDatePicker = () => {
    return (
        <div className="date_picker_maincomp">
            <Row>
                <Col span={4}>
                    <p className="dateMonthtext">April - 19 to 25</p>
                </Col>
                <Col span={16} className="date_picker_date_col">
                    <div className="swiper_prevbtns">
                    <span className="slider-btn btn-l" onClick={() => this.handleClick('prev')}><LeftOutlined /></span>
                    </div>
                    <div className="swiper_cardslist">
                <div className="DatePicker_comp_card">
                        <Card>
                            <p>2</p>
                            <p>Sat</p>
                        </Card>
                        <Card>
                            <p>3</p>
                            <p>Sun</p>
                        </Card>
                        <Card>
                            <p>4</p>
                            <p>Mon</p>
                        </Card>
                        <Card>
                            <p>5</p>
                            <p>Tue</p>
                        </Card>
                        <Card>
                            <p>6</p>
                            <p>Wed</p>
                        </Card>
                        <Card>
                            <p>7</p>
                            <p>Thur</p>
                        </Card>
                        <Card>
                            <p>8</p>
                            <p>Fri</p>
                        </Card>
                        <Card>
                            <p>9</p>
                            <p>Sat</p>
                        </Card>
                        <Card>
                            <p>10</p>
                            <p>Sun</p>
                        </Card>
                        <Card>
                            <p>11</p>
                            <p>Mon</p>
                        </Card>
                        <Card>
                            <p>12</p>
                            <p>Tue</p>
                        </Card>
                    </div>
                    </div>
                    <div className="swiper_nextbtns">
                    <span className="slider-btn btn-r" onClick={() => this.handleClick('next')}><RightOutlined /></span>
                    </div>

                    
                </Col>
                <Col span={4}>
                    <Button type="primary" ghost className="selectDateBtn"><span><CalendarOutlined /></span> <span> Select Date</span></Button>
                </Col>
            </Row>
        </div>
    )
}

export default CustomDatePicker;
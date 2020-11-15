import React, { useState } from 'react';
import { Row, Col, Button, Modal, Form, Select } from 'antd'
import CustomDatePicker from './Date_picker'
import Delivery from './Delivery'
import StockDetails from './StockDetails'
import RoutesComp from './RoutesComp'
import { TODAYDATE } from '../utils/constants';
const { Option } = Select;


const Tabs = () => {
    const [stockDetailsTab, setStockDetailsTab] = useState(true)
    const [deliveryDetailsTab, setDeliveryDetailsTab] = useState(false)
    const [ordersTab, setOrdersTab] = useState(false)
    const [routesTab, setRoutesTab] = useState(false)
    const [currentDate, setCurrentDate] = useState(TODAYDATE)
    const [tab5, setTab5] = useState(false)

    const onTabChange = (type) => {
        if (type == "stockDetails") {
            setStockDetailsTab(true); setDeliveryDetailsTab(false); setOrdersTab(false); setRoutesTab(false); setTab5(false)
        } else if (type == "deliveryDetails") {
            setStockDetailsTab(false); setDeliveryDetailsTab(true); setOrdersTab(false); setRoutesTab(false); setTab5(false)
        } else if (type == "orders") {
            setStockDetailsTab(false); setDeliveryDetailsTab(false); setOrdersTab(true); setRoutesTab(false); setTab5(false)
        } else if (type == "routes") {
            setStockDetailsTab(false); setDeliveryDetailsTab(false); setOrdersTab(false); setRoutesTab(true); setTab5(false)
        } else {
            setStockDetailsTab(false); setDeliveryDetailsTab(false); setOrdersTab(false); setRoutesTab(false); setTab5(true)
        }
    }
    return (
        <div className="TabsmaindivComp">
            <Row>
                <Col span={18}>
                    <ul className="tabs_coponents_tabs list-inline">
                        <li className={stockDetailsTab ? 'ActiveTab' : 'normalTab'} onClick={() => onTabChange("stockDetails")}>
                            <h5>Stock Details</h5>
                        </li>
                        <li className={deliveryDetailsTab ? 'ActiveTab' : 'normalTab'} onClick={() => onTabChange("deliveryDetails")}>
                            <h5>Delivery Details</h5>
                        </li>
                        <li className={ordersTab ? 'ActiveTab' : 'normalTab'} onClick={() => onTabChange("orders")}>
                            <h5>Orders</h5>
                        </li>
                        <li className={routesTab ? 'ActiveTab' : 'normalTab'} onClick={() => onTabChange("routes")}>
                            <h5>Routes</h5>
                        </li>
                        <li className={tab5 ? 'ActiveTab' : 'normalTab'} onClick={() => onTabChange("staff")}><h5>Staff</h5></li>
                    </ul>
                </Col>
                <Col span={6}>
                    <div>
                        <Button className="tabscompgetreportsbtn" type="primary"> <span>Get Reports</span></Button>

                    </div>
                </Col>
            </Row>
            <div>
                <CustomDatePicker onDateChange={(e) => setCurrentDate(e)} />
            </div>
            <div>
                {stockDetailsTab && <div>
                    <StockDetails currentDate={currentDate}/>
                </div>}
                {deliveryDetailsTab && <div>
                    <Delivery currentDate={currentDate}/>
                </div>}
                {ordersTab && <div>
                    <h1>Tabs3</h1>
                </div>}
                {routesTab && <div>
                    <RoutesComp />
                </div>}
                {tab5 && <div>
                    <h1>Tabs5</h1>
                </div>}
            </div>
            {/* <Row>
                <Col span={6}>
                    <div>
                        <Button type="primary" onClick={() => { setVisible(true) }}> <span>Modal12</span></Button>
                    </div>
                    <Button type="primary" onClick={() => { setVisible1(true) }}> <span>Modal</span></Button>
                </Col>
            </Row> */}


        </div>
    )
}

export default Tabs;
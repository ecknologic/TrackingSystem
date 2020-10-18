import React, { useState } from 'react';
import { Row, Col, Button, Modal, Form, Select} from 'antd'
import CustomDatePicker from './Date_picker'
import Delivery from './Delivery'
import StockDetails from './StockDetails'
import RoutesComp from './RoutesComp'
const { Option } = Select;


const Tabs = () => {
    const [tab1, setTab1] = useState(true)
    const [tab2, setTab2] = useState(false)
    const [tab3, setTab3] = useState(false)
    const [tab4, setTab4] = useState(false)
    const [tab5, setTab5] = useState(false)

    const tabsBtn = (type) => {
        console.log("kumar")
        if (type == "stockDetails") {
            setTab1(true); setTab2(false); setTab3(false); setTab4(false); setTab5(false)
        } else if (type == "deliveryDetails") {
            setTab1(false); setTab2(true); setTab3(false); setTab4(false); setTab5(false)
        } else if (type == "orders") {
            setTab1(false); setTab2(false); setTab3(true); setTab4(false); setTab5(false)
        } else if (type == "routes") {
            setTab1(false); setTab2(false); setTab3(false); setTab4(true); setTab5(false)
        } else {
            setTab1(false); setTab2(false); setTab3(false); setTab4(false); setTab5(true)
        }
    }

    return (
        <div className="TabsmaindivComp">
            <Row>
                <Col span={18}>
                    <ul className="tabs_coponents_tabs list-inline">
                        <li className={tab1 ? 'ActiveTab' : 'normalTab'} onClick={() => tabsBtn("stockDetails")}>
                            <h5>Stock Details</h5>
                        </li>
                        <li className={tab2 ? 'ActiveTab' : 'normalTab'} onClick={() => tabsBtn("deliveryDetails")}>
                            <h5>Delivery Details</h5>
                        </li>
                        <li className={tab3 ? 'ActiveTab' : 'normalTab'} onClick={() => tabsBtn("orders")}>
                            <h5>Orders</h5>
                        </li>
                        <li className={tab4 ? 'ActiveTab' : 'normalTab'} onClick={() => tabsBtn("routes")}>
                            <h5>Routes</h5>
                        </li>
                        <li className={tab5 ? 'ActiveTab' : 'normalTab'} onClick={() => tabsBtn("staff")}><h5>Staff</h5></li>
                    </ul>
                </Col>
                <Col span={6}>
                    <div>
                        <Button className="tabscompgetreportsbtn" type="primary"> <span>Get Reports</span></Button>

                    </div>
                </Col>
            </Row>
            <div>
                <CustomDatePicker />
            </div>
            <div>
                {tab1 && <div>
                    <StockDetails />
                </div>}
                {tab2 && <div>
                    <Delivery />
                </div>}
                {tab3 && <div>
                    <h1>Tabs3</h1>
                </div>}
                {tab4 && <div>
                    <RoutesComp/>
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
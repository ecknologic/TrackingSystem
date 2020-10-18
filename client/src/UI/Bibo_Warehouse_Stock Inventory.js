import React from "react";
import { Row, Col } from 'antd';
import WareHouseinfo from './WareHouseinfo'
import Tabs from './Tabs_component'
import '../css/styles.css'

const BiboWarehouse = (props) => {
    return (
        <div>
            <WareHouseinfo />
            <Tabs/>
        </div>
    )
}

export default BiboWarehouse;
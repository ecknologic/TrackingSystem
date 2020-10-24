import React from "react";
import { Row, Col } from 'antd';
import WareHouseinfo from './WareHouseinfo'
import Tabs from './Tabs_component'
import LayoutPage from '../UI/Layout';
import '../css/styles.css'

const BiboWarehouse = (props) => {
    return (
        <div>
            <LayoutPage>
                <WareHouseinfo />
                <Tabs />
            </LayoutPage>
        </div>
    )
}

export default BiboWarehouse;
import { Select } from 'antd';
import React from 'react';
const { Option } = Select;
export const WEEKDAYS = ["ALL", "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
export const idOptions = [
    <Option key='1' value="adharNo">Aadhar</Option>,
    <Option key='2' value="panNo">PAN</Option>,
    // <Option key='3' value="dlNo">Driving License</Option>,
    // <Option key='4' value="passportNo">Passport</Option>
]
export const businessOptions = [
    <Option key='1' value="Residential">Residential</Option>,
    <Option key='2' value="Software">Software</Option>,
    <Option key='3' value="Corporate">Corporate</Option>,
    <Option key='4' value="Traders">Traders</Option>
]
export const statusOptions = [
    <Option key='1' value={1}>Active</Option>,
    <Option key='2' value={0}>Draft</Option>,
]
export const statusFilterOptions = [
    { value: 0, option: 'Draft' },
    { value: 1, option: 'Active' }
]
export const businessFilterOptions = [
    { value: 'Residential', option: 'Residential' },
    { value: 'Software', option: 'Software' },
    { value: 'Corporate', option: 'Corporate' },
    { value: 'Traders', option: 'Traders' }
]
export const invoiceOptions = [
    <Option key="1" value="complimentary">Complimentary</Option>,
    <Option key="2" value="nonComplimentary">Non Complimentary</Option>
]
export const numOptions = [
    <Option key="1" value={1}>01</Option>,
    <Option key="2" value={2}>02</Option>,
    <Option key="3" value={3}>03</Option>,
    <Option key="4" value={4}>04</Option>,
    <Option key="5" value={5}>05</Option>,
    <Option key="6" value={6}>06</Option>,
    <Option key="7" value={7}>07</Option>
]
export const dayOptions = [
    <Option key="0" value="ALL">ALL</Option>,
    <Option key="1" value="MON">MON</Option>,
    <Option key="2" value="TUE">TUE</Option>,
    <Option key="3" value="WED">WED</Option>,
    <Option key="4" value="THU">THU</Option>,
    <Option key="5" value="FRI">FRI</Option>,
    <Option key="6" value="SAT">SAT</Option>,
    <Option key="7" value="SUN">SUN</Option>
]
export const productOptions = [
    <Option key="1" value="p1">Product 1</Option>,
    <Option key="2" value="p2">Product 2</Option>,
    <Option key="3" value="p3">Product 3</Option>,
    <Option key="4" value="p4">Product 4</Option>,
    <Option key="5" value="p5">Product 5</Option>,
    <Option key="6" value="p6">Product 6</Option>,
    <Option key="7" value="p7">Product 7</Option>
]

export const getRouteOptions = (routes = []) => {
    return routes.map((item) => <Option key={item.RouteId} value={item.RouteId}>{item.RouteName}</Option>)
}

export const getDriverOptions = (drivers = []) => {
    return drivers.map((item) => <Option key={item.driverId} value={item.driverId}>{item.driverName}</Option>)
}

export const deliveryColumns = [
    {
        title: 'DC Number',
        dataIndex: 'dcnumber',
        key: 'dcnumber',
    },
    {
        title: 'Shop Address',
        dataIndex: 'shopAddress',
        key: 'shopAddress',
    },
    {
        title: 'Route',
        dataIndex: 'route',
        key: 'route',
    },
    {
        title: 'Driver Name',
        key: 'driverName',
        dataIndex: 'driverName',
    },
    {
        title: 'Order Details',
        dataIndex: 'orderDetails',
        key: 'routeorderDetails',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
    },

    {
        title: 'Actions',
        dataIndex: 'action',
        key: 'action'
    },
]

export const productionColumns = [
    {
        title: 'Batch No',
        dataIndex: 'batchNo',
        key: 'batchNo',
    },
    {
        title: 'Production Details',
        dataIndex: 'productionDetails',
        key: 'productionDetails',
    },
    {
        title: 'PH',
        dataIndex: 'phLevel',
        key: 'phLevel',
    },
    {
        title: 'Ozone Level',
        key: 'ozoneLevel',
        dataIndex: 'ozoneLevel',
    },
    {
        title: 'TDS',
        dataIndex: 'TDS',
        key: 'TDS',
    },
    {
        title: 'Date & time',
        dataIndex: 'dateAndTime',
        key: 'dateAndTime',
    },
    {
        title: 'Shift Type',
        dataIndex: 'shiftType',
        key: 'shiftType'
    },
    {
        title: 'Manager',
        dataIndex: 'managerName',
        key: 'managerName'
    },
    {
        title: 'Actions',
        dataIndex: 'action',
        key: 'action'
    },
]

export const dispatchColumns = [
    {
        title: 'DC Number',
        dataIndex: 'dcnumber',
        key: 'dcnumber',
    },
    {
        title: 'Batch No',
        dataIndex: 'batchNo',
        key: 'batchNo',
    },
    {
        title: 'Production Details',
        dataIndex: 'productionDetails',
        key: 'productionDetails',
    },
    {
        title: 'Vehicle No',
        dataIndex: 'vehicleNo',
        key: 'vehicleNo',
    },
    {
        title: 'Driver Name',
        key: 'driverName',
        dataIndex: 'driverName',
    },
    {
        title: 'Dispatch To',
        dataIndex: 'dispatchTo',
        key: 'dispatchTo',
    },
    {
        title: 'Date & time',
        dataIndex: 'dateAndTime',
        key: 'dateAndTime',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status'
    },
    {
        title: 'Actions',
        dataIndex: 'action',
        key: 'action'
    },
]
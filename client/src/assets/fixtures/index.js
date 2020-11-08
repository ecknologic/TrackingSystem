import { Select } from 'antd';
import React from 'react';
const { Option } = Select;

export const idOptions = [
    <Option key='1' value="adharNo">Aadhar</Option>,
    <Option key='2' value="panNo">PAN</Option>,
    <Option key='3' value="dlNo">Driving License</Option>,
    <Option key='4' value="passportNo">Passport</Option>
]
export const businessOptions = [
    <Option key='1' value="residential">Residential</Option>,
    <Option key='2' value="software">Software</Option>,
    <Option key='3' value="corporate">Corporate</Option>,
    <Option key='4' value="traders">Traders</Option>
]
export const invoiceOptions = [
    <Option key="1" value="complimentary">Complimentary</Option>,
    <Option key="2" value="non-complimentary">Non Complimentaru</Option>
]
export const numOptions = [
    <Option key="1" value="1">01</Option>,
    <Option key="2" value="2">02</Option>,
    <Option key="3" value="3">03</Option>,
    <Option key="4" value="4">04</Option>,
    <Option key="5" value="5">05</Option>,
    <Option key="6" value="6">06</Option>,
    <Option key="7" value="7">07</Option>
]
export const dayOptions = [
    <Option key="1" value="MON">Monday</Option>,
    <Option key="2" value="TUE">Tuesday</Option>,
    <Option key="3" value="WED">Wednesday</Option>,
    <Option key="4" value="THU">Thursday</Option>,
    <Option key="5" value="FRI">Friday</Option>,
    <Option key="6" value="SAT">Saturday</Option>,
    <Option key="7" value="SUN">Sunday</Option>
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

export const getRouteOptions = (routes) => {
    return routes.map((item) => <Option key={item.RouteId} value={item.RouteId}>{item.RouteName}</Option>)
}
export const getDeliveryDays = (data = []) => {
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
    const daysObj = {}
    days.map((day) => {
        if (data.includes(day)) {
            daysObj[day] = 1
        } else daysObj[day] = 0
    })
    return daysObj
}
export const getDevDays = (data = {}) => {
    const days = []
    const { SUN, MON, TUE, WED, THU, FRI, SAT } = data
    if (Number(SUN)) days.push('SUN')
    if (Number(MON)) days.push('MON')
    if (Number(TUE)) days.push('TUE')
    if (Number(WED)) days.push('WED')
    if (Number(THU)) days.push('THU')
    if (Number(FRI)) days.push('FRI')
    if (Number(SAT)) days.push('SAT')

    return days
}
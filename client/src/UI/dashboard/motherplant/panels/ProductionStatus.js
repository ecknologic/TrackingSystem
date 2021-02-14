import axios from 'axios';
import Slider from "react-slick";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import { TODAYDATE as d } from '../../../../utils/constants';
import PanelHeader from '../../../../components/PanelHeader';
import ProductionStatusCard from '../../../../components/ProductionStatusCard';
import { LeftChevronIconGrey, RightChevronIconGrey } from '../../../../components/SVG_Icons';
const todayString = 'Today'
const options = { startDate: d, endDate: d, shift: 'All', type: todayString }

const ProductionStatus = () => {
    const [production, setProduction] = useState({})
    const [opData, setOpData] = useState(() => options)

    const { product20LCount, product2LCount, product1LCount, product500MLCount, product250MLCount } = production
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getProductionStatus(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getProductionStatus = async ({ startDate, endDate, shift, type }) => {
        const url = `/motherPlant/getTotalProductionByDate?startDate=${startDate}&endDate=${endDate}&shiftType=${shift}&type=${type}`

        try {
            const data = await http.GET(axios, url, config)
            setProduction(data)
        } catch (error) { }
    }

    const handleOperation = useCallback((data) => {
        const newData = { ...opData, ...data }
        getProductionStatus(newData)
        setOpData(newData)
    }, [opData])

    return (
        <>
            <PanelHeader title='Production Status' onSelect={handleOperation} showShow showShift />
            <div className='panel-body'>
                <Slider className='dashboard-slider' {...props} >
                    <ProductionStatusCard title='20 Ltrs' total={product20LCount} />
                    <ProductionStatusCard title='2 Ltrs' total={product2LCount} />
                    <ProductionStatusCard title='1 Ltrs' total={product1LCount} />
                    <ProductionStatusCard title='500 ml' total={product500MLCount} />
                    <ProductionStatusCard title='300 ml' total={product250MLCount} />
                </Slider>
            </div>
        </>
    )
}
const props = {
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: <LeftChevronIconGrey />,
    nextArrow: <RightChevronIconGrey />,
}

export default ProductionStatus
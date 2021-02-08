import axios from 'axios';
import Slider from "react-slick";
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { http } from '../../../../modules/http';
import StockCard from '../../../../components/StockCard';
import PanelHeader from '../../../../components/PanelHeader';
import { TODAYDATE as d } from '../../../../utils/constants';
import { LeftChevronIconGrey, RightChevronIconGrey } from '../../../../components/SVG_Icons';
const options = { startDate: d, endDate: d, shift: 'All', fromStart: true }

const TotalStockStatus = () => {
    const sliderRef = useRef()
    const [stock, setStock] = useState({})
    const [opData, setOpData] = useState(() => options)
    const { product20LCount, product2LCount, product1LCount, product500MLCount, product250MLCount } = stock

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getTotalStock(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getTotalStock = async ({ startDate, endDate, shift, fromStart }) => {
        const url = `/motherPlant/getTotalProductionDetails?startDate=${startDate}&endDate=${endDate}&shiftType=${shift}&fromStart=${fromStart}`

        try {
            const data = await http.GET(axios, url, config)
            setStock(data)
        } catch (error) { }
    }

    const handleOperation = useCallback((data) => {
        const newData = { ...opData, ...data }
        getTotalStock(newData)
        setOpData(newData)
    }, [opData])

    return (
        <>
            <PanelHeader title='Total Stock Status' onSelect={handleOperation} beginning />
            <div className='panel-body'>
                <Slider className='dashboard-slider' {...props} ref={sliderRef}>
                    <StockCard title='20 Ltrs' total={product20LCount} />
                    <StockCard title='2 Ltrs' total={product2LCount} />
                    <StockCard title='1 Ltrs' total={product1LCount} />
                    <StockCard title='500 ml' total={product500MLCount} />
                    <StockCard title='300 ml' total={product250MLCount} />
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

export default TotalStockStatus
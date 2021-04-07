import axios from 'axios';
import Slider from "react-slick";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import StockCard from '../../../../components/StockCard';
import can1L from '../../../../assets/icons/ic_Can1L.svg'
import can2L from '../../../../assets/icons/ic_Can2L.svg'
import can20L from '../../../../assets/icons/ic_Can20L.svg'
import PanelHeader from '../../../../components/PanelHeader';
import { TODAYDATE as d } from '../../../../utils/constants';
import can300ML from '../../../../assets/icons/ic_Can300ML.svg'
import can500ML from '../../../../assets/icons/ic_Can500ML.svg'
import { LeftChevronIconGrey, RightChevronIconGrey } from '../../../../components/SVG_Icons';
const options = { startDate: d, endDate: d, shift: 'All', fromStart: true }

const TotalStockStatus = () => {
    const [stock, setStock] = useState({})
    const [opData, setOpData] = useState(() => options)
    const { product20LCount, product2LCount, product1LCount, product500MLCount, product300MLCount } = stock

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getTotalStock(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getTotalStock = async ({ startDate, endDate, shift, fromStart }) => {
        const url = `motherPlant/getTotalProductionDetails?startDate=${startDate}&endDate=${endDate}&shiftType=${shift}&fromStart=${fromStart}`

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
            <PanelHeader title='Total Stock Status' onSelect={handleOperation} showShow showShift />
            <div className='panel-body'>
                <Slider className='dashboard-slider' {...props} >
                    <StockCard title='20 Ltrs' icon={can20L} total={product20LCount} />
                    <StockCard title='2 Ltrs' icon={can2L} total={product2LCount} />
                    <StockCard title='1 Ltrs' icon={can1L} total={product1LCount} />
                    <StockCard title='500 ml' icon={can500ML} total={product500MLCount} />
                    <StockCard title='300 ml' icon={can300ML} total={product300MLCount} />
                </Slider>
            </div>
        </>
    )
}
const props = {
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    prevArrow: <LeftChevronIconGrey />,
    nextArrow: <RightChevronIconGrey />,
}

export default TotalStockStatus
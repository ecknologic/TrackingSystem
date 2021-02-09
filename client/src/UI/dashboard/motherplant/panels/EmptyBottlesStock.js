import axios from 'axios';
import Slider from "react-slick";
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PanelHeader from '../../../../components/PanelHeader';
import EmptyBottlesStockCard from '../../../../components/EmptyBottlesStockCard';
import { LeftChevronIconGrey, RightChevronIconGrey } from '../../../../components/SVG_Icons';
import { TODAYDATE as d } from '../../../../utils/constants';
import { http } from '../../../../modules/http';
const options = { startDate: d, endDate: d, fromStart: true }

const EmptyBottlesStock = () => {
    const sliderRef = useRef()
    const [emptyCans, setEmptyCans] = useState({})
    const [opData, setOpData] = useState(() => options)
    const { product20LCount, product2LCount, product1LCount, product500MLCount, product250MLCount } = emptyCans

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getEmptyCans(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getEmptyCans = async ({ startDate, endDate, fromStart }) => {
        const url = `/warehouse/getTotalEmptyCansCount?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}`

        try {
            const [data] = await http.GET(axios, url, config)
            setEmptyCans(data)
        } catch (error) { }
    }

    const handleOperation = useCallback((data) => {
        const newData = { ...opData, ...data }
        getEmptyCans(newData)
        setOpData(newData)
    }, [opData])

    return (
        <>
            <PanelHeader title='Empty Bottles Stock' onSelect={handleOperation} beginning hideShift />
            <div className='panel-body'>
                <Slider className='dashboard-slider empty-bottles-stock-slider' {...props} ref={sliderRef}>
                    <EmptyBottlesStockCard title='20 Ltrs' total={product20LCount} strokeColor='#F7B500' />
                    <EmptyBottlesStockCard title='20 Ltrs new' total={product2LCount} strokeColor='#4C9400' />
                    <EmptyBottlesStockCard title='1 Ltrs new' total={product1LCount} strokeColor='#41B9AD' />
                    <EmptyBottlesStockCard title='500 ml new' total={product500MLCount} strokeColor='#0091FF' />
                    <EmptyBottlesStockCard title='300 ml new' total={product250MLCount} strokeColor='#FA6400' />
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
export default EmptyBottlesStock
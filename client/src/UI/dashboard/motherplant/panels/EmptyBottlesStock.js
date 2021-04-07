import axios from 'axios';
import Slider from "react-slick";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PanelHeader from '../../../../components/PanelHeader';
import EmptyBottlesStockCard from '../../../../components/EmptyBottlesStockCard';
import { LeftChevronIconGrey, RightChevronIconGrey } from '../../../../components/SVG_Icons';
import { TODAYDATE as d } from '../../../../utils/constants';
import { http } from '../../../../modules/http';
const options = { startDate: d, endDate: d, fromStart: true, type: 'Till Now', fromStart: true }

const EmptyBottlesStock = () => {
    const [emptyCans, setEmptyCans] = useState({})
    const [opData, setOpData] = useState(() => options)
    const { product20LCount, product2LCount, product1LCount, product500MLCount, product300MLCount, product2LPercent,
        product20LPercent, product1LPercent, product500MLPercent, product300MLPercent } = emptyCans

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getEmptyCans(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getEmptyCans = async ({ startDate, endDate, type, fromStart }) => {
        const url = `warehouse/getTotalEmptyCansCount?startDate=${startDate}&endDate=${endDate}&type=${type}&fromStart=${fromStart}`

        try {
            const data = await http.GET(axios, url, config)
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
            <PanelHeader title='Empty Bottles Stock' onSelect={handleOperation} showShow />
            <div className='panel-body'>
                <Slider className='dashboard-slider empty-bottles-stock-slider' {...props} >
                    <EmptyBottlesStockCard title='20 Ltrs' percent={product20LPercent} total={product20LCount} strokeColor='#F7B500' text='' />
                    <EmptyBottlesStockCard title='20 Ltrs new' percent={product2LPercent} total={product2LCount} strokeColor='#4C9400' text='Total Bottles Added - 18,232' />
                    <EmptyBottlesStockCard title='1 Ltrs new' percent={product1LPercent} total={product1LCount} strokeColor='#41B9AD' text='Total Bottles Added - 18,232' />
                    <EmptyBottlesStockCard title='500 ml new' percent={product500MLPercent} total={product500MLCount} strokeColor='#0091FF' text='Total Bottles Added - 18,232' />
                    <EmptyBottlesStockCard title='300 ml new' percent={product300MLPercent} total={product300MLCount} strokeColor='#FA6400' text='Total Bottles Added - 18,232' />
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
export default EmptyBottlesStock
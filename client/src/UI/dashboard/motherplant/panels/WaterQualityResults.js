import axios from 'axios';
import Slider from "react-slick";
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { http } from '../../../../modules/http';
import PanelHeader from '../../../../components/PanelHeader';
import { TODAYDATE as d } from '../../../../utils/constants';
import QualityResultCard from '../../../../components/QualityResultCard';
import { LeftChevronIconGrey, RightChevronIconGrey } from '../../../../components/SVG_Icons';
const options = { startDate: d, endDate: d, fromStart: true }

const WaterQualityResults = () => {
    const sliderRef = useRef()
    const [results, setResults] = useState([])
    const [opData, setOpData] = useState(() => options)

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getTestResults(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getTestResults = async ({ startDate, endDate, fromStart }) => {
        const url = `/motherPlant/getQCTestResults?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}`

        try {
            const data = await http.GET(axios, url, config)
            setResults(data)
        } catch (error) { }
    }

    const handleOperation = useCallback((data) => {
        const newData = { ...opData, ...data }
        getTestResults(newData)
        setOpData(newData)
    }, [opData])

    return (
        <>
            <PanelHeader title='Water Quality Testing Results' onSelect={handleOperation} beginning hideShift />
            <div className='panel-body quality-testing-panel'>
                <Slider className='dashboard-slider' {...props} ref={sliderRef}>
                    {
                        results.map((item) => <QualityResultCard key={item.batchId} data={item} />)
                    }
                </Slider>
            </div>
        </>
    )
}
const props = {
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <LeftChevronIconGrey />,
    nextArrow: <RightChevronIconGrey />
}

export default WaterQualityResults
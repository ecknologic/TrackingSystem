import axios from 'axios';
import Slider from "react-slick";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { http } from '../../../../modules/http';
import PanelHeader from '../../../../components/PanelHeader';
import QualityResultCard from '../../../../components/QualityResultCard';
import { LeftChevronIconGrey, RightChevronIconGrey } from '../../../../components/SVG_Icons';

const WaterQualityResults = () => {
    const sliderRef = useRef()
    const [results, setResults] = useState([])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getWaterTestResults()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getWaterTestResults = async () => {
        const url = `/motherPlant/getQCTestResults`

        try {
            const data = await http.GET(axios, url, config)
            setResults(data)
        } catch (error) { }
    }

    return (
        <>
            <PanelHeader title='Water Quality Testing Results' beginning hideShift />
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
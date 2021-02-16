import axios from 'axios';
import Slider from "react-slick";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import { isEmpty } from '../../../../utils/Functions';
import PanelHeader from '../../../../components/PanelHeader';
import QualityResultCard from '../../../../components/QualityResultCard';
import { getWarehoseId, TODAYDATE as d } from '../../../../utils/constants';
import { LeftChevronIconGrey, RightChevronIconGrey } from '../../../../components/SVG_Icons';
const options = { startDate: d, endDate: d, fromStart: true }

const WaterQualityResults = () => {
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
        const departmentId = getWarehoseId()
        const url = `/motherPlant/getQCTestResults?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}&departmentId=${departmentId}`

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
            <PanelHeader title='Water Quality Testing Results' onSelect={handleOperation} beginning showShow />
            <div className='panel-body quality-testing-panel'>
                {
                    !isEmpty(results) &&
                    <Slider className='dashboard-slider' {...props} >
                        {
                            results.map((item) => <QualityResultCard key={item.productionQcId} data={item} />)
                        }
                    </Slider>
                }
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
import axios from 'axios';
import Slider from "react-slick";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import { isEmpty } from '../../../../utils/Functions';
import PanelHeader from '../../../../components/PanelHeader';
import { TODAYDATE as d } from '../../../../utils/constants';
import QualityResultCard from '../../../../components/QualityResultCard';
import { LeftChevronIconGrey, RightChevronIconGrey } from '../../../../components/SVG_Icons';
import { Empty } from 'antd';
import NoContent from '../../../../components/NoContent';
const options = { startDate: d, endDate: d, fromStart: true, departmentId: 'All', shift: 'All' }

const WaterQualityResults = ({ depMenu, motherplantList }) => {
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

    const getTestResults = async ({ startDate, endDate, fromStart, departmentId, shift }) => {
        const url = `/motherPlant/getQCTestResults?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}&departmentId=${departmentId}&shiftType=${shift}`

        try {
            const data = await http.GET(axios, url, config)
            setResults(data)
        } catch (error) { }
    }

    const handleOperation = useCallback((data) => {
        let newData = {}
        newData = { ...opData, ...data }
        if (data.departmentId) {
            const departmentId = motherplantList.find(item => item.departmentName === data.departmentId).departmentId
            newData = { ...opData, departmentId }
        }
        getTestResults(newData)
        setOpData(newData)
    }, [opData, motherplantList])

    return (
        <>
            <PanelHeader title='Water Quality Testing Results' depMenu={depMenu} onSelect={handleOperation} beginning showShow showShift showDep />
            <div className='panel-body quality-testing-panel'>
                {
                    isEmpty(results) ? <NoContent content={<Empty />} />
                        : <Slider className='dashboard-slider' {...props}>
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
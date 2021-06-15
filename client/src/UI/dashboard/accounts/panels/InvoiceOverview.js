import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { http } from '../../../../modules/http';
import PanelHeader from '../../../../components/PanelHeader';
import { TODAYDATE as d } from '../../../../utils/constants';
import { defaultPie } from '../../../../assets/fixtures';
import InvoiceOverviewCard from '../../../../components/InvoiceOverviewCard';
import EmptyBottlesStockCard from '../../../../components/EmptyBottlesStockCard';
// import CustomButton from '../../../../components/CustomButton';
// import { RightChevronIconLight } from '../../../../components/SVG_Icons';
const options = { startDate: d, endDate: d, fromStart: true }

const InvoiceOverview = () => {
    const [results, setResults] = useState([])
    const [opData, setOpData] = useState(() => options)
    const [graph, setGraph] = useState(defaultPie)
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    const { product20LCount, product2LCount, product1LCount, product500MLCount, product300MLCount, product2LPercent,
        product2LCompareText, product20LPercent, product20LCompareText, product1LPercent, product1LCompareText, product500MLPercent,
        product500MLCompareText, product300MLPercent, product300MLCompareText, prevTotal, total,
        product20LPartPercent, product1LPartPercent, product2LPartPercent, product500MLPartPercent, product300MLPartPercent } = {}

    useEffect(() => {
        getTestResults(opData)

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getTestResults = async ({ startDate, endDate, fromStart }) => {
        const url = `invoice/getTotalInvoicesCount?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}`

        try {
            const data = await http.GET(axios, url, config)
            setResults(data)
            const graph = getPieData(data)
            setGraph(graph)
        } catch (error) { }
    }

    const handleOperation = useCallback((data) => {
        const newData = { ...opData, ...data }
        getTestResults(newData)
        setOpData(newData)
    }, [opData])

    return (
        <div className='total-business-panel mr-0'>
            <div className='header'>
                <PanelHeader title='Invoice Overview' onSelect={handleOperation} showShow />
            </div>
            <div className='total-revenue-card'>
                <div className='sub-panel'>
                    <EmptyBottlesStockCard isRs
                        title='20 Ltrs'
                        percent={product20LPercent}
                        partPercent={product20LPartPercent}
                        total={product20LCount}
                        strokeColor='#F7B500'
                        text={product20LCompareText}
                    />
                    <EmptyBottlesStockCard isRs
                        title='2 Ltrs'
                        percent={product2LPercent}
                        partPercent={product2LPartPercent}
                        total={product2LCount}
                        text={product2LCompareText}
                        strokeColor='#FA6400'
                    />
                </div>
                <div className='sub-panel'>
                    <EmptyBottlesStockCard isRs
                        title='1 Ltrs'
                        percent={product1LPercent}
                        partPercent={product1LPartPercent}
                        total={product1LCount}
                        strokeColor='#0091FF'
                        text={product1LCompareText}
                    />
                    <EmptyBottlesStockCard isRs
                        title='500 ml'
                        percent={product500MLPercent}
                        partPercent={product500MLPartPercent}
                        total={product500MLCount}
                        strokeColor='#41B9AD'
                        text={product500MLCompareText}
                    />
                </div>
                <div className='sub-panel'>
                    <EmptyBottlesStockCard isRs
                        title='300 ml'
                        percent={product300MLPercent}
                        partPercent={product300MLPartPercent}
                        total={product300MLCount}
                        strokeColor='#0091FF'
                        text={product300MLCompareText}
                    />
                </div>
            </div>
        </div>

    )
}

const getPieData = ({ paidCount, totalCount }) => {
    const cleared = Math.round(paidCount / (totalCount || 1) * 100)
    let pending = 100 - cleared

    if (!totalCount) pending = 0

    return [
        {
            type: 'Cleared',
            value: cleared,
        },
        {
            type: 'Pending',
            value: pending,
        }
    ]
}

export default InvoiceOverview
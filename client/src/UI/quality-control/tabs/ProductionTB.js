import axios from 'axios';
import dayjs from 'dayjs';
import { Table } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { http } from '../../../modules/http';
import Spinner from '../../../components/Spinner';
import { TODAYDATE } from '../../../utils/constants';
import DateValue from '../../../components/DateValue';
import SearchInput from '../../../components/SearchInput';
import { ScheduleIcon } from '../../../components/SVG_Icons';
import { productionTBColumns } from '../../../assets/fixtures';
import CustomDateInput from '../../../components/CustomDateInput';
import CustomPagination from '../../../components/CustomPagination';
import { disableFutureDates, doubleKeyComplexSearch, getStatusColor } from '../../../utils/Functions';
const DATEFORMAT = 'DD-MM-YYYY'
const format = 'YYYY-MM-DD'

const ProductionTB = ({ reFetch }) => {
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [filteredClone, setFilteredClone] = useState([])
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const [open, setOpen] = useState(false)
    const [TB, setTB] = useState([])
    const [TBClone, setTBClone] = useState([])
    const [resetSearch, setResetSearch] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [filterON, setFilterON] = useState(false)

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        return () => {
            http.ABORT(source)
        }
    }, [])

    useEffect(() => {
        setLoading(true)
        getTB()
    }, [reFetch])

    const getTB = async () => {
        const url = '/motherPlant/getProdQCTestedBatches'

        try {
            const data = await http.GET(axios, url, config)
            setTB(data)
            setTBClone(data)
            setTotalCount(data.length)
            setLoading(false)
        } catch (error) { }
    }

    const datePickerStatus = (status) => {
        !status && setOpen(false)
    }

    const handleDateSelect = (value) => {
        setOpen(false)
        setSelectedDate(dayjs(value).format(format))
        const filtered = TBClone.filter(item => dayjs(value).format(DATEFORMAT) === dayjs(item.dispatchedDate).format(DATEFORMAT))
        setTB(filtered)
        setTotalCount(filtered.length)
        setFilteredClone(filtered)
        setPageNumber(1)
        setFilterON(true)
        searchON && setResetSearch(!resetSearch)
    }

    const handlePageChange = (number) => {
        setPageNumber(number)
    }

    const handleSizeChange = (number, size) => {
        setPageSize(size)
        setPageNumber(number)
    }

    const handleSearch = (value) => {
        setPageNumber(1)
        if (value === "") {
            setTotalCount(TBClone.length)
            setTB(TBClone)
            setSeachON(false)
            return
        }
        const data = filterON ? filteredClone : TBClone
        const result = doubleKeyComplexSearch(data, value, 'batchId', 'managerName')
        setTotalCount(result.length)
        setTB(result)
        setSeachON(true)
    }

    const dataSource = useMemo(() => TB.map((tb) => {
        const { batchId, levels } = tb
        const level = {}

        levels.map((item) => {
            level[`level${item.qcLevel}`] = renderInputs(item)
        })

        const latestLevel = levels[levels.length - 1]
        const { testResult, managerName } = latestLevel
        const { level1 = '--', level2 = '--', level3 = '--', level4 = '--' } = level
        return {
            key: batchId,
            batchId,
            managerName,
            level1,
            level2,
            level3,
            level4,
            status: renderStatus(testResult),
        }
    }), [TB])

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <div className='stock-delivery-container'>
            <div className='header'>
                <div className='left'>
                    <DateValue date={selectedDate} />
                    <div className='app-date-picker-wrapper'>
                        <div className='date-picker' onClick={() => setOpen(true)}>
                            <ScheduleIcon />
                            <span>Select Date</span>
                        </div>
                        <CustomDateInput // Hidden in the DOM
                            open={open}
                            style={{ left: 0 }}
                            value={selectedDate}
                            className='date-panel-picker'
                            onChange={handleDateSelect}
                            onOpenChange={datePickerStatus}
                            disabledDate={disableFutureDates}
                        />
                    </div>
                </div>
                <div className='right'>
                    <SearchInput
                        placeholder='Search Batch'
                        className='delivery-search'
                        reset={resetSearch}
                        onChange={handleSearch}
                        width='50%'
                    />
                </div>
            </div>
            <div className='app-table dispatch-table'>
                <Table
                    loading={{ spinning: loading, indicator: <Spinner /> }}
                    dataSource={dataSource.slice(sliceFrom, sliceTo)}
                    columns={productionTBColumns}
                    pagination={false}
                    scroll={{ x: true }}
                />
            </div>
            {
                !!totalCount && (
                    <CustomPagination
                        total={totalCount}
                        pageSize={pageSize}
                        current={pageNumber}
                        onChange={handlePageChange}
                        pageSizeOptions={['10', '20', '30', '40', '50']}
                        onPageSizeChange={handleSizeChange}
                    />)
            }
        </div>
    )
}

const renderStatus = (status) => {
    const color = getStatusColor(status)
    return (
        <div className='status'>
            <span className='app-dot' style={{ background: color }}></span>
            <span className='status-text'>{status}</span>
        </div>
    )
}

const renderInputs = (data) => {
    const { phLevel, ozoneLevel, tds } = data

    return `PH - ${phLevel}, TDS - ${tds}, Ozone level - ${ozoneLevel}`
}

export default ProductionTB
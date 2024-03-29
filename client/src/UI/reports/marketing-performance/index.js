import axios from 'axios';
import dayjs from 'dayjs';
import { Table } from 'antd';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { http } from '../../../modules/http';
import Spinner from '../../../components/Spinner';
import { TODAYDATE } from '../../../utils/constants';
import DateValue from '../../../components/DateValue';
import Header from '../../../components/SimpleHeader';
import Worksheet from '../../../components/Worksheet';
import SearchInput from '../../../components/SearchInput';
import DateDropdown from '../../../components/DateDropdown';
import CustomButton from '../../../components/CustomButton';
import CustomDateInput from '../../../components/CustomDateInput';
import CustomPagination from '../../../components/CustomPagination';
import CustomRangeInput from '../../../components/CustomRangeInput';
import { marketingPerformanceReportColumns } from '../../../assets/fixtures';
import { doubleKeyComplexSearch, isEmpty } from '../../../utils/Functions';
const APIDATEFORMAT = 'YYYY-MM-DD'
const DATEFORMAT = 'DD/MM/YYYY'

const MarketingPerformanceReport = () => {
    const [loading, setLoading] = useState(true)
    const [filterBtnDisabled, setFilterBtnDisabled] = useState(true)
    const [clearBtnDisabled, setClearBtnDisabled] = useState(true)
    const [reports, setReports] = useState([])
    const [reportsClone, setReportsClone] = useState([])
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [startDate, setStartDate] = useState(TODAYDATE)
    const [endDate, setEndDate] = useState(TODAYDATE)
    const [selectedDate, setSelectedDate] = useState(TODAYDATE)
    const [selectedRange, setSelectedRange] = useState([])
    const [resetSearch, setResetSearch] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [dateOpen, setDateOpen] = useState(false)
    const [rangeOpen, setRangeOpen] = useState(false)
    const [excelRows, setExelRows] = useState([])

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        setLoading(true)
        getReports({ fromStart: true, startDate: TODAYDATE, endDate: TODAYDATE })

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getReports = async ({ fromStart = true, startDate, endDate }) => {
        const url = `reports/getMarketingPerformance?fromDate=${startDate}&toDate=${endDate}&fromStart=${fromStart}`

        try {
            const data = await http.GET(axios, url, config)
            setPageNumber(1)
            setLoading(false)
            setTotalCount(data.length)
            setReportsClone(data)
            setReports(data)
            searchON && setResetSearch(!resetSearch)
            generateExcelRows(data)
        } catch (error) { }
    }

    const generateExcelRows = (data) => {
        const rows = data.map((item, index, thisArray) => {
            return { ...item, sNo: thisArray.length - index }
        })

        setExelRows(rows)
    }

    const datePickerStatus = (status) => {
        !status && setDateOpen(false)
        !status && setRangeOpen(false)
    }

    const handleRangeSelect = (selected) => {
        const [from, to] = selected
        setStartDate(from.format(APIDATEFORMAT))
        setEndDate(to.format(APIDATEFORMAT))
        setRangeOpen(false)
        setSelectedRange(selected)
        setTimeout(() => setSelectedRange([]), 820)
        setPageNumber(1)
        setFilterBtnDisabled(false)
    }

    const handleDateSelect = (value) => {
        setStartDate(value.format(APIDATEFORMAT))
        setEndDate(value.format(APIDATEFORMAT))
        setDateOpen(false)
        setSelectedDate(value)
        setPageNumber(1)
        setFilterBtnDisabled(false)
    }

    const onDateOptionSelect = ({ key }) => {
        if (key === 'range') {
            setRangeOpen(true)
        }
        else setDateOpen(true)
    }

    const handleFilter = () => {
        setClearBtnDisabled(false)
        setFilterBtnDisabled(true)
        setLoading(true)
        getReports({ fromStart: false, startDate, endDate })
    }

    const handleFilterClear = async () => {
        setClearBtnDisabled(true)
        setFilterBtnDisabled(true)
        setSelectedDate(TODAYDATE)
        setStartDate(TODAYDATE)
        setEndDate(TODAYDATE)
        setLoading(true)
        await getReports({ fromStart: true, startDate: TODAYDATE, endDate: TODAYDATE })
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
            setTotalCount(reportsClone.length)
            setReports(reportsClone)
            setSeachON(false)
            return
        }
        const result = doubleKeyComplexSearch(reportsClone, value, 'executiveName')
        setTotalCount(result.length)
        setReports(result)
        setSeachON(true)
    }

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <Fragment>
            <Header title='Marketing Performance Report' />
            <div className='stock-manager-content'>

                <div className='stock-delivery-container'>
                    <div className='header'>
                        <div className='left fit'>
                            <DateValue date={startDate} to={endDate} />
                            <div className='app-date-picker-wrapper'>
                                <DateDropdown onSelect={onDateOptionSelect} />
                                <CustomButton
                                    style={{ marginLeft: '1em' }}
                                    className={`${filterBtnDisabled ? 'disabled' : ''}`}
                                    text='Apply'
                                    onClick={handleFilter}
                                />
                                <CustomButton
                                    style={{ marginLeft: '1em', marginRight: '1em' }}
                                    className={`app-cancel-btn border-btn ${clearBtnDisabled ? 'disabled' : ''}`}
                                    text='Clear'
                                    onClick={handleFilterClear}
                                />
                                <CustomRangeInput // Hidden in the DOM
                                    open={rangeOpen}
                                    value={selectedRange}
                                    style={{ left: 0 }}
                                    className='app-date-panel-picker'
                                    onChange={handleRangeSelect}
                                    onOpenChange={datePickerStatus}
                                />
                                <CustomDateInput // Hidden in the DOM
                                    open={dateOpen}
                                    value={selectedDate}
                                    style={{ left: 0 }}
                                    className='app-date-panel-picker'
                                    onChange={handleDateSelect}
                                    onOpenChange={datePickerStatus}
                                />
                            </div>
                            <Worksheet
                                fileName='Marketing Performance Report'
                                rows={excelRows}
                                columns={columns}
                                disabled={loading || isEmpty(reports)}
                            />
                        </div>
                        <div className='right more'>
                            <SearchInput
                                placeholder='Search Report'
                                className='delivery-search'
                                width='50%'
                                reset={resetSearch}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                    <div className='app-table delivery-table'>
                        <Table
                            loading={{ spinning: loading, indicator: <Spinner /> }}
                            dataSource={reports.slice(sliceFrom, sliceTo)}
                            columns={marketingPerformanceReportColumns}
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
            </div>
        </Fragment>
    )
}

const columns = [
    { label: 'S. No', value: 'sNo' },
    { label: 'Customer ID', value: 'customerNo' },
    { label: 'Customer Name', value: 'customerName' },
    { label: 'Executive Name', value: 'salesAgent' },
    { label: 'No. of Bottles Placed', value: 'quantity' },
    { label: 'Price', value: 'productPrice' },
    { label: 'Deposit', value: 'depositAmount' },
    { label: 'Dispensers Placed', value: 'dispenserCount' },
]
export default MarketingPerformanceReport
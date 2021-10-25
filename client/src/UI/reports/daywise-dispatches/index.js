import axios from 'axios';
import dayjs from 'dayjs';
import { Table } from 'antd';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { http } from '../../../modules/http';
import Spinner from '../../../components/Spinner';
import { TODAYDATE } from '../../../utils/constants';
import DateValue from '../../../components/DateValue';
import Header from '../../../components/SimpleHeader';
import Worksheet from '../../../components/Worksheet';
import SearchInput from '../../../components/SearchInput';
import SelectInput from '../../../components/SelectInput';
import DateDropdown from '../../../components/DateDropdown';
import CustomButton from '../../../components/CustomButton';
import CustomDateInput from '../../../components/CustomDateInput';
import CustomPagination from '../../../components/CustomPagination';
import CustomRangeInput from '../../../components/CustomRangeInput';
import { daywiseDispatchesReportColumns, getDepartmentOptions } from '../../../assets/fixtures';
import { doubleKeyComplexSearch, isEmpty } from '../../../utils/Functions';
const APIDATEFORMAT = 'YYYY-MM-DD'

const DaywiseDispatchesReport = () => {
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
    const [motherplantList, setMotherplantList] = useState([])
    const [resetSearch, setResetSearch] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [dateOpen, setDateOpen] = useState(false)
    const [rangeOpen, setRangeOpen] = useState(false)
    const [departmentId, setDepartmentId] = useState(null)
    const [excelRows, setExelRows] = useState([])
    let firstRow = useRef(defaultfirstRow)

    const motherplantOptions = useMemo(() => getDepartmentOptions(motherplantList), [motherplantList])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        setLoading(true)
        getMotherplantList()
        getReports({ fromStart: true, startDate: TODAYDATE, endDate: TODAYDATE, departmentId })

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getReports = async ({ fromStart = true, startDate, endDate, departmentId }) => {
        const url = `reports/getDaywiseDispatches?startDate=${startDate}&endDate=${endDate}&fromStart=${fromStart}&departmentId=${departmentId}`

        try {
            const data = await http.GET(axios, url, config)
            firstRow.current = defaultfirstRow
            setPageNumber(1)
            setLoading(false)
            setTotalCount(data.length)
            setReportsClone(data)
            setReports(data)
            searchON && setResetSearch(!resetSearch)
            generateExcelRows(data)
        } catch (error) { }
    }

    const getMotherplantList = async () => {
        const url = 'bibo/getDepartmentsList?departmentType=MotherPlant'

        try {
            const data = await http.GET(axios, url, config)
            setMotherplantList(data)
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
        getReports({ fromStart: false, startDate, endDate, departmentId })
    }

    const handleFilterClear = async () => {
        setClearBtnDisabled(true)
        setFilterBtnDisabled(true)
        setSelectedDate(TODAYDATE)
        setStartDate(TODAYDATE)
        setEndDate(TODAYDATE)
        setDepartmentId(null)
        setLoading(true)
        await getReports({ fromStart: true, startDate: TODAYDATE, endDate: TODAYDATE, departmentId })
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
        const result = doubleKeyComplexSearch(reportsClone, value, 'customerNo', 'customerName')
        setTotalCount(result.length)
        setReports(result)
        setSeachON(true)
    }

    const dataSource = useMemo(() => reports.map((item, idx) => {
        const { dispatchedDate: key, ...rest } = item
        const { product20L, product2L, product1L, product500ML, product300ML } = rest

        firstRow.current.product20L += product20L
        firstRow.current.product2L += product2L
        firstRow.current.product1L += product1L
        firstRow.current.product500ML += product500ML
        firstRow.current.product300ML += product300ML

        return {
            key: idx,
            dispatchedDate: dayjs(key).format('DD/MM/YYYY'),
            ...rest
        }
    }), [reports])

    const modifiedDataSource = dataSource.length ? [firstRow.current, ...dataSource] : []
    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <Fragment>
            <Header title='Day Wise Dispatches Report' />
            <div className='stock-manager-content'>

                <div className='stock-delivery-container'>
                    <div className='header'>
                        <div className='left fit'>
                            <DateValue date={startDate} to={endDate} />
                            <div className='app-date-picker-wrapper'>
                                <DateDropdown onSelect={onDateOptionSelect} />
                                <SelectInput
                                    style={{ marginLeft: '1em', width: '200px' }}
                                    value={departmentId}
                                    options={motherplantOptions}
                                    placeholder='Select Motherplant'
                                    onSelect={(value) => setDepartmentId(value, 'departmentId')}
                                />
                                <CustomButton
                                    style={{ marginLeft: '1em' }}
                                    className={`${filterBtnDisabled || !departmentId ? 'disabled' : ''}`}
                                    text='Apply'
                                    onClick={handleFilter}
                                />
                                <CustomButton
                                    style={{ marginLeft: '1em', marginRight: '1em' }}
                                    className={`app-cancel-btn border-btn ${clearBtnDisabled || !departmentId ? 'disabled' : ''}`}
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
                                fileName='New Customers Report'
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
                            dataSource={modifiedDataSource.slice(sliceFrom, sliceTo)}
                            columns={daywiseDispatchesReportColumns}
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

const defaultfirstRow = {
    dispatchedDate: 'Total',
    product20L: 0,
    product2L: 0,
    product1L: 0,
    product500ML: 0,
    product300ML: 0
}
export default DaywiseDispatchesReport
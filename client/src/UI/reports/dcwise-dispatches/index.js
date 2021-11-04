import dayjs from 'dayjs';
import axios from 'axios';
import { Table } from 'antd';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { http } from '../../../modules/http';
import Spinner from '../../../components/Spinner';
import { TODAYDATE } from '../../../utils/constants';
import DateValue from '../../../components/DateValue';
import Header from '../../../components/SimpleHeader';
import Worksheet from '../../../components/Worksheet';
import SearchInput from '../../../components/SearchInput';
import SelectInput from '../../../components/SelectInput';
import CustomButton from '../../../components/CustomButton';
import CustomPagination from '../../../components/CustomPagination';
import CustomRangeInput from '../../../components/CustomRangeInput';
import { getDepartmentOptions, DCwiseDispatchesReportColumns } from '../../../assets/fixtures';
import { doubleKeyComplexSearch, isEmpty } from '../../../utils/Functions';
import { ScheduleIcon } from '../../../components/SVG_Icons';
const APIDATEFORMAT = 'YYYY-MM-DD'

const DCwiseDispatchesReport = () => {
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
    const [motherplantList, setMotherplantList] = useState([])
    const [selectedRange, setSelectedRange] = useState([])
    const [resetSearch, setResetSearch] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [rangeOpen, setRangeOpen] = useState(false)
    const [departmentId, setDepartmentId] = useState(null)
    const [excelRows, setExelRows] = useState([])

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
        const url = `reports/getDispatchesByDate?fromDate=${startDate}&toDate=${endDate}&fromStart=${fromStart}&departmentId=${departmentId}`

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

    const getMotherplantList = async () => {
        const url = 'bibo/getDepartmentsList?departmentType=MotherPlant'

        try {
            const data = await http.GET(axios, url, config)
            setMotherplantList(data)
        } catch (error) { }
    }

    const generateExcelRows = (data) => {
        const rows = data.map((item) => {
            return { ...item, dispatchedDate: dayjs(item.dispatchedDate).format('DD/MM/YYYY') }
        })

        let totalProduct20L = 0;
        let totalProduct2L = 0;
        let totalProduct1L = 0;
        let totalProduct500ML = 0;
        let totalProduct300ML = 0;

        data.forEach(item => calculateTotal(item))

        function calculateTotal(item) {
            const {
                product20L,
                product2L,
                product1L,
                product500ML,
                product300ML } = item;
            totalProduct20L += product20L;
            totalProduct2L += product2L;
            totalProduct1L += product1L;
            totalProduct500ML += product500ML;
            totalProduct300ML += product300ML;
        }

        const firstRow = {
            product20L: totalProduct20L,
            product2L: totalProduct2L,
            product1L: totalProduct1L,
            product500ML: totalProduct500ML,
            product300ML: totalProduct300ML,
            DCNO: 'Total'
        }

        const finalRows = [firstRow, ...rows]

        setExelRows(finalRows)
    }

    const datePickerStatus = (status) => {
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

    const handleFilter = () => {
        setClearBtnDisabled(false)
        setFilterBtnDisabled(true)
        setLoading(true)
        getReports({ fromStart: false, startDate, endDate, departmentId })
    }

    const handleFilterClear = async () => {
        setClearBtnDisabled(true)
        setFilterBtnDisabled(true)
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

    const generateCollapsible = (reports) => {
        let collapsedRows = []
        reports.forEach((item, itemIndex) => {
            const index = collapsedRows.findIndex((obj) => obj.dispatchedDate === dayjs(item.dispatchedDate).format('DD/MM/YYYY'))
            const newItem = {
                ...item,
                dispatchedDate: dayjs(item.dispatchedDate).format('DD/MM/YYYY'),
                key: `${itemIndex}${index}`
            }

            if (index >= 0) {
                const row = collapsedRows[index]
                delete newItem.dispatchedDate
                if (row.children) {
                    row.children.push(newItem)
                }
                else row.children = [newItem]
            }
            else {
                collapsedRows.push(newItem)
            }
        })
        return collapsedRows
    }

    const dataSource = useMemo(() => ([{
        DCNO: 'Total',
        product20L: reports.map(({ product20L }) => product20L).reduce((a, c) => a + c, 0).toLocaleString('en-IN'),
        product2L: reports.map(({ product2L }) => product2L).reduce((a, c) => a + c, 0).toLocaleString('en-IN'),
        product1L: reports.map(({ product1L }) => product1L).reduce((a, c) => a + c, 0).toLocaleString('en-IN'),
        product500ML: reports.map(({ product500ML }) => product500ML).reduce((a, c) => a + c, 0).toLocaleString('en-IN'),
        product300ML: reports.map(({ product300ML }) => product300ML).reduce((a, c) => a + c, 0).toLocaleString('en-IN')
    },
    ...generateCollapsible(reports)]
    ), [reports])

    const finalDataSource = reports.length ? dataSource : []

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <Fragment>
            <Header title='DC Wise Dispatches Report' />
            <div className='stock-manager-content'>

                <div className='stock-delivery-container'>
                    <div className='header'>
                        <div className='left fit'>
                            <DateValue date={startDate} to={endDate} />
                            <div className='app-date-picker-wrapper'>
                                <div className='date-picker' onClick={() => setRangeOpen(true)}>
                                    <ScheduleIcon />
                                    <span>Select Date</span>
                                </div>
                                {
                                    clearBtnDisabled
                                    && (<SelectInput
                                        style={{ marginLeft: '1em', width: '200px' }}
                                        value={departmentId}
                                        options={motherplantOptions}
                                        placeholder='Select Motherplant'
                                        onSelect={(value) => setDepartmentId(value, 'departmentId')}
                                    />)
                                }
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
                            </div>
                            <Worksheet
                                fileName='DC Wise Report'
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
                            dataSource={finalDataSource.slice(sliceFrom, sliceTo)}
                            columns={DCwiseDispatchesReportColumns}
                            expandable={{ defaultExpandAllRows: true }}
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
    { label: 'Date', value: 'dispatchedDate' },
    { label: 'DC No.', value: 'DCNO' },
    { label: 'Party', value: 'warehouseName' },
    { label: 'Cans (20 ltr)', value: 'product20L' },
    { label: '2 Ltr Boxes (1x9)', value: 'product2L' },
    { label: '1 Ltr Boxes (1x12)', value: 'product1L' },
    { label: '500 ml Boxes (1x24)', value: 'product500ML' },
    { label: '300 ml Boxes (1x30)', value: 'product300ML' }
]

export default DCwiseDispatchesReport
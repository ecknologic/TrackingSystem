import dayjs from 'dayjs';
import axios from 'axios';
import { Table, Typography } from 'antd';
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
import { ScheduleIcon } from '../../../components/SVG_Icons';
import CustomPagination from '../../../components/CustomPagination';
import CustomRangeInput from '../../../components/CustomRangeInput';
import { doubleKeyComplexSearch, isEmpty } from '../../../utils/Functions';
import { getDepartmentOptions, ProductwiseDispatchesReportColumns, getProductOptions } from '../../../assets/fixtures';
const APIDATEFORMAT = 'YYYY-MM-DD'

const ProductwiseDispatchesReport = () => {
    const { Text } = Typography
    const [loading, setLoading] = useState(false)
    const [filterBtnDisabled, setFilterBtnDisabled] = useState(true)
    const [clearBtnDisabled, setClearBtnDisabled] = useState(true)
    const [reports, setReports] = useState([])
    const [reportsClone, setReportsClone] = useState([])
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [startDate, setStartDate] = useState(TODAYDATE)
    const [endDate, setEndDate] = useState(TODAYDATE)
    const [productList, setProductList] = useState([])
    const [motherplantList, setMotherplantList] = useState([])
    const [selectedRange, setSelectedRange] = useState([])
    const [resetSearch, setResetSearch] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [rangeOpen, setRangeOpen] = useState(false)
    const [departmentId, setDepartmentId] = useState(null)
    const [productName, setProductName] = useState(null)
    const [excelRows, setExelRows] = useState([])
    const [tableTitle, setTableTitle] = useState(null)

    const productOptions = useMemo(() => getProductOptions(productList), [productList])
    const motherplantOptions = useMemo(() => getDepartmentOptions(motherplantList), [motherplantList])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getProductList()
        getMotherplantList()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const postFetch = (data) => {
        setPageNumber(1)
        setLoading(false)
        setTotalCount(data.length)
        setReportsClone(data)
        setReports(data)
        searchON && setResetSearch(!resetSearch)
        generateExcelRows(data)
        setTableTitle(productName)
    }

    const getReports = async ({ fromStart = true, startDate, endDate, departmentId, productName }) => {
        const url = `reports/getProductionByProduct?fromDate=${startDate}&toDate=${endDate}&fromStart=${fromStart}&departmentId=${departmentId}&productName=${productName}`

        try {
            const data = await http.GET(axios, url, config)
            postFetch(data)
        } catch (error) { }
    }

    const getMotherplantList = async () => {
        const url = 'bibo/getDepartmentsList?departmentType=MotherPlant'

        try {
            const data = await http.GET(axios, url, config)
            setMotherplantList(data)
        } catch (error) { }
    }

    const getProductList = async () => {
        const url = 'products/getProducts'

        try {
            const data = await http.GET(axios, url, config)
            setProductList(data)
        } catch (error) { }
    }

    const generateExcelRows = (data) => {
        const rows = data.map((item, index, thisArray) => {
            return { ...item, sNo: thisArray.length - index }
        })

        setExelRows(rows)
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
        getReports({ fromStart: false, startDate, endDate, departmentId, productName })
    }

    const handleFilterClear = async () => {
        setClearBtnDisabled(true)
        setFilterBtnDisabled(true)
        setStartDate(TODAYDATE)
        setEndDate(TODAYDATE)
        setDepartmentId(null)
        setProductName(null)
        postFetch([])
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

    const dataSource = useMemo(() => reports.map((item) => ({ ...item, productionDate: dayjs(item.productionDate).format('DD/MM/YYYY') })), [reports])

    const finalDataSource = dataSource.length ? dataSource : []

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <Fragment>
            <Header title='Product Wise Dispatches Report' />
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
                                    clearBtnDisabled &&
                                    (<>
                                        <SelectInput
                                            style={{ marginLeft: '1em', width: '200px' }}
                                            value={departmentId}
                                            options={motherplantOptions}
                                            placeholder='Select Motherplant'
                                            onSelect={(value) => setDepartmentId(value, 'departmentId')}
                                        />
                                        <SelectInput
                                            style={{ marginLeft: '1em', marginRight: '1em', width: '150px' }}
                                            value={productName}
                                            options={productOptions}
                                            placeholder='Select Product'
                                            onSelect={(value) => setProductName(value, 'productName')}
                                        />
                                    </>)
                                }
                                <CustomButton
                                    style={{ marginLeft: '1em' }}
                                    className={`${filterBtnDisabled || !departmentId || !productName ? 'disabled' : ''}`}
                                    text='Apply'
                                    onClick={handleFilter}
                                />
                                <CustomButton
                                    style={{ marginLeft: '1em', marginRight: '1em' }}
                                    className={`app-cancel-btn border-btn ${clearBtnDisabled || !departmentId || !productName ? 'disabled' : ''}`}
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
                            dataSource={finalDataSource.slice(sliceFrom, sliceTo)}
                            columns={ProductwiseDispatchesReportColumns}
                            pagination={false}
                            scroll={{ x: true }}
                            bordered
                            title={tableTitle ? () => tableTitle : null}
                            summary={pageData => {
                                let totalOpening = 0;
                                let totalShiftA = 0;
                                let totalShiftB = 0;
                                let totalShiftC = 0;
                                let totalShifts = 0;
                                let totalDispatches = 0;

                                pageData.forEach(item => calculateTotal(item))

                                function calculateTotal(item) {
                                    const {
                                        dispatches,
                                        openingQuantity,
                                        shiftA,
                                        shiftB,
                                        shiftC,
                                        total,
                                        children } = item;
                                    totalOpening += openingQuantity;
                                    totalShiftA += shiftA;
                                    totalShiftB += shiftB;
                                    totalShiftC += shiftC;
                                    totalShifts += total;
                                    totalDispatches += dispatches;

                                    if (children) {
                                        children.forEach(item => calculateTotal(item))
                                    }
                                }

                                return (
                                    <>
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell >Total</Table.Summary.Cell>
                                            <Table.Summary.Cell>
                                                <Text>{totalOpening}</Text>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell>
                                                <Text>{totalShiftA}</Text>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell>
                                                <Text>{totalShiftB}</Text>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell>
                                                <Text>{totalShiftC}</Text>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell>
                                                <Text>{totalShifts}</Text>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell>
                                                <Text>{totalDispatches}</Text>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    </>
                                );
                            }}
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

export default ProductwiseDispatchesReport
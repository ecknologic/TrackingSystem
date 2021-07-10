import axios from 'axios';
import { Col, Empty, Row } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { http } from '../../../modules/http'
import Spinner from '../../../components/Spinner';
import MenuBar from '../../../components/MenuBar';
import useUser from '../../../utils/hooks/useUser';
import NoContent from '../../../components/NoContent';
import ClosureCard from '../../../components/ClosureCard';
import CustomPagination from '../../../components/CustomPagination';
import { doubleKeyComplexSearch, complexSort, complexDateSort, isEmpty } from '../../../utils/Functions';
import { ACCOUNTSADMIN, SUPERADMIN } from '../../../utils/constants';

const Dashboard = ({ reFetch }) => {
    const history = useHistory()
    const { ROLE } = useUser()
    const { page = 1 } = useParams()
    const [customersClone, setCustomersClone] = useState([])
    const [filteredClone, setFilteredClone] = useState([])
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [filterON, setFilterON] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [pageNumber, setPageNumber] = useState(Number(page))
    const [sortBy, setSortBy] = useState('NEW - OLD')
    const [totalCount, setTotalCount] = useState(null)

    const isAdmin = useMemo(() => ROLE === SUPERADMIN || ROLE === ACCOUNTSADMIN, [ROLE])
    const pageSizeOptions = useMemo(() => generatePageSizeOptions(), [window.innerWidth])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        return () => {
            http.ABORT(source)
        }
    }, [])

    useEffect(() => {
        setLoading(true)
        getClosedCustomers()
    }, [reFetch])

    const getClosedCustomers = async () => {
        const url = `customer/getCustomerClosingDetails`

        try {
            const data = await http.GET(axios, url, config)
            setCustomers(data)
            setCustomersClone(data)
            setTotalCount(data.length)
            setLoading(false)
        } catch (error) { }
    }

    const handleSearch = (value) => {
        setPageNumber(1)
        if (value === "") {
            setTotalCount(customersClone.length)
            setCustomers(customersClone)
            setSeachON(false)
            return
        }
        const result = doubleKeyComplexSearch(customersClone, value, 'customerName', 'contactperson')
        setTotalCount(result.length)
        setCustomers(result)
        setSeachON(true)
    }

    const onSort = (type) => {
        handleSort(type, filterON)
    }

    const handleSort = (type, filterON) => {
        const clone = [...(filterON ? filteredClone : customersClone)]

        if (type === 'Z - A') {
            complexSort(clone, 'customerName', 'desc')
        }
        else if (type === 'A - Z') {
            complexSort(clone, 'customerName')
        }
        else if (type === 'OLD - NEW') {
            complexDateSort(clone, 'registeredDate')
        }
        else {
            complexDateSort(clone, 'registeredDate', 'desc')
        }

        filterON ? setFilteredClone(clone) : setCustomersClone(clone)
        setTotalCount(clone.length)
        setCustomers(clone)
        setSortBy(type)
    }

    const onFilterChange = (data) => {
        const { status } = data
        if (isEmpty(status)) handleFilterClear()
        else handleFilter(data)
    }

    const handleFilter = (filterInfo) => {
        const { status } = filterInfo
        const filtered = customersClone.filter((item) => status.includes(item.isActive))
        setFilterON(true)
        setPageNumber(1)
        setCustomers(filtered)
        setFilteredClone(filtered)
        setTotalCount(filtered.length)
    }

    const handleFilterClear = () => {
        setPageNumber(1)
        setCustomers(customersClone)
        setTotalCount(customersClone.length)
        setFilteredClone([])
        setFilterON(false)
        handleSort(sortBy, false)
    }

    const handlePageChange = (number) => {
        setPageNumber(number)
    }

    const handleSizeChange = (number, size) => {
        setPageSize(size)
        setPageNumber(number)
    }

    const goToViewCustomer = (id) => history.push(`/closed-customers/manage/${id}`, { page: pageNumber })

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <Fragment>
            <MenuBar searchText='Search Accounts' onSearch={handleSearch} onSort={onSort} onFilter={onFilterChange} />
            <div className='employee-manager-content'>
                <Row gutter={[{ lg: 32, xl: 16 }, { lg: 16, xl: 16 }]}>
                    {
                        loading ? <NoContent content={<Spinner />} />
                            : customers.length ? customers.slice(sliceFrom, sliceTo).map((customer) => (
                                <Col lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} key={customer.closingId}>
                                    <ClosureCard
                                        data={customer}
                                        onClick={goToViewCustomer}
                                    />
                                </Col>
                            )) : <NoContent content={<Empty />} />
                    }
                </Row>
                {
                    !!totalCount && (
                        <CustomPagination
                            total={totalCount}
                            pageSize={pageSize}
                            current={pageNumber}
                            onChange={handlePageChange}
                            pageSizeOptions={pageSizeOptions}
                            onPageSizeChange={handleSizeChange}
                        />)
                }
            </div>
        </Fragment>
    )
}

const generatePageSizeOptions = () => {
    if (window.innerWidth < 1200) return ['12', '16', '20', '24', '28']
    if (window.innerWidth >= 1200) return ['12', '15', '18', '21', '24']
    if (window.innerWidth >= 1600) return ['12', '16', '20', '24', '28']
    return ['12', '15', '18', '21', '24']
}
export default Dashboard

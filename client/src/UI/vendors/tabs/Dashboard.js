import axios from 'axios';
import { Col, Empty, Row } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { http } from '../../../modules/http'
import Spinner from '../../../components/Spinner';
import MenuBar from '../../../components/MenuBar';
import useUser from '../../../utils/hooks/useUser';
import NoContent from '../../../components/NoContent';
import { SUPERADMIN } from '../../../utils/constants';
import VendorCard from '../../../components/VendorCard';
import CustomPagination from '../../../components/CustomPagination';
import { doubleKeyComplexSearch, complexSort, complexDateSort, isEmpty } from '../../../utils/Functions';

const Dashboard = ({ reFetch }) => {
    const history = useHistory()
    const { ROLE } = useUser()
    const { page = 1 } = useParams()
    const [vendorsClone, setVendorsClone] = useState([])
    const [filteredClone, setFilteredClone] = useState([])
    const [vendors, setVendors] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [filterON, setFilterON] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [pageNumber, setPageNumber] = useState(Number(page))
    const [sortBy, setSortBy] = useState('NEW - OLD')
    const [totalCount, setTotalCount] = useState(null)

    const isSuperAdmin = useMemo(() => ROLE === SUPERADMIN, [ROLE])
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
        getVendors()
    }, [reFetch])

    const getVendors = async () => {
        const url = `vendors/getvendors`

        try {
            const data = await http.GET(axios, url, config)
            setVendors(data)
            setVendorsClone(data)
            setTotalCount(data.length)
            setLoading(false)
        } catch (error) { }
    }

    const handleSearch = (value) => {
        setPageNumber(1)
        if (value === "") {
            setTotalCount(vendorsClone.length)
            setVendors(vendorsClone)
            setSeachON(false)
            return
        }
        const result = doubleKeyComplexSearch(vendorsClone, value, 'vendorName', 'contactPerson')
        setTotalCount(result.length)
        setVendors(result)
        setSeachON(true)
    }

    const onSort = (type) => {
        handleSort(type, filterON)
    }

    const handleSort = (type, filterON) => {
        const clone = [...(filterON ? filteredClone : vendorsClone)]

        if (type === 'Z - A') {
            complexSort(clone, 'vendorName', 'desc')
        }
        else if (type === 'A - Z') {
            complexSort(clone, 'vendorName')
        }
        else if (type === 'OLD - NEW') {
            complexDateSort(clone, 'createdDateTime')
        }
        else {
            complexDateSort(clone, 'createdDateTime', 'desc')
        }

        filterON ? setFilteredClone(clone) : setVendorsClone(clone)
        setTotalCount(clone.length)
        setVendors(clone)
        setSortBy(type)
    }

    const onFilterChange = (data) => {
        const { status } = data
        if (isEmpty(status)) handleFilterClear()
        else handleFilter(data)
    }

    const handleFilter = (filterInfo) => {
        const { status } = filterInfo
        const filtered = vendorsClone.filter((item) => status.includes(item.status))
        setFilterON(true)
        setPageNumber(1)
        setVendors(filtered)
        setFilteredClone(filtered)
        setTotalCount(filtered.length)
    }

    const handleFilterClear = () => {
        setPageNumber(1)
        setVendors(vendorsClone)
        setTotalCount(vendorsClone.length)
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

    const goToViewCustomer = (vendorId) => history.push(`/vendors/manage/${vendorId}`, { page: pageNumber })

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <Fragment>
            <MenuBar searchText='Search Accounts' onSearch={handleSearch} onSort={onSort} onFilter={onFilterChange} />
            <div className='employee-manager-content'>
                <Row gutter={[{ lg: 32, xl: 16 }, { lg: 16, xl: 16 }]}>
                    {
                        loading ? <NoContent content={<Spinner />} />
                            : vendors.length ? vendors.slice(sliceFrom, sliceTo).map((customer) => (
                                <Col lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} key={customer.vendorId}>
                                    <VendorCard
                                        data={customer}
                                        isSuperAdmin={isSuperAdmin}
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

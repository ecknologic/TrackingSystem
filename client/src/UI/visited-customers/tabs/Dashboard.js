import axios from 'axios';
import { Col, Empty, message, Row } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../modules/http'
import MenuBar from '../../../components/MenuBar';
import Spinner from '../../../components/Spinner';
import useUser from '../../../utils/hooks/useUser';
import NoContent from '../../../components/NoContent';
import { SUPERADMIN } from '../../../utils/constants';
import DeleteModal from '../../../components/CustomModal';
import ConfirmMessage from '../../../components/ConfirmMessage';
import VisitedCustomerCard from '../../../components/VisitedCustomerCard';
import CustomPagination from '../../../components/CustomPagination';
import { deepClone, doubleKeyComplexSearch, showToast, complexSort, complexDateSort, isEmpty } from '../../../utils/Functions';

const Dashboard = ({ reFetch }) => {
    const { ROLE, USERID } = useUser()
    const history = useHistory()
    const { page = 1 } = useParams()
    const [distributorsClone, setDistributorsClone] = useState([])
    const [filteredClone, setFilteredClone] = useState([])
    const [distributors, setDistributors] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [filterON, setFilterON] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [pageNumber, setPageNumber] = useState(Number(page))
    const [sortBy, setSortBy] = useState('NEW - OLD')
    const [totalCount, setTotalCount] = useState(null)
    const [modalDelete, setModalDelete] = useState(false)
    const [currentId, setCurrentId] = useState('')

    const isSuperAdmin = useMemo(() => ROLE === SUPERADMIN, [])
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
        getDistributors()
    }, [reFetch])

    const getDistributors = async () => {
        const url = `customer/getCustomerEnquiries/${USERID}`

        try {
            const data = await http.GET(axios, url, config)
            setDistributors(data)
            setDistributorsClone(data)
            setTotalCount(data.length)
            setLoading(false)
        } catch (error) { }
    }

    const handleSearch = (value) => {
        setPageNumber(1)
        if (value === "") {
            setTotalCount(distributorsClone.length)
            setDistributors(distributorsClone)
            setSeachON(false)
            return
        }
        const result = doubleKeyComplexSearch(distributorsClone, value, 'agencyName', 'operationalArea')
        setTotalCount(result.length)
        setDistributors(result)
        setSeachON(true)
    }

    const onSort = (type) => {
        handleSort(type, filterON)
    }

    const handleSort = (type, filterON) => {
        const clone = [...(filterON ? filteredClone : distributorsClone)]

        if (type === 'Z - A') {
            complexSort(clone, 'agencyName', 'desc')
        }
        else if (type === 'A - Z') {
            complexSort(clone, 'agencyName')
        }
        else if (type === 'OLD - NEW') {
            complexDateSort(clone, 'createdDateTime')
        }
        else {
            complexDateSort(clone, 'createdDateTime', 'desc')
        }

        filterON ? setFilteredClone(clone) : setDistributorsClone(clone)
        setTotalCount(clone.length)
        setDistributors(clone)
        setSortBy(type)
    }

    const onFilterChange = (data) => {
        const { status } = data
        if (isEmpty(status)) handleFilterClear()
        else handleFilter(data)
    }

    const handleFilter = (filterInfo) => {
        const { status } = filterInfo
        const filtered = distributorsClone.filter((item) => status.includes(item.isActive))
        setFilterON(true)
        setPageNumber(1)
        setDistributors(filtered)
        setFilteredClone(filtered)
        setTotalCount(filtered.length)
    }

    const handleFilterClear = () => {
        setPageNumber(1)
        setDistributors(distributorsClone)
        setTotalCount(distributorsClone.length)
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

    const goToManageDistributor = (id) => history.push(`/distributors/manage/${id}`, { page: pageNumber })

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <Fragment>
            <MenuBar searchText='Search Accounts' onSearch={handleSearch} onSort={onSort} onFilter={onFilterChange} />
            <div className='employee-manager-content'>
                <Row gutter={[{ lg: 32, xl: 16 }, { lg: 16, xl: 16 }]}>
                    {
                        loading ? <NoContent content={<Spinner />} />
                            : distributors.length ? distributors.slice(sliceFrom, sliceTo).map((distributor) => (
                                <Col lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} key={distributor.distributorId}>
                                    <VisitedCustomerCard
                                        data={distributor}
                                        onClick={goToManageDistributor}
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

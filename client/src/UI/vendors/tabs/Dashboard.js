import axios from 'axios';
import { Col, Empty, message, Row } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../modules/http'
import Spinner from '../../../components/Spinner';
import MenuBar from '../../../components/MenuBar';
import useUser from '../../../utils/hooks/useUser';
import NoContent from '../../../components/NoContent';
import { SUPERADMIN } from '../../../utils/constants';
import VendorCard from '../../../components/VendorCard';
import DeleteModal from '../../../components/CustomModal';
import ConfirmMessage from '../../../components/ConfirmMessage';
import useStatusFilter from '../../../utils/hooks/useStatusFilter';
import CustomPagination from '../../../components/CustomPagination';
import { doubleKeyComplexSearch, complexSort, complexDateSort, showToast, deepClone } from '../../../utils/Functions';

const Dashboard = ({ reFetch }) => {
    const history = useHistory()
    const { ROLE } = useUser()
    const { page = 1 } = useParams()
    const { status, hasFilters } = useStatusFilter()
    const [vendorsClone, setVendorsClone] = useState([])
    const [filteredClone, setFilteredClone] = useState([])
    const [vendors, setVendors] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [filterON, setFilterON] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [modalDelete, setModalDelete] = useState(false)
    const [currentId, setCurrentId] = useState('')
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

    useEffect(() => {
        if (!loading) {
            const filters = { status }
            if (!hasFilters) handleRemoveFilters()
            else handleApplyFilters(filters, vendorsClone)
        }
    }, [status])

    const getVendors = async () => {
        const url = 'vendors/getvendors'

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

    const handleMenuSelect = (key, id) => {
        if (key === 'Active') {
            handleStatusUpdate(id, 1)
        }
        else if (key === 'Inactive') {
            handleStatusUpdate(id, 0)
        }
        else if (key === 'Delete') {
            setModalDelete(true)
            setCurrentId(id)
        }
    }

    const handleStatusUpdate = async (vendorId, status) => {
        const options = { item: 'Vendor status', v1Ing: 'Updating', v2: 'updated' }
        const url = 'vendors/updateVendorStatus'
        const body = { status, vendorId }

        try {
            showToast({ ...options, action: 'loading' })
            await http.PUT(axios, url, body, config)
            optimisticApprove(vendorId, status)
            showToast(options)
        } catch (error) {
            message.destroy()
        }
    }

    const handleDelete = async (id) => {
        const options = { item: 'Vendor', v1Ing: 'Deleting', v2: 'deleted' }
        const url = `vendors/deleteVendor/${id}`

        try {
            showToast({ ...options, action: 'loading' })
            await http.DELETE(axios, url, config)
            optimisticDelete(id)
            showToast(options)
        } catch (error) {
            message.destroy()
        }
    }

    const optimisticApprove = (id, status) => {
        let clone = deepClone(vendors);
        const index = clone.findIndex(item => item.vendorId === id)
        clone[index].isActive = status;
        setVendors(clone)

        if (searchON || filterON) {
            let clone = deepClone(vendorsClone);
            const index = clone.findIndex(item => item.vendorId === id)
            clone[index].isActive = status;
            setVendorsClone(clone)
        }
        else setVendorsClone(clone)
    }

    const optimisticDelete = (id) => {
        const filtered = vendors.filter(item => item.vendorId !== id)
        setVendors(filtered)

        if (searchON || filterON) {
            const filtered = vendors.filter(item => item.vendorId !== id)
            setVendorsClone(filtered)
        }
        else setVendorsClone(filtered)
    }

    const handleApplyFilters = (filterInfo, vendors) => {
        const status = filterInfo.status.filter(item => item.checked).map(item => item.value)
        const filtered = vendors.filter((item) => status.includes(item.isActive))
        setFilterON(true)
        setPageNumber(1)
        setVendors(filtered)
        setFilteredClone(filtered)
        setTotalCount(filtered.length)
    }

    const handleRemoveFilters = () => {
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

    const handleDeleteModalOk = useCallback(() => {
        setModalDelete(false);
        handleDelete(currentId)
    }, [currentId])

    const handleDeleteModalCancel = useCallback(() => {
        setModalDelete(false)
    }, [])

    const goToViewCustomer = (vendorId) => history.push(`/vendors/manage/${vendorId}`, { page: pageNumber })

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <Fragment>
            <MenuBar searchText='Search Accounts' onSearch={handleSearch} onSort={onSort} />
            <div className='employee-manager-content'>
                <Row gutter={[{ lg: 32, xl: 16 }, { lg: 16, xl: 16 }]}>
                    {
                        loading ? <NoContent content={<Spinner />} />
                            : vendors.length ? vendors.slice(sliceFrom, sliceTo).map((customer) => (
                                <Col lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} key={customer.vendorId}>
                                    <VendorCard
                                        data={customer}
                                        isSuperAdmin={isSuperAdmin}
                                        onSelect={handleMenuSelect}
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
            <DeleteModal
                visible={modalDelete}
                onOk={handleDeleteModalOk}
                onCancel={handleDeleteModalCancel}
                title='Are you sure you want to delete?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='This action cannot be undone.' />
            </DeleteModal>
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

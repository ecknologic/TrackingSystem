import axios from 'axios';
import { Col, Empty, message, Row } from 'antd';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../modules/http'
import MenuBar from '../../../components/MenuBar';
import Spinner from '../../../components/Spinner';
import useUser from '../../../utils/hooks/useUser';
import NoContent from '../../../components/NoContent';
import DeleteModal from '../../../components/CustomModal';
import EmployeeCard from '../../../components/EmployeeCard';
import ConfirmMessage from '../../../components/ConfirmMessage';
import CustomPagination from '../../../components/CustomPagination';
import useStatusFilter from '../../../utils/hooks/useStatusFilter';
import { SUPERADMIN, WAREHOUSEADMIN } from '../../../utils/constants';
import { deepClone, doubleKeyComplexSearch, getMainPathname, showToast, complexSort, complexDateSort } from '../../../utils/Functions';

const Dashboard = ({ reFetch, isDriver }) => {
    const { ROLE } = useUser()
    const history = useHistory()
    const { page = 1 } = useParams()
    const { pathname } = useLocation()
    const { status, hasFilters } = useStatusFilter()
    const [employeesClone, setEmployeesClone] = useState([])
    const [filteredClone, setFilteredClone] = useState([])
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(Number(page))
    const [totalCount, setTotalCount] = useState(null)
    const [modalDelete, setModalDelete] = useState(false)
    const [currentId, setCurrentId] = useState('')
    const [filterON, setFilterON] = useState(false)
    const [searchON, setSeachON] = useState(false)
    const [sortBy, setSortBy] = useState('NEW - OLD')
    const mainUrl = useMemo(() => getMainPathname(pathname), [pathname])
    const isSuperAdmin = useMemo(() => ROLE === SUPERADMIN, [])
    const isWHAdmin = useMemo(() => ROLE === WAREHOUSEADMIN, [ROLE])
    const [employeeType] = useState(() => getEmployeeType(isDriver))
    const pageSizeOptions = useMemo(() => generatePageSizeOptions(), [window.innerWidth])
    const idKey = useMemo(() => getKey(isDriver), [])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        return () => {
            http.ABORT(source)
        }
    }, [])

    useEffect(() => {
        setLoading(true)
        getEmployees()
    }, [reFetch])

    useEffect(() => {
        if (!loading) {
            const filters = { status }
            if (!hasFilters) handleRemoveFilters()
            else handleApplyFilters(filters, employeesClone)
        }
    }, [status])

    const getEmployees = async () => {
        const url = getUrl(isDriver, isWHAdmin)

        try {
            const data = await http.GET(axios, url, config)
            setEmployees(data)
            setEmployeesClone(data)
            setTotalCount(data.length)
            setLoading(false)
        } catch (error) { }
    }

    const handlePageChange = (number) => {
        setPageNumber(number)
    }

    const handleSizeChange = (number, size) => {
        setPageSize(size)
        setPageNumber(number)
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

    const handleStatusUpdate = async (id, status) => {
        const options = { item: `${employeeType} status`, v1Ing: 'Updating', v2: 'updated' }
        const url = statusUrl(isDriver)
        const body = { status, [idKey]: id }
        try {
            showToast({ ...options, action: 'loading' })
            await http.PUT(axios, url, body, config)
            optimisticApprove(id, status)
            showToast(options)
        } catch (error) {
            message.destroy()
        }
    }

    const handleDelete = async (id) => {
        const options = { item: employeeType, v1Ing: 'Deleting', v2: 'deleted' }
        const url = deleteUrl(isDriver, id)

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
        let clone = deepClone(employees);
        const index = clone.findIndex(item => item[idKey] === id)
        clone[index].isActive = status;
        setEmployees(clone)

        if (searchON || filterON) {
            let clone = deepClone(employeesClone);
            const index = clone.findIndex(item => item[idKey] === id)
            clone[index].isActive = status;
            setEmployeesClone(clone)
        }
        else setEmployeesClone(clone)

    }

    const handleSearch = (value) => {
        setPageNumber(1)
        if (value === "") {
            setTotalCount(employeesClone.length)
            setEmployees(employeesClone)
            setSeachON(false)
            return
        }
        const result = doubleKeyComplexSearch(employeesClone, value, 'userName', 'departmentName')
        setTotalCount(result.length)
        setEmployees(result)
        setSeachON(true)
    }

    const onSort = (type) => {
        handleSort(type, filterON)
    }

    const handleSort = (type, filterON) => {
        const clone = [...(filterON ? filteredClone : employeesClone)]

        if (type === 'Z - A') {
            complexSort(clone, 'userName', 'desc')
        }
        else if (type === 'A - Z') {
            complexSort(clone, 'userName')
        }
        else if (type === 'OLD - NEW') {
            complexDateSort(clone, 'createdDateTime')
        }
        else {
            complexDateSort(clone, 'createdDateTime', 'desc')
        }

        filterON ? setFilteredClone(clone) : setEmployeesClone(clone)
        setTotalCount(clone.length)
        setEmployees(clone)
        setSortBy(type)
    }

    const handleRemoveFilters = () => {
        setPageNumber(1)
        setEmployees(employeesClone)
        setTotalCount(employeesClone.length)
        setFilteredClone([])
        setFilterON(false)
        handleSort(sortBy, false)
    }

    const handleApplyFilters = (filterInfo, employees) => {
        const status = filterInfo.status.filter(item => item.checked).map(item => item.value)
        const filtered = employees.filter((item) => status.includes(item.isActive))
        setFilterON(true)
        setPageNumber(1)
        setEmployees(filtered)
        setFilteredClone(filtered)
        setTotalCount(filtered.length)
    }

    const optimisticDelete = (id) => {
        const filtered = employees.filter(item => item[idKey] !== id)
        setEmployees(filtered)

        if (searchON || filterON) {
            const filtered = employeesClone.filter(item => item[idKey] !== id)
            setEmployeesClone(filtered)
        }
        else setEmployeesClone(filtered)
    }

    const handleDeleteModalOk = useCallback(() => {
        setModalDelete(false);
        handleDelete(currentId)
    }, [currentId])

    const handleDeleteModalCancel = useCallback(() => {
        setModalDelete(false)
    }, [])

    const goToManageEmployee = (id) => history.push(`${mainUrl}/manage/${id}`, { page: pageNumber })

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <Fragment>
            <MenuBar searchText={`Search ${isWHAdmin ? 'Staff' : employeeType}`} onSearch={handleSearch} onSort={onSort} />
            <div className='employee-manager-content'>
                <Row gutter={[{ lg: 32, xl: 16 }, { lg: 16, xl: 16 }]}>
                    {
                        loading ? <NoContent content={<Spinner />} />
                            : employees.length ? employees.slice(sliceFrom, sliceTo).map((employee) => (
                                <Col lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} key={employee[idKey]}>
                                    <EmployeeCard
                                        data={employee}
                                        isDriver={isDriver}
                                        isSuperAdmin={isSuperAdmin}
                                        onSelect={handleMenuSelect}
                                        onClick={goToManageEmployee}
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

const getUrl = (isDriver, isWHAdmin) => {
    const staffUrl = 'users/getUsers'
    let driverUrl = 'driver/getDrivers'

    if (isWHAdmin) {
        driverUrl = 'warehouse/getDepartmentStaff'
    }

    if (isDriver) return driverUrl
    return staffUrl
}

const deleteUrl = (isDriver, id) => {
    const staffUrl = `users/deleteWebUser/${id}`
    const driverUrl = `driver/deleteDriver/${id}`

    if (isDriver) return driverUrl
    return staffUrl
}

const statusUrl = (isDriver) => {
    const staffUrl = `users/updateUserStatus`
    const driverUrl = `driver/updateDriverStatus`

    if (isDriver) return driverUrl
    return staffUrl
}

const getKey = (isDriver) => {
    const type = isDriver ? 'driverId' : 'userId'
    return type
}

const getEmployeeType = (isDriver) => {
    const type = isDriver ? 'Driver' : 'Staff'
    return type
}

const generatePageSizeOptions = () => {
    if (window.innerWidth < 1200) return ['12', '16', '20', '24', '28']
    if (window.innerWidth >= 1200) return ['12', '15', '18', '21', '24']
    if (window.innerWidth >= 1600) return ['12', '16', '20', '24', '28']
    return ['12', '15', '18', '21', '24']
}
export default Dashboard

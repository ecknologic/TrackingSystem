import axios from 'axios';
import { Col, Empty, message, Row } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../modules/http'
import Spinner from '../../../components/Spinner';
import NoContent from '../../../components/NoContent';
import DeleteModal from '../../../components/CustomModal';
import EmployeeCard from '../../../components/EmployeeCard';
import { getRole, SUPERADMIN } from '../../../utils/constants';
import ConfirmMessage from '../../../components/ConfirmMessage';
import CustomPagination from '../../../components/CustomPagination';
import { deepClone, getMainPathname, showToast } from '../../../utils/Functions';

const Dashboard = ({ reFetch, isDriver }) => {
    const history = useHistory()
    const { pathname } = useLocation()
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(1)
    const [totalCount, setTotalCount] = useState(null)
    const [modalDelete, setModalDelete] = useState(false)
    const [currentId, setCurrentId] = useState('')

    const mainUrl = useMemo(() => getMainPathname(pathname), [pathname])
    const isSuperAdmin = useMemo(() => getRole() === SUPERADMIN, [])
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

    const getEmployees = async () => {
        const url = getUrl(isDriver)

        try {
            const data = await http.GET(axios, url, config)
            setEmployees(data)
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
    }

    const optimisticDelete = (id) => {
        const filtered = employees.filter(item => item[idKey] !== id)
        setEmployees(filtered)
    }

    const handleDeleteModalOk = useCallback(() => {
        setModalDelete(false);
        handleDelete(currentId)
    }, [currentId])

    const handleDeleteModalCancel = useCallback(() => {
        setModalDelete(false)
    }, [])

    const goToManageEmployee = (id) => history.push(`${mainUrl}/manage/${id}`)

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <Fragment>
            <div className='plant-manager-content'>
                <Row gutter={[{ lg: 32, xl: 16 }, { lg: 32, xl: 32 }]}>
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

const getUrl = (isDriver) => {
    const staffUrl = '/users/getUsers'
    const driverUrl = '/driver/getDrivers'

    if (isDriver) return driverUrl
    return staffUrl
}

const deleteUrl = (isDriver, id) => {
    const staffUrl = `/users/deleteWebUser/${id}`
    const driverUrl = `/driver/deleteDriver/${id}`

    if (isDriver) return driverUrl
    return staffUrl
}

const statusUrl = (isDriver) => {
    const staffUrl = `/users/updateUserStatus`
    const driverUrl = `/driver/updateDriverStatus`

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

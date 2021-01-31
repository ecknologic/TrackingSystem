import { Col, message, Row } from 'antd';
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
import { getMainPathname, showToast } from '../../../utils/Functions';

const Dashboard = ({ reFetch }) => {
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
    const [employeeType] = useState(() => getEmployeeType(mainUrl))
    const pageSizeOptions = useMemo(() => generatePageSizeOptions(), [window.innerWidth])
    const idKey = useMemo(() => getKey(mainUrl), [])
    const isDriver = employeeType === 'Driver'

    useEffect(() => {
        setLoading(true)
        getEmployees()
    }, [reFetch])

    const getEmployees = async () => {
        const url = getUrl(mainUrl)

        const data = await http.GET(url)
        setEmployees(data)
        setTotalCount(data.length)
        setLoading(false)
    }

    const handlePageChange = (number) => {
        setPageNumber(number)
    }

    const handleSizeChange = (number, size) => {
        setPageSize(size)
        setPageNumber(number)
    }

    const handleMenuSelect = (key, id) => {
        if (key === 'Delete') {
            setModalDelete(true)
            setCurrentId(id)
        }
    }

    const handleDelete = async (id) => {
        const options = { item: employeeType, v1Ing: 'Deleting', v2: 'deleted' }
        const url = deleteUrl(mainUrl, id)

        try {
            showToast({ ...options, action: 'loading' })
            await http.DELETE(url)
            optimisticDelete(id)
            showToast(options)
        } catch (error) {
            message.destroy()
        }
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
                            )) : <NoContent content={`No ${employeeType}s to show`} />
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

const getUrl = (url) => {
    const staffUrl = '/users/getUsers'
    const driverUrl = '/driver/getDrivers'

    if (url === '/staff') return staffUrl
    return driverUrl
}

const deleteUrl = (url, id) => {
    const staffUrl = `/users/deleteWebUser/${id}`
    const driverUrl = `/driver/deleteDriver/${id}`

    if (url === '/staff') return staffUrl
    return driverUrl
}

const getKey = (url) => {
    const type = url === '/staff' ? 'userId' : 'driverId'
    return type
}

const getEmployeeType = (url) => {
    const type = url === '/staff' ? 'Staff' : 'Driver'
    return type
}

const generatePageSizeOptions = () => {
    if (window.innerWidth < 1200) return ['12', '16', '20', '24', '28']
    if (window.innerWidth >= 1200) return ['12', '15', '18', '21', '24']
    if (window.innerWidth >= 1600) return ['12', '16', '20', '24', '28']
    return ['12', '15', '18', '21', '24']
}
export default Dashboard

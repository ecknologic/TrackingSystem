import { Col, Row } from 'antd';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http'
import Spinner from '../../../../components/Spinner';
import NoContent from '../../../../components/NoContent';
import EmployeeCard from '../../../../components/EmployeeCard';
import CustomPagination from '../../../../components/CustomPagination';

const Staff = () => {
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(1)
    const [totalCount, setTotalCount] = useState(null)

    const pageSizeOptions = useMemo(() => generatePageSizeOptions(), [window.innerWidth])

    useEffect(() => {
        getEmployees()
    }, [])

    const getEmployees = async () => {
        const url = '/driver/getDrivers'

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

    const goToManageEmployee = (id) => {
        // history.push(`drivers/manage/${id}`)
    }
    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <Fragment>
            <div className='stock-staff-container'>
                <Row gutter={[{ lg: 32, xl: 16 }, { lg: 32, xl: 32 }]}>
                    {
                        loading ? <NoContent content={<Spinner />} />
                            : employees.length ? employees.slice(sliceFrom, sliceTo).map((employee) => (
                                <Col lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} key={employee.driverId}>
                                    <EmployeeCard
                                        isDriver
                                        data={employee}
                                        onClick={goToManageEmployee}
                                    />
                                </Col>
                            )) : <NoContent content='No Staff to show' />
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
export default Staff

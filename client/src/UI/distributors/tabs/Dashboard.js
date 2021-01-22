import { Col, Row } from 'antd';
import { useHistory } from 'react-router-dom';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { http } from '../../../modules/http'
import Spinner from '../../../components/Spinner';
import NoContent from '../../../components/NoContent';
import DistributorCard from '../../../components/DistributorCard';
import CustomPagination from '../../../components/CustomPagination';

const Dashboard = ({ reFetch }) => {
    const history = useHistory()
    const [distributors, setDistributors] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(1)
    const [totalCount, setTotalCount] = useState(null)

    const pageSizeOptions = useMemo(() => generatePageSizeOptions(), [window.innerWidth])

    useEffect(() => {
        setLoading(true)
        getDistributors()
    }, [reFetch])

    const getDistributors = async () => {
        const url = '/distributor/getDistributors'

        const data = await http.GET(url)
        setDistributors(data)
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

    const goToManageDistributor = (id) => history.push(`/distributors/manage/${id}`)

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <Fragment>
            <div className='plant-manager-content'>
                <Row gutter={[{ lg: 32, xl: 16 }, { lg: 32, xl: 32 }]}>
                    {
                        loading ? <NoContent content={<Spinner />} />
                            : distributors.length ? distributors.slice(sliceFrom, sliceTo).map((distributor) => (
                                <Col lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} key={distributor.distributorId}>
                                    <DistributorCard data={distributor} onClick={() => goToManageDistributor(distributor.distributorId)} />
                                </Col>
                            )) : <NoContent content={`No Distributors to show`} />
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

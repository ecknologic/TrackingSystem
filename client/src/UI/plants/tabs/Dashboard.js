import { Col, Row } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { http } from '../../../modules/http'
import Spinner from '../../../components/Spinner';
import NoContent from '../../../components/NoContent';
import MotherplantCard from '../../../components/PlantCard';
import CustomPagination from '../../../components/CustomPagination';
import { getMainPathname } from '../../../utils/Functions';

const Dashboard = () => {
    const history = useHistory()
    const { pathname } = useLocation()
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(1)
    const [totalCount, setTotalCount] = useState(null)

    const mainUrl = useMemo(() => getMainPathname(pathname), [pathname])
    const pageSizeOptions = useMemo(() => generatePageSizeOptions(), [window.innerWidth])

    useEffect(() => {
        getAccounts()
    }, [])

    const getAccounts = async () => {
        const plantType = getPlantType()
        const url = `${mainUrl.slice(0, -1)}/get${plantType}List`

        const data = await http.GET(url)
        setAccounts(data)
        setTotalCount(data.length)
        setLoading(false)
    }

    const getPlantType = () => {
        return mainUrl === '/warehouses' ? 'Warehouse' : 'MotherPlant'
    }

    const handlePageChange = (number) => {
        setPageNumber(number)
    }

    const handleSizeChange = (number, size) => {
        setPageSize(size)
        setPageNumber(number)
    }

    const goToViewAccount = (id) => history.push(`/manage-accounts/${id}`)

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <Fragment>
            <div className='plantmanager-content'>
                <Row gutter={[{ lg: 32, xl: 16 }, { lg: 32, xl: 32 }]}>
                    {
                        loading ? <NoContent content={<Spinner />} />
                            : accounts.length ? accounts.slice(sliceFrom, sliceTo).map((account) => (
                                <Col lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} key={account.customerId}>
                                    <MotherplantCard data={account} onClick={() => goToViewAccount(account.customerId)} />
                                </Col>
                            )) : <NoContent content='No accounts to show' />
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

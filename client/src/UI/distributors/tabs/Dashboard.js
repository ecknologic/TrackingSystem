import { Col, message, Row } from 'antd';
import { useHistory } from 'react-router-dom';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { http } from '../../../modules/http'
import Spinner from '../../../components/Spinner';
import NoContent from '../../../components/NoContent';
import DeleteModal from '../../../components/CustomModal';
import { getRole, SUPERADMIN } from '../../../utils/constants';
import { deepClone, showToast } from '../../../utils/Functions';
import ConfirmMessage from '../../../components/ConfirmMessage';
import DistributorCard from '../../../components/DistributorCard';
import CustomPagination from '../../../components/CustomPagination';

const Dashboard = ({ reFetch }) => {
    const history = useHistory()
    const [distributors, setDistributors] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(1)
    const [totalCount, setTotalCount] = useState(null)
    const [modalDelete, setModalDelete] = useState(false)
    const [currentId, setCurrentId] = useState('')

    const isSuperAdmin = useMemo(() => getRole() === SUPERADMIN, [])
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

    const handleStatusUpdate = async (distributorId, status) => {
        const options = { item: 'Distributor status', v1Ing: 'Updating', v2: 'updated' }
        const url = `/distributor/updateDistributorStatus`
        const body = { status, distributorId }

        try {
            showToast({ ...options, action: 'loading' })
            await http.PUT(url, body)
            optimisticApprove(distributorId, status)
            showToast(options)
        } catch (error) {
            message.destroy()
        }
    }

    const handleDelete = async (id) => {
        const options = { item: 'Distributor', v1Ing: 'Deleting', v2: 'deleted' }
        const url = `/distributor/deleteDistributor/${id}`

        try {
            showToast({ ...options, action: 'loading' })
            await http.DELETE(url)
            optimisticDelete(id)
            showToast(options)
        } catch (error) {
            message.destroy()
        }
    }

    const optimisticApprove = (id, status) => {
        let clone = deepClone(distributors);
        const index = clone.findIndex(item => item.distributorId === id)
        clone[index].isActive = status;
        setDistributors(clone)
    }

    const optimisticDelete = (id) => {
        const filtered = distributors.filter(item => item.distributorId !== id)
        setDistributors(filtered)
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
                                    <DistributorCard
                                        data={distributor}
                                        isSuperAdmin={isSuperAdmin}
                                        onClick={goToManageDistributor}
                                        onSelect={handleMenuSelect}
                                    />
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

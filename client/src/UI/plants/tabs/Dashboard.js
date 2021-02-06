import axios from 'axios';
import { Col, message, Row } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import React, { Fragment, useEffect, useMemo, useState, useCallback } from 'react';
import { http } from '../../../modules/http'
import Spinner from '../../../components/Spinner';
import NoContent from '../../../components/NoContent';
import PlantCard from '../../../components/PlantCard';
import DeleteModal from '../../../components/CustomModal';
import { getRole, SUPERADMIN } from '../../../utils/constants';
import ConfirmMessage from '../../../components/ConfirmMessage';
import CustomPagination from '../../../components/CustomPagination';
import { deepClone, getMainPathname, showToast } from '../../../utils/Functions';

const Dashboard = ({ reFetch }) => {
    const history = useHistory()
    const { pathname } = useLocation()
    const [plants, setPlants] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(1)
    const [totalCount, setTotalCount] = useState(null)
    const [plantType, setPlantType] = useState('')
    const [modalDelete, setModalDelete] = useState(false)
    const [currentId, setCurrentId] = useState('')

    const mainUrl = useMemo(() => getMainPathname(pathname), [pathname])
    const isSuperAdmin = useMemo(() => getRole() === SUPERADMIN, [])
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
        const type = getPlantType()
        getPlants(type)
    }, [reFetch])

    const getPlants = async (plantType) => {
        const url = `${mainUrl.slice(0, -1)}/get${plantType}List`

        try {
            const data = await http.GET(axios, url, config)
            setPlants(data)
            setTotalCount(data.length)
            setLoading(false)
        } catch (error) { }
    }

    const getPlantType = () => {
        const type = mainUrl === '/warehouses' ? 'Warehouse' : 'MotherPlant'
        setPlantType(type)
        return type
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

    const handleStatusUpdate = async (departmentId, status) => {
        const options = { item: 'Department status', v1Ing: 'Updating', v2: 'updated' }
        const url = `/warehouse/updateDepartmentStatus`
        const body = { status, departmentId }
        try {
            showToast({ ...options, action: 'loading' })
            await http.PUT(axios, url, body, config)
            optimisticApprove(departmentId, status)
            showToast(options)
        } catch (error) {
            message.destroy()
        }
    }

    const handleDelete = async (id) => {
        const options = { item: 'Department', v1Ing: 'Deleting', v2: 'deleted' }
        const url = `/warehouse/deleteDepartment/${id}`

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
        let clone = deepClone(plants);
        const index = clone.findIndex(item => item.departmentId === id)
        clone[index].isApproved = status;
        setPlants(clone)
    }

    const optimisticDelete = (id) => {
        const filtered = plants.filter(item => item.departmentId !== id)
        setPlants(filtered)
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
                            : plants.length ? plants.slice(sliceFrom, sliceTo).map((plant) => (
                                <Col lg={{ span: 12 }} xl={{ span: 8 }} xxl={{ span: 6 }} key={plant.departmentId}>
                                    <PlantCard
                                        data={plant}
                                        isSuperAdmin={isSuperAdmin}
                                        onSelect={handleMenuSelect}
                                        onClick={goToManageEmployee}
                                    />
                                </Col>
                            )) : <NoContent content={`No ${plantType}s to show`} />
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

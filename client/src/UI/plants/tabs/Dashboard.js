import { Col, message, Row } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { http } from '../../../modules/http'
import Spinner from '../../../components/Spinner';
import NoContent from '../../../components/NoContent';
import PlantCard from '../../../components/PlantCard';
import { getRole, SUPERADMIN } from '../../../utils/constants';
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

    const mainUrl = useMemo(() => getMainPathname(pathname), [pathname])
    const isSuperAdmin = useMemo(() => getRole() === SUPERADMIN, [])
    const pageSizeOptions = useMemo(() => generatePageSizeOptions(), [window.innerWidth])

    useEffect(() => {
        setLoading(true)
        const type = getPlantType()
        getPlants(type)
    }, [reFetch])

    const getPlants = async (plantType) => {
        const url = `${mainUrl.slice(0, -1)}/get${plantType}List`

        const data = await http.GET(url)
        setPlants(data)
        setTotalCount(data.length)
        setLoading(false)
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
            handlePlantStatusUpdate(id, 1)
        }
        else if (key === 'Inactive') {
            handlePlantStatusUpdate(id, 0)
        }
        else if (key === 'Delete') {
            handlePlantDelete(id)
        }
    }

    const handlePlantStatusUpdate = async (departmentId, status) => {
        const options = { item: 'Department status', v1Ing: 'Updating', v2: 'updated' }
        const url = `/warehouse/updateDepartmentStatus`
        const body = { status, departmentId }
        try {
            showToast({ ...options, action: 'loading' })
            await http.PUT(url, body)
            optimisticApprove(departmentId, status)
            showToast(options)
        } catch (error) {
            message.destroy()
        }
    }

    const handlePlantDelete = async (id) => {
        const options = { item: 'Department', v1Ing: 'Deleting', v2: 'deleted' }
        const url = `/warehouse/deleteDepartment/${id}`

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
        let clone = deepClone(plants);
        const index = clone.findIndex(item => item.departmentId === id)
        clone[index].isApproved = status;
        setPlants(clone)
    }

    const optimisticDelete = (id) => {
        const filtered = plants.filter(item => item.departmentId !== id)
        setPlants(filtered)
    }

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

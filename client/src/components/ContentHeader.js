import React, { useEffect, useState } from 'react';
import Spinner from './Spinner';
import { http } from '../modules/http';

const MotherPlantHeader = () => {

    const [loading, setLoading] = useState(true)
    const [title, setTitle] = useState('')
    const [address, setAddress] = useState('')

    useEffect(() => {
        getMotherPlantInfo()
    }, [])

    const getMotherPlantInfo = async () => {
        const url = `/warehouse/getWarehouseDetails/2`
        const { data: { departmentName, address } } = await http.GET(url)
        setLoading(false)
        setTitle(departmentName)
        setAddress(address)
    }

    return (
        <div className='stock-header'>
            {
                loading ? <Spinner />
                    : (
                        <div className='heading-container'>
                            <div className='titles-container'>
                                <span className='title'>{title}</span>
                                <span className='address'>{address}</span>
                            </div>
                        </div>
                    )
            }
        </div>
    )

}

export default MotherPlantHeader
import React, { useEffect, useMemo, useState } from 'react';
import { http } from '../../../modules/http';
import SelectInput from '../../../components/SelectInput';
import { getRouteOptions } from '../../../assets/fixtures';
import CustomButton from '../../../components/CustomButton';
import SearchInput from '../../../components/SearchInput';
import { PlusIcon, LinesIconGrey } from '../../../components/SVG_Icons';


const Delivery = () => {

    const [routes, setRoutes] = useState([])
    const routeOptions = useMemo(() => getRouteOptions(routes), [routes])

    useEffect(() => {
        getRoutes()
    }, [])

    const getRoutes = async () => {
        const data = await http.GET('/warehouse/getroutes')
        setRoutes(data)
    }

    const handleRouteSelect = () => {

    }
    const handleRouteDeselect = () => {

    }

    return (
        <div className='stock-delivery-container'>
            <div className='header'>
                <div className='left'>
                    <SelectInput
                        mode='multiple'
                        placeholder='Select Routes'
                        className='filter-select'
                        suffixIcon={<LinesIconGrey />}
                        value={[]} options={routeOptions}
                        onSelect={handleRouteSelect}
                        onDeselect={handleRouteDeselect}
                    />
                    <CustomButton text='Create New DC' className='app-add-new-btn' icon={<PlusIcon />} />
                </div>
                <div className='right'>
                    <SearchInput
                        placeholder='Search Delivery Challan'
                        className='delivery-search'
                        onSearch={() => { }}
                        width='300px'
                        onChange={() => { }}
                    />
                </div>
            </div>
        </div>
    )
}

export default Delivery
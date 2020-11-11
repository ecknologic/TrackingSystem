import React, { useEffect, useState } from 'react'
import { getAPI } from '../utils/apis'
import { getWarehoseId } from '../utils/constants'


const WareHouseinfo = () => {
    const WAREHOUSEID = getWarehoseId()
    const [warehouseDetails, setWarehouseDetails] = useState({})
    useEffect(() => {
        getAPI('/warehouse/getWarehouseDetails/' + WAREHOUSEID).then(res => {
            if (res.data) setWarehouseDetails(res.data)
        })
    }, [])
    return (
        <div className="warehouuseinfo_comp">
            <h3>{warehouseDetails.DepartmentName}</h3>
            <p>{warehouseDetails.Address}</p>
        </div>
    )
}

export default WareHouseinfo;
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import { isEmpty } from '../../../../utils/Functions';
import CustomPlaceholder from '../../../../components/CustomPlaceholder';
import RawMaterialStockCard from '../../../../components/RawMaterialStockCard';

const RawMaterialStock = () => {
    const [RMStock, setRMStock] = useState([])
    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getRMStock()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getRMStock = async () => {
        const url = `/motherPlant/getRMTotalCount`

        try {
            const data = await http.GET(axios, url, config)
            setRMStock(data)
        } catch (error) { }
    }

    return (
        <div className='raw-material-panel'>
            <div className='panel-header'>
                <div className='head-container'>
                    <div className='title'>
                        Raw Material Stock Details
                    </div>
                </div>
            </div>
            <div className='panel-body'>
                {
                    isEmpty(RMStock) ? <CustomPlaceholder />
                        : <RawMaterialStockCard data={RMStock} />
                }
            </div>
        </div>
    )
}

export default RawMaterialStock
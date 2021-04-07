import axios from 'axios';
import { Empty } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import { isEmpty } from '../../../../utils/Functions';
import NoContent from '../../../../components/NoContent';
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
        const url = `motherPlant/getRMTotalCount`

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
                    isEmpty(RMStock) ? <NoContent content={<Empty />} />
                        : <RawMaterialStockCard data={RMStock} />
                }
            </div>
        </div>
    )
}

export default RawMaterialStock
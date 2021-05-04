import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import ActivityLog from '../../../../components/ActivityLog';
import CustomPagination from '../../../../components/CustomPagination';
import { http } from '../../../../modules/http';

const ActivityLogDetails = () => {
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(1)
    const [totalCount, setTotalCount] = useState(null)

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getLogs()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getLogs = () => {
        // const url = `invoice/getCustomerInvoices/${accountId}`

        try {
            // const data = await http.GET(axios, url, config)
            // setInvoices(data)
            setTotalCount(100)
            // setLoading(false)
        } catch (error) { }
    }

    const handlePageChange = (number) => {
        setPageNumber(number)
    }

    const handleSizeChange = (number, size) => {
        setPageSize(size)
        setPageNumber(number)
    }

    const sliceFrom = (pageNumber - 1) * pageSize
    const sliceTo = sliceFrom + pageSize

    return (
        <div className='stock-delivery-container'>
            {
                [...Array(totalCount)].slice(sliceFrom, sliceTo).map(() => <ActivityLog text='Motherplant Created by Super Admin <b>(Sukesh Pasupuleti)</b>' />)
            }
            {
                !!totalCount && (
                    <CustomPagination
                        total={totalCount}
                        pageSize={pageSize}
                        current={pageNumber}
                        onChange={handlePageChange}
                        pageSizeOptions={['10', '20', '30', '40', '50']}
                        onPageSizeChange={handleSizeChange}
                    />)
            }
        </div>
    )
}

export default ActivityLogDetails
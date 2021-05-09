import axios from 'axios';
import { Empty } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { http } from '../modules/http';
import Spinner from '../components/Spinner';
import NoContent from '../components/NoContent';
import ActivityLog from '../components/ActivityLog';
import CustomPagination from '../components/CustomPagination';

const ActivityLogDetails = ({ id, type, reFetch }) => {
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(1)
    const [loading, setLoading] = useState(true)
    const [totalCount, setTotalCount] = useState(null)
    const [logs, setLogs] = useState([])

    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        return () => {
            http.ABORT(source)
        }
    }, [])

    useEffect(() => {
        getLogs()
    }, [reFetch])

    const getLogs = async () => {
        const url = `logs/getAuditLogs?type=${type}&id=${id}`

        try {
            const data = await http.GET(axios, url, config)
            setLogs(data)
            setTotalCount(data.length)
            setLoading(false)
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
                loading ? <NoContent content={<Spinner />} />
                    : logs.length ? logs.slice(sliceFrom, sliceTo).map((log) => <ActivityLog key={log.auditId} data={log} />)
                        : <NoContent content={<Empty />} />
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
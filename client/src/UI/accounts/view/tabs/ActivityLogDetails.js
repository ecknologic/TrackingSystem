import axios from 'axios';
import { useParams } from 'react-router';
import React, { useEffect, useMemo, useState } from 'react';
import { http } from '../../../../modules/http';
import ActivityLog from '../../../../components/ActivityLog';
import CustomPagination from '../../../../components/CustomPagination';

const ActivityLogDetails = () => {
    const { accountId } = useParams()
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(1)
    const [totalCount, setTotalCount] = useState(null)
    const [logs, setLogs] = useState([])


    const source = useMemo(() => axios.CancelToken.source(), []);
    const config = { cancelToken: source.token }

    useEffect(() => {
        getLogs()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getLogs = async () => {
        const url = `logs/getAuditLogs?type=customer&id=${accountId}`

        try {
            const data = await http.GET(axios, url, config)
            setLogs(data)
            setTotalCount(data.length)
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
                logs.slice(sliceFrom, sliceTo).map((log, index) => <ActivityLog key={index} data={log} />)
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
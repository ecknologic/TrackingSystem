import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import useUser from '../utils/hooks/useUser';
import { getMainPathname } from '../utils/Functions';
import useDepartment from '../utils/hooks/useDepartment';
import '../sass/contentHeader.scss'

const ContentHeader = () => {
    const { pathname } = useLocation()
    const { USERNAME, getDesignation } = useUser()
    const { departmentName: title, address } = useDepartment()

    const mainUrl = useMemo(() => getMainPathname(pathname), [pathname])
    const isDashboard = mainUrl === '/dashboard'

    const getTitle = () => {
        if (isDashboard) return `Welcome, ${USERNAME}`
        return title
    }

    const getAddress = () => {
        if (isDashboard) return getDesignation()
        return address
    }

    return (
        <div className='content-header'>
            <div className='heading-container'>
                <div className='titles-container'>
                    <span className='title'>{getTitle()}</span>
                    <span className='address'>{getAddress()}</span>
                </div>
            </div>
        </div>
    )
}

export default ContentHeader
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSessionStorage } from '../utils/hooks/sessionHook'
import { getMainPathname } from '../utils/Functions';
import { getDesignation, getUsername } from '../utils/constants';
import '../sass/contentHeader.scss'

const ContentHeader = () => {
    const { pathname } = useLocation()
    const [roleInfo] = useSessionStorage('roleInfo', {})
    const { departmentName: title, address } = roleInfo

    const mainUrl = useMemo(() => getMainPathname(pathname), [pathname])
    const isDashboard = mainUrl === '/dashboard'

    const getTitle = () => {
        if (isDashboard) return `Welcome, ${getUsername()}`
        return title
    }

    const getAddress = () => {
        if (isDashboard) return getDesignation()
        return address
    }

    return (
        <div className='content-header'>
            {
                title && (
                    <div className='heading-container'>
                        <div className='titles-container'>
                            <span className='title'>{getTitle()}</span>
                            <span className='address'>{getAddress()}</span>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default ContentHeader
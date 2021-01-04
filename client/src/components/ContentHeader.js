import React from 'react';
import { useSessionStorage } from '../utils/hooks/sessionHook'
import '../sass/contentHeader.scss'

const ContentHeader = () => {
    const [roleInfo] = useSessionStorage('roleInfo', {})
    const { departmentName: title, address } = roleInfo

    return (
        <div className='content-header'>
            {
                title && (
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

export default ContentHeader
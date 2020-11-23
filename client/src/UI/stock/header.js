import React from 'react';
import Spinner from '../../components/Spinner';
import { MoreIconGrey } from '../../components/SVG_Icons'
import '../../sass/stock.scss'

const Header = ({ data }) => {
    const { address, title, loading } = data

    return (
        <div className='stock-header'>
            {
                loading ? <Spinner />
                    : (
                        <>
                            <div className='titles-container'>
                                <span className='title'>Kukatpally Warehouse</span>
                                <span className='address'>Kukatpally, Hyderabad, Telangana</span>
                            </div>
                            <div className='three-dot-menu'>
                                <MoreIconGrey />
                            </div>
                        </>
                    )
            }
        </div>
    )

}

export default Header
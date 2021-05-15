import React, { memo } from 'react';
import PieChart from './PieChart';
import '../sass/customerOnboardCard.scss'

const CustomerOnboardCard = memo(({ data, graph }) => {

    const { paidCount, pendingCount, totalCount } = data

    return (
        <div className='customer-onboard-card'>
            <div className='heading'>
                <span className='title'>Total Onboard Customers <span className='number'>- {totalCount || 0}</span></span>
            </div>
            <div className='pie-chart-stats'>
                <div className='pie-chart'>
                    <PieChart data={graph} />
                </div>
                <div className='stats'>
                    <div className='stat'>
                        <span className='app-dot' style={{ background: '#34B53A' }}></span>
                        <span className='title'>Corporate</span>
                    </div>
                    <div className='stat'>
                        <span className='app-dot' style={{ background: '#FFB200' }}></span>
                        <span className='title'>Other</span>
                    </div>
                    <div className='stat'>
                        <span className='app-dot' style={{ background: '#E01F1F' }}></span>
                        <span className='title'>Membership</span>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default CustomerOnboardCard
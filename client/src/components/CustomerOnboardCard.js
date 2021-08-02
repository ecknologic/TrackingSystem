import React, { memo } from 'react';
import PieChart from './PieChart';
import '../sass/customerOnboardCard.scss'

const CustomerOnboardCard = memo(({ data, graph }) => {

    const { onboardedCustomers } = data

    return (
        <div className='customer-onboard-card'>
            <div className='heading'>
                <span className='title'>Total Onboard Customers <span className='number'>- {onboardedCustomers || 0}</span></span>
            </div>
            <div className='pie-chart-stats'>
                <div className='pie-chart'>
                    <PieChart data={graph} />
                </div>
                <div className='stats'>
                    <div className='stat'>
                        <span className='app-dot' style={{ background: '#34B53A' }}></span>
                        <span className='title'>Onboarded</span>
                    </div>
                    <div className='stat'>
                        <span className='app-dot' style={{ background: '#FFB200' }}></span>
                        <span className='title'>Visited</span>
                    </div>
                    <div className='stat'>
                        <span className='app-dot' style={{ background: '#E01F1F' }}></span>
                        <span className='title'>Pending</span>
                    </div>
                    <div className='stat'>
                        <span className='app-dot' style={{ background: '#0091FF' }}></span>
                        <span className='title'>Revisit</span>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default CustomerOnboardCard
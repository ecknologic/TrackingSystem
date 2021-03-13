import React, { memo } from 'react';
import PieChart from './PieChart';
import '../sass/invoiceOverviewCardSmall.scss'

const InvoiceOverviewCardSmall = memo(({ data, graph }) => {

    const { paidCount, pendingCount, totalCount } = data

    return (
        <div className='invoice-overview-card-small'>
            <div className='heading'>
                <span className='title'>Total Generated</span>
                <span className='number'>{totalCount || 0}</span>
            </div>
            <div className='pie-chart-stats'>
                <div className='pie-chart'>
                    <PieChart data={graph} />
                </div>
                <div className='stats'>
                    <div className='stat'>
                        <span className='app-dot' style={{ background: '#FFB200' }}></span>
                        <span className='title'>Pending</span>
                        <div className='number'>
                            {pendingCount || 0}
                        </div>
                    </div>
                    <div className='stat'>
                        <span className='app-dot' style={{ background: '#34B53A' }}></span>
                        <span className='title'>Cleared</span>
                        <div className='number'>
                            {paidCount || 0}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default InvoiceOverviewCardSmall
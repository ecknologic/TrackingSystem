import React, { memo } from 'react';
import PieChart from './PieChart';
import '../sass/invoiceOverviewCard.scss'

const InvoiceOverviewCard = memo(({ data, graph }) => {

    const { paidCount, pendingCount, totalCount } = data

    return (
        <div className='invoice-overview-card'>
            <div className='heading'>
                <span className='title'>Total Generated Invoices</span>
                <span className='number'>{totalCount || 0}</span>
            </div>
            <div className='pie-chart-stats'>
                <div className='stats'>
                    <div className='stat pending-stats'>
                        <span className='title'>Pending to Clear</span>
                        <div className='number'>
                            <span className='app-dot' style={{ background: '#FFB200' }}></span>
                            {pendingCount || 0}
                        </div>
                    </div>
                    <div className='stat'>
                        <span className='title'>Cleared Invoices</span>
                        <div className='number'>
                            <span className='app-dot' style={{ background: '#34B53A' }}></span>
                            {paidCount || 0}
                        </div>
                    </div>
                </div>
                <div className='pie-chart'>
                    <PieChart data={graph} />
                </div>
            </div>
            <div className='pending'>
                <span className='text'>Pending to Generating Invoices</span>
                <span className='red-num'>0</span>
            </div>
        </div>
    )
})

export default InvoiceOverviewCard
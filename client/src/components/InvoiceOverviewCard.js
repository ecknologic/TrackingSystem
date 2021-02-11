import React from 'react';
import PieChart from './PieChart';
import CustomButton from './CustomButton';
import { RightChevronIconLight } from './SVG_Icons';
import '../sass/invoiceOverviewCard.scss'


const InvoiceOverviewCard = ({ onClick }) => {

    return (
        <div className='invoice-overview-card'>
            <div className='heading'>
                <span className='title'>Total Generated Invoices</span>
                <span className='number'>500</span>
            </div>
            <div className='pie-chart-stats'>
                <div className='stats'>
                    <div className='stat pending-stats'>
                        <span className='title'>Pending to Clear</span>
                        <div className='number'>
                            <span className='app-dot' style={{ background: '#FFB200' }}></span>
                            46
                        </div>
                    </div>
                    <div className='stat cleared-stats'>
                        <span className='title'>Cleared Invoices</span>
                        <div className='number'>
                            <span className='app-dot' style={{ background: '#34B53A' }}></span>
                            192
                        </div>
                    </div>
                </div>
                <div className='pie-chart'>
                    <PieChart />
                </div>
            </div>
            <div className='pending'>
                <span className='text'>Pending to Generate Invoices</span>
                <span className='red-num'>50</span>
            </div>
            <CustomButton
                text='View Details'
                className='app-view-btn'
                onClick={onClick}
                suffix={<RightChevronIconLight className='chev' />}
            />

        </div>
    )
}

export default InvoiceOverviewCard
import React from 'react';
import '../sass/dashboardResultsCard.scss';

const DashboardResultsCard = ({ isFirst, Header, Stats, Chart, className = '' }) => {

    const style = {
        marginRight: isFirst ? '1em' : 0
    }

    return (
        <div className={`dashboard-results-card ${className}`} style={style}>
            {Header}
            {Stats}
            <div className='bar-chart'>
                {Chart}
            </div>
        </div>
    )
}

export default DashboardResultsCard
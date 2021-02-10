import React from 'react';
import '../sass/dashboardResultsCard.scss';

const DashboardResultsCard = ({ isFirst, Header, Stats }) => {

    const style = {
        marginRight: isFirst ? '1em' : 0
    }

    return (
        <div className='dashboard-results-card' style={style}>
            {Header}
            {Stats}
        </div>
    )
}

export default DashboardResultsCard
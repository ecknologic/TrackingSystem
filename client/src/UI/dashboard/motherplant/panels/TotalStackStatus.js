import React from 'react';
import PanelHeader from '../../../../components/PanelHeader';
import StackCard from '../../../../components/StackCard';

const TotalStackStatus = () => {

    return (
        <>
            <PanelHeader title='Total Stack Status' />
            <div className='panel-body total-stack-panel'>
                <StackCard title='20 Ltrs' total='2345' />
                <StackCard title='1 Ltrs' total='2345' />
                <StackCard title='500 ml' total='2345' />
                <StackCard title='300 ml' total='2345' />
            </div>
        </>
    )
}

export default TotalStackStatus
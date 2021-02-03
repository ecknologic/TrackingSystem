import React from 'react';
import PanelHeader from '../../../../components/PanelHeader';
import EmptyBottlesStockCard from '../../../../components/EmptyBottlesStockCard';

const EmptyBottlesStock = () => {

    return (
        <>
            <PanelHeader title='Empty Bottles Stock' hideShift />
            <div className='panel-body'>
                <div className='empty-bottles-stock-panel'>
                    <EmptyBottlesStockCard title='20 Ltrs new' total='2345' strokeColor='#F7B500' />
                    <EmptyBottlesStockCard title='20 Ltrs new' total='2345' strokeColor='#4C9400' />
                    <EmptyBottlesStockCard title='1 Ltrs new' total='2345' strokeColor='#41B9AD' />
                    <EmptyBottlesStockCard title='500 ml new' total='2345' strokeColor='#0091FF' />
                    <EmptyBottlesStockCard title='300 ml new' total='2345' strokeColor='#FA6400' />
                </div>
            </div>
        </>
    )
}

export default EmptyBottlesStock
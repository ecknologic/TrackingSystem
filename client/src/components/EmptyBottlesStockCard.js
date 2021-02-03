import React from 'react';
import { Progress } from 'antd'
import '../sass/emptyBottlesStockCard.scss';

const EmptyBottlesStockCard = ({ title, total, strokeColor }) => {


    return (
        <div className='empty-bottles-stock-card'>
            <div className='body'>
                <div className='progress'>
                    <Progress
                        type='circle'
                        percent={75}
                        strokeColor={strokeColor}
                        format={(percent) => <span style={{ color: strokeColor }} className='progress-percent'>{percent}%</span>}
                        width={50}
                        strokeWidth={8}
                    />
                </div>
                <div className='details'>
                    <span className='title'>{title}</span>
                    <div className='number'>{total}</div>
                </div>
            </div>
            <span className='footer'>Total Bottles Added - 18,232</span>
        </div>
    )
}

export default EmptyBottlesStockCard
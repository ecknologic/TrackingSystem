import React from 'react';
import { Progress } from 'antd'
import '../sass/emptyBottlesStockCard.scss';
import ChangeBadge from './ChangeBadge';

const EmptyBottlesStockCard = ({ title, total, strokeColor, percent, isRs, text }) => {


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
                    <span className='number'>{isRs ? '₹ ' : ''}{total || 0}</span>
                    <ChangeBadge percent={percent} />
                </div>
            </div>
            <span className='footer'>{text || '--'}</span>
        </div>
    )
}

export default EmptyBottlesStockCard
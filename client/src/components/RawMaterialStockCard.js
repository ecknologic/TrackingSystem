import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import StockBadge from './StockBadge';
import '../sass/rawMaterialStockCard.scss';

const RawMaterialStockCard = ({ data }) => {

    return (
        <div className='raw-mat-stock-card'>
            <Scrollbars renderThumbVertical={Thumb}>
                <div className='panel-details-scroll'>
                    <div className='panel-details'>
                        {
                            data.map((item, index) => {
                                const { itemName, itemCount, isLow } = item
                                return (
                                    <div className='item' key={index}>
                                        <span className='name'><span className='app-dot'></span>{itemName}</span>
                                        {isLow && <StockBadge />}
                                        <span className='value'>{itemCount}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </Scrollbars>
        </div>
    )
}
const Thumb = (props) => <div {...props} className="thumb-vertical" />
export default RawMaterialStockCard
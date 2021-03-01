import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import MessageCard from '../../../../components/MessageCard';
import ScrollTo from '../../../../components/ScrollTo';

const ListPanel = ({ data, onSelect, active }) => {

    return (
        <Scrollbars renderThumbVertical={Thumb} autoHide>
            <ScrollTo child={`.${active.invoiceId}`} parent='.message-list' />
            <div className='message-list'>
                {
                    data.map(item => <MessageCard key={item.invoiceId} onSelect={onSelect} active={active} data={item} />)
                }
            </div>
        </Scrollbars>
    )
}

const Thumb = (props) => <div {...props} className="thumb-vertical" />
export default ListPanel
import React from 'react';
import AvatarText from './AvatarText';
import '../sass/nameCard.scss'

const NameCard = ({ name = '', extra, size = 'small' }) => {

    return (
        <div className={`name-card-container ${size}`}>
            <AvatarText name={name} />
            <span className='name clamp-1'>{name}</span>
            {extra}
        </div>
    )
}

export default NameCard
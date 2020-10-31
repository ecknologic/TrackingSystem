import React from 'react';
import { stringToHslColor } from '../utils/Functions'
import AvatarText from './AvatarText';
import '../sass/nameCard.scss'

const NameCard = ({ name = '' }) => {
    const color = stringToHslColor(name)
    const initials = name.split(" ").map((n, i, a) => i === 0 || i + 1 === a.length ? n[0] : null).join("")

    return (
        <div className='name-card-container'>
            <AvatarText name={name} />
            <span className='name'>{name}</span>
        </div>
    )
}

export default NameCard
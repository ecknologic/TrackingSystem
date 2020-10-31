import React from 'react';
import { stringToHslColor } from '../utils/Functions'
import '../sass/avatarText.scss'

const AvatarText = ({ name = '' }) => {
    const color = stringToHslColor(name)
    const initials = name.split(" ").map((n, i, a) => i === 0 || i + 1 === a.length ? n[0] : null).join("")

    return (
        <div className='avatar-text-container' style={{ background: color }}>
            <span id='text'>{initials}</span>
        </div>
    )
}

export default AvatarText
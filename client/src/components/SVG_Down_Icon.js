import React from 'react';
import dropdownIcon from '../assets/icons/ic_Dropdown.svg'

const DownIcon = ({ isActive }) => {
    return <img className={`app-svg-dropdown ${isActive && 'rotate-zero'}`} src={dropdownIcon} alt='' />
}
export default DownIcon
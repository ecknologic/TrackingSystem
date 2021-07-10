import React from 'react';
import { Menu } from 'antd';
import Actions from './Actions';
import NameCard from './NameCard';
import PrimaryButton from './PrimaryButton';
import { getBusinessTypes } from '../utils/Functions';
import { FriendsIconGrey, FriendIconGrey, TrashIconGrey } from './SVG_Icons';
import '../sass/accountCard.scss'

const ClosureCard = ({ data, onClick, btnTxt = 'View Account', onSelect, isAdmin, }) => {
    const { customerId, contactpersons = "[]", customerName, organizationName, address,
        natureOfBussiness, customerNo } = data

    const names = JSON.parse(contactpersons)
    const contacts = names.length

    const extra = contacts > 3 ? <span className='extra'>{`+${contacts - 3}`}</span> : null
    const NOB = getBusinessTypes(natureOfBussiness)

    const handleSelect = ({ key }) => {
        onSelect(key, customerId)
    }

    const options = [
        <Menu.Item key="Delete" icon={<TrashIconGrey />} >Delete</Menu.Item>
    ]

    return (
        <div className='account-card-container'>
            <div className='header'>
                <div className='inner'>
                    {contacts > 1 ? <FriendsIconGrey className='friends icon' /> : <FriendIconGrey className='friend icon' />}
                    <div className='address-container'>
                        <span className='title clamp-1'>{organizationName || customerName}</span>
                        <span className='id'>ID: {customerNo}</span>
                        <span className='address clamp-2'>{address}</span>
                    </div>
                </div>
            </div>
            <div className='body'>
                <div className='contact-container'>
                    <span className='type1'>Contact Persons</span>
                    <div className='contacts'>
                        {
                            names.map((item, index) => index <= 2
                                ? <NameCard
                                    key={index}
                                    name={item}
                                    extra={index === 2 && extra ? extra : null}
                                />
                                : null)
                        }
                    </div>
                </div>
                <div className='business'>
                    <span className='type1'>Business Type</span>
                    <span className='value'>{NOB}</span>
                </div>
            </div>
            <div className='footer'>
                <PrimaryButton text={btnTxt} onClick={() => onClick(customerId)} />
                {
                    isAdmin &&
                    <Actions options={options} onSelect={handleSelect} />
                }
            </div>
        </div>
    )

}

export default ClosureCard
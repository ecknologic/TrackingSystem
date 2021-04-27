import React from 'react';
import { Menu } from 'antd';
import Actions from './Actions';
import NameCard from './NameCard';
import PrimaryButton from './PrimaryButton';
import { getBusinessTypes } from '../utils/Functions';
import { FriendsIconGrey, FriendIconGrey, TrashIconGrey, TickIconGrey, BlockIconGrey } from './SVG_Icons';
import '../sass/accountCard.scss'

const AccountCard = ({ data, onClick, btnTxt = 'Manage Account', onSelect, isAdmin, optionOneLabel = 'Active' }) => {
    const { customerId, isApproved, contactpersons, customerName, organizationName, address, natureOfBussiness,
        isSuperAdminApproved, depositAmount } = data

    const optionOne = isApproved ? 'Draft' : optionOneLabel
    const iconOne = isApproved ? <BlockIconGrey /> : <TickIconGrey />
    const names = JSON.parse(contactpersons)
    const contacts = names.length

    const extra = contacts > 3 ? <span className='extra'>{`+${contacts - 3}`}</span> : null
    const NOB = getBusinessTypes(natureOfBussiness)

    const handleSelect = ({ key }) => {
        const isSAApproved = isSuperAdminApproved || (Number(depositAmount) === 0 ? Number(isAdmin) : 0)
        onSelect(key, customerId, isSAApproved)
    }

    const options = [
        <Menu.Item key={optionOne} icon={iconOne}>{optionOne}</Menu.Item>,
        <Menu.Item key="Delete" icon={<TrashIconGrey />} >Delete</Menu.Item>
    ]

    return (
        <div className='account-card-container'>
            <div className={isApproved ? 'badge active' : 'badge'}>{isApproved ? "ACTIVE" : "DRAFT"}</div>
            <div className='header'>
                <div className={isApproved ? 'inner green' : 'inner'}>
                    {contacts > 1 ? <FriendsIconGrey className='friends icon' /> : <FriendIconGrey className='friend icon' />}
                    <div className='address-container'>
                        <span className='title clamp-1'>{organizationName || customerName}</span>
                        <span className='id'>ID: {customerId}</span>
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

export default AccountCard
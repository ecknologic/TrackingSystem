import React from 'react';
import { Menu } from 'antd';
import NameCard from './NameCard';
import PrimaryButton from './PrimaryButton';
import Actions from '../components/Actions'
import { FriendIconGrey, TrashIconGrey, TickIconGrey, BlockIconGrey, CrossIconDark } from './SVG_Icons';
import '../sass/accountCard.scss'
import '../sass/addressCard.scss'

const AddressCard = ({ data, isAdmin, onClick, onSelect }) => {
    const { isApproved, departmentName, phoneNumber, location, contactPerson, deliveryDetailsId, isClosed } = data
    const optionOne = isApproved ? 'Draft' : 'Active'
    const iconOne = isApproved ? <BlockIconGrey /> : <TickIconGrey />

    const handleSelect = ({ key }) => {
        onSelect(key, deliveryDetailsId)
    }

    const options = [
        <Menu.Item key={optionOne} icon={iconOne}>{optionOne}</Menu.Item>,
        <Menu.Item key="Delete" icon={<TrashIconGrey />} >Delete</Menu.Item>
    ]

    const getOptions = () => {
        let options = [
            <Menu.Item key={optionOne} icon={iconOne}>{optionOne}</Menu.Item>,
            <Menu.Item key="Delete" icon={<TrashIconGrey />} >Delete</Menu.Item>
        ]

        if (isApproved) {
            options.push(<Menu.Item key="Close" icon={<CrossIconDark />}>Close</Menu.Item>)
        }

        if (isClosed) {
            options = [<Menu.Item key="Delete" icon={<TrashIconGrey />} >Delete</Menu.Item>]
        }

        return options
    }

    return (
        <div className='account-card-container address-card-container'>
            <div className={isClosed ? 'badge closed' : isApproved ? 'badge active' : 'badge'}>
                {isClosed ? 'CLOSED' : isApproved ? 'ACTIVE' : 'DRAFT'}
            </div>
            <div className='header'>
                <div className={isApproved ? 'inner green' : 'inner'}>
                    <FriendIconGrey className='friend icon' />
                    <div className='address-container'>
                        <span className='title clamp-1'>{location}</span>
                    </div>
                </div>
            </div>
            <div className='body'>
                <div className='contact-container'>
                    <span className='type1'>Contact Details</span>
                    <div className='contacts'>
                        <NameCard name={contactPerson} />
                        <span className='mobile'>{phoneNumber}</span>
                    </div>
                </div>
                <div className='business'>
                    <span className='type1'>Assigned Warehouse</span>
                    <span className='value'>{departmentName}</span>
                </div>
            </div>
            <div className='footer'>
                <PrimaryButton text='View Details' onClick={() => onClick(deliveryDetailsId)} />
                {
                    isAdmin && <Actions options={getOptions()} onSelect={handleSelect} />
                }
            </div>
        </div>
    )
}

export default AddressCard
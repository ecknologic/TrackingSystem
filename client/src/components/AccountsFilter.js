import React from 'react';
import { businessOptions, statusOptions } from '../assets/fixtures';
import SelectInput from './SelectInput';

const AccountsFilter = ({ onChange, data }) => {
    const { natureOfBussiness, status } = data
    return (
        <div className='accounts-filter-body'>
            <div className='row'>
                <div className='input-container'>
                    <label className='app-input-label-name'>Nature Of Business</label>
                    <SelectInput value={natureOfBussiness} options={businessOptions} onSelect={(value) => onChange(value, 'natureOfBussiness')} />
                </div>
                <div className='input-container'>
                    <label className='app-input-label-name'>Status</label>
                    <SelectInput value={status} options={statusOptions} onSelect={(value) => onChange(value, 'status')} />
                </div>
            </div>
        </div>
    )
}

export default AccountsFilter;
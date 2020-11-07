import React from 'react';
import '../sass/identityProof.scss'
import SelectInput from './SelectInput';
import { idOptions } from '../assets/fixtures'

const IdentityProof = ({ idProofs }) => {

    const handleSelect = () => {

    }

    return (
        <div className='identity-proof-container'>
            <div className='input-container'>
                <label className='app-input-label-name'>Select Id Proof</label>
                <SelectInput options={idOptions} onSelect={handleSelect} />
            </div>
            <div className='upload-instructions'>
                <span className='title'>Please help us verify your identity</span>
                <span className='msg'>(Kindly upload the documents either in JPEG, PNG, or PDF format. The file should be less than 5MB) Need to upload front and back.</span>
            </div>
        </div>
    )
}

export default IdentityProof

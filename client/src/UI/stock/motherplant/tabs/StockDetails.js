import React from 'react';
import CASMPPanel from '../../../../components/CASMPPanel';
import CustomButton from '../../../../components/CustomButton';
import ProductionForm from '../forms/ProductionForm';

const Hello = () => {

    const { btnDisabled, shake, handleAccountUpdate } = {}
    return (
        <>
            <CASMPPanel data={{}} />
            <ProductionForm data={{}} errors={{}} />
            <div className='app-footer-buttons-container'>
                <CustomButton
                    onClick={handleAccountUpdate}
                    className={`
                    app-create-btn footer-btn ${btnDisabled ? 'disabled' : ''} 
                    ${shake ? 'app-shake' : ''}
                `}
                    text='Create Batch'
                />
            </div>
        </>
    )
}

export default Hello
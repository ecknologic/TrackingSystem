import React from 'react';
import CustomButton from '../../../components/CustomButton';
import FormHeader from '../../../components/FormHeader';
import DispatchForm from '../forms/DispatchForm';

const CreateDispatch = () => {

    const { btnDisabled, shake, handleAccountUpdate } = {}
    return (
        <>
            <FormHeader title='Create Dispatch DC' />
            <DispatchForm data={{}} errors={{}} />
            <div className='app-footer-buttons-container'>
                <CustomButton
                    onClick={handleAccountUpdate}
                    className={`
                    app-create-btn footer-btn ${btnDisabled ? 'disabled' : ''} 
                    ${shake ? 'app-shake' : ''}
                `}
                    text='Create DC'
                />
            </div>
        </>
    )
}

export default CreateDispatch
import React, { useEffect } from 'react';
import InputLabel from '../../../components/InputLabel';
import CustomTextArea from '../../../components/CustomTextArea';
import { resetTrackForm, trackAccountFormOnce } from '../../../utils/Functions';

const InvoiceRestForm = ({ data, errors, onChange }) => {

    const { TAndC } = data

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    return (
        <div className='app-form-container invoice-form-container'>
            <div className='row'>
                <div className='input-container stretch'>
                    <InputLabel name='Terms & Conditions' error={errors.TAndC} mandatory />
                    <CustomTextArea maxLength={100} error={errors.TAndC} placeholder='Add Terms & Conditions' value={TAndC}
                        maxRows={4} onChange={(value) => onChange(value, 'TAndC')}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='input-container stretch'>
                    <InputLabel name='Email To' error={errors.TAndC} />
                    <div className='checkbox-container'>
                        <span className='text'>{`Customer Name <customer@gmail.com>`}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default InvoiceRestForm
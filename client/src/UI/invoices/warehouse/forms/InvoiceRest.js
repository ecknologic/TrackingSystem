import React, { useEffect } from 'react';
import InputLabel from '../../../../components/InputLabel';
import InputValue from '../../../../components/InputValue';
import CustomTextArea from '../../../../components/CustomTextArea';
import { resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';
import SelectInput from '../../../../components/SelectInput';

const InvoiceRestForm = ({ data, errors, paymentOptions, onChange, hasPaid }) => {

    const { TAndC, EmailId, paymentMode } = data

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    return (
        <div className='app-form-container invoice-form-container'>
            {
                hasPaid && <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Payment Mode' mandatory error={errors.paymentMode} />
                        <SelectInput track
                            options={paymentOptions} value={paymentMode}
                            error={errors.paymentMode} onSelect={(value) => onChange(value, 'paymentMode')}
                        />
                    </div>
                </div>
            }
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
                    <InputLabel name='Email To' />
                    <InputValue size='large' value={EmailId} />
                </div>
            </div>
        </div>
    )
}
export default InvoiceRestForm
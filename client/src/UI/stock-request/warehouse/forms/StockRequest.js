import React, { useEffect } from 'react';
import InputLabel from '../../../../components/InputLabel';
import SelectInput from '../../../../components/SelectInput';
import CustomInput from '../../../../components/CustomInput';
import CustomDateInput from '../../../../components/CustomDateInput';
import { disablePastDates, resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';

const StockRequestForm = (props) => {

    const { data, errors, disabled, onChange, motherplantOptions } = props
    const { requestTo, requiredDate, product20L, product2L, product1L, product500ML, product300ML } = data

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    return (
        <>
            <div className='app-form-container material-form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Required Date' error={errors.requiredDate} mandatory />
                        <CustomDateInput
                            track disabledDate={disablePastDates}
                            value={requiredDate} error={errors.requiredDate}
                            onChange={(value) => onChange(value, 'requiredDate')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Request To' error={errors.requestTo} mandatory />
                        <SelectInput track value={requestTo} options={motherplantOptions}
                            disabled={disabled} error={errors.requestTo}
                            onSelect={(value) => onChange(value, 'requestTo')}
                        />
                    </div>
                </div>
                <div className='columns' style={{ width: '100%' }}>
                    <InputLabel name='Products and Price' error={errors.productNPrice} mandatory />
                    <div className='columns-container'>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='20 Ltrs' />
                                <CustomInput value={product20L} disabled={disabled}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'product20L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='2 Ltrs (Box-1&times;9)' />
                                <CustomInput value={product2L} disabled={disabled}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'product2L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='1 Ltrs (Box-1&times;12)' />
                                <CustomInput value={product1L} disabled={disabled}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'product1L')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='500 Ml (Box-1&times;24)' />
                                <CustomInput value={product500ML} disabled={disabled}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'product500ML')} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='300 Ml (Box-1&times;30)' />
                                <CustomInput value={product300ML} disabled={disabled}
                                    placeholder='Qty' onChange={(value) => onChange(value, 'product300ML')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default StockRequestForm
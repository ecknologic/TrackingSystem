import React, { useEffect } from 'react';
import SelectInput from '../../../../components/SelectInput';
import InputLabel from '../../../../components/InputLabel';
import { resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';

const AssignTo = (props) => {

    const { data, errors, creatorOptions, onChange } = props

    const { salesPerson } = data


    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    return (
        <>
            <div className='app-form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Assign To' error={errors.salesPerson} mandatory />
                        <SelectInput track options={creatorOptions}
                            error={errors.salesPerson} value={salesPerson}
                            onSelect={(value) => onChange(value, 'salesPerson')}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export default AssignTo
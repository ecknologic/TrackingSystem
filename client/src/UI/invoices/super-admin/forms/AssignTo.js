import React, { useEffect } from 'react';
import SelectInput from '../../../../components/SelectInput';
import InputLabel from '../../../../components/InputLabel';
import { resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';

const AssignTo = (props) => {

    const { data, errors, creatorOptions, onChange } = props

    const { assignTo } = data


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
                        <InputLabel name='Assign To' error={errors.assignTo} mandatory />
                        <SelectInput track options={creatorOptions}
                            error={errors.assignTo} value={assignTo}
                            onSelect={(value) => onChange(value, 'assignTo')}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export default AssignTo
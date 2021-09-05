import React, { useEffect } from 'react';
import { Divider } from 'antd';
import InputLabel from '../../../../components/InputLabel';
import InputValue from '../../../../components/InputValue';
import CustomTextArea from '../../../../components/CustomTextArea';
import { renderProductDetailsJSX, resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';

const DamagedStockView = (props) => {

    const { data, errors = {}, disabled, onChange, viewOnly } = props

    const { batchId, damagedDesc, isDamaged, managerName, ...rest } = data

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    return (
        <div className='app-form-container'>
            <div className='row'>
                <div className='input-container'>
                    <InputLabel name='Batch Number' />
                    <InputValue size='larger' value={batchId} />
                </div>
                <div className='input-container'>
                    <InputLabel name='Manager' />
                    <InputValue size='larger' value={managerName} />
                </div>
            </div>
            <Divider />
            <Divider />
            {renderProductDetailsJSX(rest, 'Damaged Stock')}
            <div className='row'>
                <div className='input-container stretch'>
                    <InputLabel name='Damaged Details' error={errors.damagedDesc} />
                    {
                        viewOnly ? <InputValue size='smaller' value={damagedDesc || '--'} />
                            : <CustomTextArea disabled={!isDamaged || disabled} maxLength={1000} error={errors.damagedDesc} placeholder='Add Damaged Details' value={damagedDesc}
                                minRows={3} maxRows={5} onChange={(value) => onChange(value, 'damagedDesc')}
                            />
                    }
                </div>
            </div>
        </div>
    )
}
export default DamagedStockView
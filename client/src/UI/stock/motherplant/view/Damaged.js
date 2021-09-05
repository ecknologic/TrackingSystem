import React, { useEffect } from 'react';
import { Divider } from 'antd';
import InputLabel from '../../../../components/InputLabel';
import InputValue from '../../../../components/InputValue';
import CustomTextArea from '../../../../components/CustomTextArea';
import { resetTrackForm, trackAccountFormOnce } from '../../../../utils/Functions';

const DamagedStockView = (props) => {

    const { data, errors = {}, disabled, onChange, viewOnly } = props

    const { batchId, damagedDesc, isDamaged, managerName, product20L,
        product2L, product1L, product300ML, product500ML } = data

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
            <div className='columns'>
                <InputLabel name='Damaged Stock' />
                <div className='columns-container'>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='20 Ltrs' />
                            <InputValue size='smaller' value={product20L || 0} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='2 Ltrs (Box-1&times;12)' />
                            <InputValue size='smaller' value={product2L || 0} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='1 Ltrs (Box-1&times;12)' />
                            <InputValue size='smaller' value={product1L || 0} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='500 Ml (Box-1&times;12)' />
                            <InputValue size='smaller' value={product500ML || 0} />
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <InputLabel name='300 Ml (Box-1&times;12)' />
                            <InputValue size='smaller' value={product300ML || 0} />
                        </div>
                    </div>
                </div>
            </div>
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
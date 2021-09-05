import dayjs from 'dayjs';
import React from 'react';
import { Divider } from 'antd';
import InputLabel from '../../../../components/InputLabel';
import InputValue from '../../../../components/InputValue';
import { getProductsForUI, getStatusColor } from '../../../../utils/Functions';
import CustomTextArea from '../../../../components/CustomTextArea';
const DATEANDTIMEFORMAT = 'DD/MM/YYYY hh:mm A'
const DATEFORMAT = 'DD/MM/YYYY'

const RequestedStockStatusView = ({ data, formData, errors, isMPAdmin, editMode, onChange }) => {

    const { requiredDate, status, departmentName, createdDateTime, products } = data
    const productsForUI = getProductsForUI(JSON.parse(products))
    const { reason } = formData

    const { product20L, product2L, product1L, product500ML, product300ML } = productsForUI

    const color = getStatusColor(status)

    return (
        <>
            <div className='app-form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Requested On' />
                        <InputValue size='smaller' value={dayjs(createdDateTime).format(DATEANDTIMEFORMAT)} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Status' />
                        <span className='app-dot' style={{ background: color }}></span>
                        <InputValue size='smaller' value={status} />
                    </div>
                </div>
                <Divider />
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Required Date' />
                        <InputValue size='smaller' value={dayjs(requiredDate).format(DATEFORMAT)} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name={isMPAdmin ? 'Requested By' : 'Requested To'} />
                        <InputValue size='smaller' value={departmentName} />
                    </div>
                </div>
                <Divider />
                <div className='columns'>
                    <InputLabel name='Stock Particulars' />
                    <div className='columns-container'>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='20 Ltrs' />
                                <InputValue size='smaller' value={product20L} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='2 Ltrs (Box-1&times;12)' />
                                <InputValue size='smaller' value={product2L} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='1 Ltrs (Box-1&times;12)' />
                                <InputValue size='smaller' value={product1L} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='500 Ml (Box-1&times;12)' />
                                <InputValue size='smaller' value={product500ML} />
                            </div>
                        </div>
                        <div className='column'>
                            <div className='input-container'>
                                <InputLabel name='300 Ml (Box-1&times;12)' />
                                <InputValue size='smaller' value={product300ML} />
                            </div>
                        </div>
                    </div>
                </div>
                {
                    isMPAdmin &&
                    <>
                        <Divider />
                        <div className='row'>
                            <div className='input-container stretch'>
                                <InputLabel name='Description' error={errors.reason} />
                                {
                                    editMode ? (
                                        <CustomTextArea maxLength={256} error={errors.reason} placeholder='Add Description'
                                            value={reason} maxRows={4} onChange={(value) => onChange(value, 'reason')}
                                        />
                                    ) : <InputValue size='smaller' value={reason || '--'} />
                                }
                            </div>
                        </div>
                    </>
                }
            </div>
        </>
    )
}
export default RequestedStockStatusView
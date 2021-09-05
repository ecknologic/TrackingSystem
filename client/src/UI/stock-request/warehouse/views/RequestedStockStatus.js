import dayjs from 'dayjs';
import React from 'react';
import { Divider } from 'antd';
import InputLabel from '../../../../components/InputLabel';
import InputValue from '../../../../components/InputValue';
import { getProductsForUI, getStatusColor, renderProductDetailsJSX } from '../../../../utils/Functions';
import CustomTextArea from '../../../../components/CustomTextArea';
const DATEANDTIMEFORMAT = 'DD/MM/YYYY hh:mm A'
const DATEFORMAT = 'DD/MM/YYYY'

const RequestedStockStatusView = ({ data, formData, errors, isMPAdmin, editMode, onChange }) => {

    const { requiredDate, status, departmentName, createdDateTime, products,
        warehouseAdminName, warehouseAdminMobileNo } = data
    const productsForUI = getProductsForUI(JSON.parse(products))
    const { reason } = formData

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
                {
                    isMPAdmin &&
                    (<>
                        <Divider />
                        <div className='row'>
                            <div className='input-container'>
                                <InputLabel name='Requestor Name' />
                                <InputValue size='smaller' value={warehouseAdminName} />
                            </div>
                            <div className='input-container'>
                                <InputLabel name='Requestor Mobile Number' />
                                <InputValue size='smaller' value={warehouseAdminMobileNo} />
                            </div>
                        </div>
                    </>)
                }
                <Divider />
                {renderProductDetailsJSX(productsForUI)}
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
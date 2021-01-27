import React from 'react';
import dayjs from 'dayjs';
import InputValue from '../../../components/InputValue';
import { getRoleLabel } from '../../../utils/Functions';
import { Divider } from 'antd';
const DATEFORMAT = 'DD/MM/YYYY'

const AccountView = ({ data, isDriver }) => {

    const {
        userName, parentName, gender, dob, mobileNumber, address, joinedDate, permanentAddress,
        roleId, emailid, recommendedBy, recruitedBy, accountNo, branchName, bankName, ifscCode, departmentName
    } = data

    return (
        <div className='app-view-info'>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Name' />
                    <InputValue size='large' value={userName} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value="Parent's Name" />
                    <InputValue size='large' value={parentName} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Email ID' />
                    <InputValue size='large' value={emailid} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='Contact Number' />
                    <InputValue size='large' value={mobileNumber} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Gender' />
                    <InputValue size='large' value={gender} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='Date of Birth' />
                    <InputValue size='large' value={dayjs(dob).format(DATEFORMAT)} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Date of Joining' />
                    <InputValue size='large' value={dayjs(joinedDate).format(DATEFORMAT)} />
                </div>
                {
                    !isDriver ? (
                        <div className='input-container'>
                            <InputValue size='smaller' value='Administrator Role' />
                            <InputValue size='large' value={getRoleLabel(roleId)} />
                        </div>
                    ) : departmentName ? (
                        <div className='input-container'>
                            <InputValue size='smaller' value='Assigned To' />
                            <InputValue size='large' value={departmentName} />
                        </div>
                    ) : null
                }
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Recruited By' />
                    <InputValue size='large' value={recruitedBy} />
                </div>
                {
                    recommendedBy && (
                        <div className='input-container'>
                            <InputValue size='smaller' value='Recommended By' />
                            <InputValue size='large' value={recommendedBy} />
                        </div>
                    )
                }
            </div>
            <div className='row half-stretch'>
                <div className='input-container stretch'>
                    <InputValue size='smaller' value='Address of Communtication' />
                    <InputValue size='large' value={address} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container stretch'>
                    <InputValue size='smaller' value='Permanent Address' />
                    <InputValue size='large' value={permanentAddress} />
                </div>
            </div>
            <Divider className='form-divider' />
            <div className='employee-title-container inner'>
                <span className='title'>Bank Account Details</span>
            </div>
            <div className='row half-stretch'>
                <div className='input-container '>
                    <InputValue size='smaller' value='Account Number' />
                    <InputValue size='large' value={accountNo} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='Bank Name' />
                    <InputValue size='large' value={bankName} />
                </div>
            </div>
            <div className='row half-stretch'>
                <div className='input-container'>
                    <InputValue size='smaller' value='Branch Name' />
                    <InputValue size='large' value={branchName} />
                </div>
                <div className='input-container'>
                    <InputValue size='smaller' value='IFSC Code' />
                    <InputValue size='large' value={ifscCode} />
                </div>
            </div>
        </div>
    )
}
export default AccountView
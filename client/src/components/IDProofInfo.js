import React from 'react';
import InputValue from './InputValue';
import UploadPreviewer from './UploadPreviewer';
import { getIdProofName } from '../utils/Functions';

const IDProofInfo = ({ data }) => {

    const { idProofType, Front, Back } = data
    const proofName = getIdProofName(idProofType)

    const hasSingle = idProofType === 'panNo' || idProofType === 'gstNo'
    const idNumber = data[idProofType]

    if (idNumber || Front)
        return (
            <div className='app-view-info'>
                <div className='row half-stretch'>
                    {
                        idNumber &&
                        (
                            <div className='input-container'>
                                <InputValue size='smaller' value={proofName} />
                                <InputValue size='large' value={idNumber} />
                            </div>
                        )
                    }
                    {
                        Front &&
                        (
                            <div className='input-container'>
                                <InputValue size='smaller' value='ID Proof' />
                                <div className='upload-preview-container'>
                                    <UploadPreviewer value={Front} disabled title={!hasSingle && 'Front'} />
                                    {
                                        !hasSingle &&
                                        <UploadPreviewer value={Back} disabled title='Back' className='last' />
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    return null
}

export default IDProofInfo
import React from 'react';
import InputValue from './InputValue';
import UploadPreviewer from './UploadPreviewer';
import { getIdProofName } from '../utils/Functions';

const IDProofInfo = ({ data }) => {

    const { idProofType, Front, Back } = data
    const proofName = getIdProofName(idProofType)

    const hasSingle = idProofType === 'panNo' || idProofType === 'gstNo'

    if (Front)
        return (
            <div className='app-view-info'>
                <div className='row half-stretch'>
                    <div className='input-container'>
                        <InputValue size='smaller' value={proofName} />
                        <InputValue size='large' value={data[idProofType]} />
                    </div>
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
                </div>
            </div>
        )
    return null
}

export default IDProofInfo
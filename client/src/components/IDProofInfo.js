import React from 'react';
import InputValue from './InputValue';
import UploadPreviewer from './UploadPreviewer';
import { getIdProofName } from '../utils/Functions';

const IDProofInfo = ({ data }) => {

    const { idProofType, Front, Back } = data
    const proofName = getIdProofName(idProofType)

    return (
        <div className='app-view-info'>
            <div className='input-container'>
                <InputValue size='smaller' value={proofName} />
                <InputValue size='large' value={data[idProofType]} />
            </div>
            <div className='input-container'>
                <InputValue size='smaller' value='ID Proof' />
                <div className='upload-preview-container'>
                    <UploadPreviewer value={Front} disabled title={idProofType !== 'panNo' && 'Front'} />
                    {
                        idProofType !== 'panNo' &&
                        <UploadPreviewer value={Back} disabled title='Back' className='last' />
                    }
                </div>
            </div>
        </div>
    )
}

export default IDProofInfo
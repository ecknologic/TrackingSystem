import { Input } from 'antd';
import React, { useEffect, useState } from 'react';
import SelectInput from './SelectInput';
import { idOptions } from '../assets/fixtures'
import { getIdProofName, getBase64, getIdProofKey, deepClone } from '../utils/Functions';
import UploadPreviewer from './UploadPreviewer';
import DraggerInput from './DraggerInput';
import '../sass/identityProof.scss'

const IdentityProof = ({ data, getId, onGet }) => {

    const [proofName, setProofName] = useState('')
    const [proofValue, setProofValue] = useState()
    const [proofInputValue, setProofInputValue] = useState('')
    const [idProofs, setIdProofs] = useState([])

    const draggerDisable = idProofs.length >= 2

    useEffect(() => { // To pre-fill the form
        if (data) {
            const clone = deepClone(data)
            const { idProofs = [] } = clone
            const proofValue = getIdProofKey(clone)
            setProofValue(proofValue)
            setProofInputValue(clone[proofValue])
            setIdProofs(idProofs)
        }
    }, [data])

    useEffect(() => { // send data to parent
        if (getId) {
            const data = { idProofs, [proofValue]: proofInputValue }
            onGet(data)
        }
    }, [getId])

    const handleSelect = (value) => {
        setProofValue(value)
        setProofInputValue('')
        setProofName(getIdProofName(value))
        setIdProofs([])
    }

    const handleUpload = (file) => {
        getBase64(file, async (buffer) => {
            const clone = deepClone(idProofs)
            clone.push(buffer)
            setIdProofs(clone)
        })
    }

    return (
        <div className='identity-proof-container'>
            <div className='input-container'>
                <label className='app-input-label-name'>Select Id Proof</label>
                <SelectInput value={proofValue} options={idOptions} onSelect={handleSelect} />
            </div>
            {
                proofValue && (
                    <div className='input-container second'>
                        <label className='app-input-label-name'>{proofName}</label>
                        <Input size='large' value={proofInputValue} placeholder={`Add ${proofName}`} onChange={({ target: { value } }) => setProofInputValue(value)} />
                    </div>
                )
            }
            <div className='upload-container'>
                <DraggerInput onUpload={handleUpload} disabled={draggerDisable} />
                <UploadPreviewer data={idProofs} />
            </div>
            <div className='upload-instructions'>
                <span className='title'>Please help us verify your identity</span>
                <span className='msg'>(Kindly upload the documents either in JPEG, PNG, or PDF format. The file should be less than 5MB) Need to upload front and back.</span>
            </div>
        </div>
    )
}

export default IdentityProof

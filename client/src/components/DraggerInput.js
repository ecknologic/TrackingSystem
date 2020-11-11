import React from 'react';
import { Upload } from 'antd'
const { Dragger } = Upload;

const DraggerInput = ({ onUpload, disabled }) => {

    const props = {
        accept: ".png,.jpg,.jpeg,.pdf",
        customRequest: (e) => onUpload(e.file),
        showUploadList: false,
        disabled
    }

    return (
        <div className='upload-dragger-container'>
            <Dragger {...props}>
                <span className='msg'>Drag here or <span className='click'>click</span> to browse a file</span>
            </Dragger>
        </div>
    )
}

export default DraggerInput
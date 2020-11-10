import React, { useEffect } from 'react';
import '../sass/uploadPreviewer.scss'

const UploadPreviewer = ({ title, value, onRemove }) => {

    useEffect(() => {
        const content = new Uint8Array(value);

        // document.getElementById('my-image').src = URL.createObjectURL(
        //     new Blob([content.buffer], { type: 'image/png' } /* (1) */)
        // );
    }, [value])

    return (
        <div className='item-container first'>
            <span>{title}</span>
            <div className='img-container'>
                {value ? <img id='my-image' src={value} alt='' /> : null}
            </div>
        </div>
    )
}

export default UploadPreviewer
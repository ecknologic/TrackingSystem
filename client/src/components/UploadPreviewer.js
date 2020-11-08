import React from 'react';
import '../sass/uploadPreviewer.scss'

const UploadPreviewer = ({ data = [] }) => {

    const [item1, item2] = data

    return (
        <div className='upload-preview-container'>
            <div className='item-container first'>
                <span>Front</span>
                <div className='img-container'>
                    {item1 ? <img src={item1} alt='' /> : null}

                </div>
            </div>
            <div className='item-container'>
                <span>Back</span>
                <div className='img-container'>
                    {item2 ? <img src={item2} alt='' /> : null}
                </div>
            </div>
        </div>
    )
}

export default UploadPreviewer
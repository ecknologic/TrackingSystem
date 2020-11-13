import React from 'react';
import { Modal } from 'antd';
import CustomButton from './CustomButton';

const PreviewModal = ({ visible, data, onCancel }) => {
    return <Modal
        centered
        className='app-preview-modal'
        title="Preview"
        visible={visible}
        onOk={onCancel}
        onCancel={onCancel}
        footer={<>
            <CustomButton
                className='app-cancel-btn footer-btn'
                text='Cancel'
                onClick={onCancel}
            />

            <CustomButton
                onClick={onCancel}
                className={`app-create-btn right-btn`}
                text='Close'
            />
        </>}
    >
        <img width={'100%'} src={data} alt='' />
    </Modal>
}

export default PreviewModal
import React from 'react';
import { Modal } from 'antd';
import CustomButton from './CustomButton';
import { CrossIconDark } from './SVG_Icons';

const PreviewModal = ({ visible, data, onCancel }) => {
    return <Modal
        centered
        closeIcon={<CrossIconDark />}
        className='app-preview-modal'
        title="Preview"
        visible={visible}
        onOk={onCancel}
        onCancel={onCancel}
        footer={<>
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
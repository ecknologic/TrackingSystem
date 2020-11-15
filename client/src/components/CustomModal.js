import React from 'react';
import { Modal } from 'antd';
import CustomButton from './CustomButton';
import { CrossIcon } from './SVG_Icons';

const CustomModal = (props) => {
    const { visible, title, btnTxt, onCancel, onOk, btnDisabled, className, children } = props
    return (
        <Modal
            centered
            title={title}
            visible={visible}
            onCancel={onCancel}
            closeIcon={<CrossIcon />}
            className={className}
            footer={(
                <>
                    <CustomButton
                        className='app-cancel-btn footer-btn'
                        text='Cancel'
                        onClick={onCancel}
                    />

                    <CustomButton
                        onClick={onOk}
                        className={`app-create-btn right-btn ${btnDisabled && 'disabled'}`}
                        text={btnTxt}
                    />
                </>
            )}
        >
            {children}
        </Modal>
    )
}

export default CustomModal
import { Modal } from 'antd';
import React from 'react';
import CustomButton from './CustomButton';
import { CrossIcon } from './SVG_Icons';

const CustomModal = (props) => {
    const { visible, title, okTxt, hideCancel, cancelTxt, onCancel, onOk, onOther, btnDisabled, className, children } = props

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
                        onClick={onOk}
                        className={`right-btn ${btnDisabled && 'disabled'}`}
                        text={okTxt}
                    />
                    {
                        !hideCancel && <CustomButton
                            className='app-cancel-btn footer-btn'
                            text={cancelTxt || 'Cancel'}
                            onClick={cancelTxt ? onOther : onCancel}
                        />
                    }
                </>
            )}
        >
            {children}
        </Modal>
    )
}

export default CustomModal
import { Modal } from 'antd';
import React, { useEffect } from 'react';
import CustomButton from './CustomButton';
import { CrossIcon } from './SVG_Icons';
import { resetTrackForm, trackAccountFormOnce } from '../utils/Functions';

const CustomModal = (props) => {
    const { visible, title, track, okTxt, cancelTxt, onCancel, onOk, onOther, btnDisabled, className, children } = props

    useEffect(() => {
        if (track) {
            if (visible) {
                resetTrackForm()
                trackAccountFormOnce()
            } else resetTrackForm()
        }

        return () => {
            track && resetTrackForm()
        }
    }, [visible])

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
                        text={cancelTxt || 'Cancel'}
                        onClick={cancelTxt ? onOther : onCancel}
                    />

                    <CustomButton
                        onClick={onOk}
                        className={`app-create-btn right-btn ${btnDisabled && 'disabled'}`}
                        text={okTxt}
                    />
                </>
            )}
        >
            {children}
        </Modal>
    )
}

export default CustomModal
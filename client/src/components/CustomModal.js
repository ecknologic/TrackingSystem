import { Modal } from 'antd';
import React, { useEffect } from 'react';
import CustomButton from './CustomButton';
import { CrossIcon } from './SVG_Icons';
import { removeFormTracker, resetTrackForm, trackAccountFormOnce } from '../utils/Functions';

const CustomModal = (props) => {
    const { visible, title, track, okTxt, hideCancel, cancelTxt, onCancel, onOk, onOther, btnDisabled, className, children } = props

    useEffect(() => {
        if (track) {
            if (visible) {
                resetTrackForm()
                trackAccountFormOnce()
            } else resetTrackForm()
        }

        return () => {
            if (track) {
                resetTrackForm()
                removeFormTracker()
            }
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
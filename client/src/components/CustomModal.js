import { Modal } from 'antd';
import React from 'react';
import CustomButton from './CustomButton';
import { CrossIconDark } from './SVG_Icons';

const CustomModal = (props) => {
    const { visible, title, okTxt, hideCancel, cancelTxt, onCancel, onOk, onOther, btnDisabled,
        showTwinBtn, className, children, twinTxt, onTwin, twinDisabled, bothDisabled } = props


    return (
        <Modal
            centered
            title={title}
            visible={visible}
            onCancel={onCancel}
            closeIcon={<CrossIconDark />}
            className={className}
            destroyOnClose
            footer={(
                <>
                    <div className='twin-btns'>
                        {
                            showTwinBtn &&
                            <CustomButton
                                onClick={onTwin}
                                className={`twin-btn ${(twinDisabled || bothDisabled) && 'disabled'}`}
                                text={twinTxt}
                            />
                        }
                        <CustomButton
                            onClick={onOk}
                            className={`right-btn ${(btnDisabled || bothDisabled) && 'disabled'}`}
                            text={okTxt}
                        />
                    </div>
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
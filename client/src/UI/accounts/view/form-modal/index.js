import React from 'react';
import { Button, Col, Row, Modal } from 'antd';
import Delivery from '../../add/forms/Delivery';
import CustomButton from '../../../../components/CustomButton';

const FormModal = (props) => {
    const { visible, title, btnTxt, onCancel, onOk, data, btnDisabled, routeOptions, devDays,
        onChange, onSelect, onDeselect } = props
    return (
        <Modal
            centered
            title={title}
            visible={visible}
            onCancel={onCancel}
            className='app-form-modal delivery-form-modal'
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
            <Delivery
                data={data}
                routeOptions={routeOptions}
                hasExtraAddress
                devDays={devDays}
                onChange={onChange}
                onSelect={onSelect}
                onDeselect={onDeselect}
            />
        </Modal>
    )
}

export default FormModal
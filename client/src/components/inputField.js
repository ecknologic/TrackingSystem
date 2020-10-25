import React, { useEffect } from 'react'
import { Col, Input, Form } from 'antd';

const FormItem = Form.Item;
const InputField = (props) => {
    const { disabled, placeholder, name, value, onChange, label, colSpan, offset, error } = props;
    useEffect(() => {
        console.log('[rrr', error)
    }, [props])
    return (
        <Col span={colSpan} offset={offset || 0}>
            <FormItem>
                <h5 className="form_modal_label">{label}</h5>
                <Input disabled={disabled} placeholder={placeholder} name={name} value={value} onChange={(e) => onChange(e)} />
            </FormItem>
            <p className='errMsg'>{error}</p>
        </Col>
    )
}
export default InputField;
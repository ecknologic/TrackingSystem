import React, { useEffect } from 'react';
import { Col, Select, Form } from 'antd'

const CustomSelectComponent = (props) => {
    useEffect(() => {

    }, [props])
    const { label, onChange, options, error, showSearch, value, colSpan, mode, className, placeholder, disabled, offset } = props
    return <Col span={colSpan} offset={offset || 0}>
        <Form.Item>
            <h5 className="form_modal_label">{label || ''}</h5>
            <Select style={{ width: '200' }}
                className={className || ''}
                placeholder={placeholder || "Please Select"}
                mode={mode || ''}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                showSearch={showSearch || false}
                value={value || undefined}
                disabled={disabled}
                optionFilterProp="children" onChange={onChange}>
                {options}
            </Select>
            <p className='errMsg'>{error}</p>
        </Form.Item>
    </Col>
}
export default CustomSelectComponent;
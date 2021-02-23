import { Input, Form, Select } from 'antd';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { validateIntFloat } from '../utils/validations';
import { DDownIcon } from './SVG_Icons';
const EditableContext = React.createContext(null);

export const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

export const EditableCell = ({ title, editable, children, dataIndex,
    record, onSave, inputType, options = [], ...restProps }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);

    useEffect(() => {
        if (editing && inputType !== 'select') {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            console.log('data Index Inside', dataIndex)
            toggleEdit();
            onSave({ ...record, ...values }, dataIndex);
        } catch (error) { }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        validator: async (rule, value) => {
                            let error = inputType !== 'select' ? validateIntFloat(value) : ''
                            if (value !== 0 && !value) error = 'Required'
                            else if (dataIndex === 'quantity' || dataIndex === 'productPrice') {
                                if (value == 0) error = 'Invalid'
                            }
                            else if (dataIndex === 'discount') {
                                if (value > 100) error = 'Invalid'
                            }
                            if (error) throw new Error(error)
                        }
                    },
                ]}
            >
                {
                    inputType === 'select' ? (
                        <Select
                            onBlur={save}
                            onSelect={save}
                            placeholder='Select'
                            suffixIcon={<DDownIcon />}
                            getPopupContainer={node => node.parentNode}
                        >
                            {options}
                        </Select>
                    )
                        : <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                }
            </Form.Item>
        ) : (
                <div
                    className="editable-cell-value-wrap"
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
    }

    return <td {...restProps}>{childNode}</td>;
};
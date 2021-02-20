import { Input, Form, Select } from 'antd';
import React, { useContext, useState, useEffect, useRef } from 'react';
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
    record, handleSave, inputType, options = [], ...restProps }) => {
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
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
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
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                {
                    inputType === 'select' ? (
                        <Select
                            placeholder='Select'
                            onSelect={save}
                            onBlur={save}
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
import React, { useMemo } from 'react';
import { Table, Popconfirm } from 'antd';
import InputValue from '../../../../components/InputValue';
import InputLabel from '../../../../components/InputLabel';
import { PlusIcon } from '../../../../components/SVG_Icons';
import CustomButton from '../../../../components/CustomButton';
import { EditableCell, EditableRow } from '../../../../components/EditableCell';

const ProductsTable = ({
    dataSource,
    productOptions,
    footerValues,
    GSTOptions,
    onDelete,
    errors,
    onAdd,
    onSave
}) => {

    const { subTotal, cgstAmount, sgstAmount, igstAmount, totalAmount } = footerValues
    const columns = useMemo(() => ([
        {
            title: 'Item Details',
            dataIndex: 'productName',
            width: '30%',
            editable: true,
            inputType: 'select',
            options: productOptions
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            editable: true
        },
        {
            title: 'Price',
            dataIndex: 'productPrice',
            editable: true,
        },
        {
            title: 'Discount (%)',
            dataIndex: 'discount',
            editable: true,
        },
        {
            title: 'Tax (%)',
            dataIndex: 'tax',
            editable: true,
            inputType: 'select',
            options: GSTOptions
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
        },
        {
            title: 'CGST',
            dataIndex: 'cgst',
        },
        {
            title: 'SGST',
            dataIndex: 'sgst',
        },
        {
            title: 'IGST',
            dataIndex: 'igst',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => onDelete(record.key)}>
                        <a>Delete</a>
                    </Popconfirm>
                ) : null,
        },
    ]), [GSTOptions, productOptions, dataSource])

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const columnsFinal = columns.map((col) => {
        const { editable, inputType, dataIndex, title, options } = col
        if (!editable) return col

        return {
            ...col,
            onCell: (record) => ({
                record, editable,
                inputType, dataIndex,
                title, options, onSave,
            }),
        };
    });


    return (
        <div className='product-table-container'>
            <InputLabel error={errors.products} />
            <Table
                pagination={false}
                className='app-table'
                components={components}
                rowClassName={() => 'editable-row'}
                dataSource={dataSource}
                columns={columnsFinal}
                scroll={{ x: true }}
            />
            <div className='table-footer-container'>
                <CustomButton onClick={onAdd} text='Add Another Item' className='app-add-new-btn' icon={<PlusIcon />} />
                <div className='table-footer'>
                    <div className='input-container'>
                        <InputValue size='smaller' value='Sub Total' />
                        <InputValue size='smaller' value={subTotal || 0} />
                    </div>
                    <div className='input-container'>
                        <InputValue size='smaller' value='CGST' />
                        <InputValue size='smaller' value={cgstAmount || 0} />
                    </div>
                    <div className='input-container'>
                        <InputValue size='smaller' value='SGST' />
                        <InputValue size='smaller' value={sgstAmount || 0} />
                    </div>
                    <div className='input-container'>
                        <InputValue size='smaller' value='IGST' />
                        <InputValue size='smaller' value={igstAmount || 0} />
                    </div>
                    <div className='input-container'>
                        <InputValue size='larger' value='Total (₹)' />
                        <InputValue size='larger' value={totalAmount || 0} />
                    </div>
                </div>
            </div>
        </div >
    );
}

export default ProductsTable
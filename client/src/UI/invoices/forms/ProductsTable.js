import React, { Component } from 'react';
import { Table, Popconfirm } from 'antd';
import InputValue from '../../../components/InputValue';
import { genderOptions } from '../../../assets/fixtures';
import { PlusIcon } from '../../../components/SVG_Icons';
import CustomButton from '../../../components/CustomButton';
import { EditableCell, EditableRow } from '../../../components/EditableCell';

class ProductsTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'Item Details',
                dataIndex: 'productName',
                width: '30%',
                editable: true,
                inputType: 'select',
                options: genderOptions
            },
            {
                title: 'Quantity',
                dataIndex: 'quantity',
                editable: true
            },
            {
                title: 'Rate',
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
                options: genderOptions
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
                    this.state.dataSource.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                            <a>Delete</a>
                        </Popconfirm>
                    ) : null,
            },
        ];
        this.state = {
            dataSource: [{
                key: '0',
                productName: '',
                quantity: 1,
                productPrice: 0,
                discount: 0,
                tax: 18,
                amount: 28,
            }],
            count: 0,
        };
    }

    handleDelete = (key) => {
        const dataSource = [...this.state.dataSource];
        this.setState({
            dataSource: dataSource.filter((item) => item.key !== key),
        });
    };
    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            productName: '',
            quantity: 1,
            productPrice: 0,
            discount: 0,
            tax: 18,
            amount: 28,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    };
    handleSave = (row) => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        this.setState({
            dataSource: newData,
        });
    };

    render() {
        const { dataSource, totalAmount } = this.state;
        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: (record) => ({
                    record,
                    editable: col.editable,
                    inputType: col.inputType,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    options: col.options,
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <div className='product-table-container'>
                <Table
                    pagination={false}
                    className='app-table'
                    components={components}
                    rowClassName={() => 'editable-row'}
                    dataSource={dataSource}
                    columns={columns}
                />
                <div className='table-footer-container'>
                    <CustomButton onClick={this.handleAdd} text='Add Another Item' className='app-add-new-btn' icon={<PlusIcon />} />
                    <div className='table-footer'>
                        <div className='input-container'>
                            <InputValue size='smaller' value='Sub Total' />
                            <InputValue size='smaller' value={totalAmount || 0} />
                        </div>
                        <div className='input-container'>
                            <InputValue size='smaller' value='CGST' />
                            <InputValue size='smaller' value={totalAmount || 0} />
                        </div>
                        <div className='input-container'>
                            <InputValue size='smaller' value='SGST' />
                            <InputValue size='smaller' value={totalAmount || 0} />
                        </div>
                        <div className='input-container'>
                            <InputValue size='smaller' value='IGST' />
                            <InputValue size='smaller' value={totalAmount || 0} />
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
}

export default ProductsTable
import React, { Component } from 'react';
import { Table, Popconfirm } from 'antd';
import { genderOptions } from '../../../assets/fixtures';
import { PlusIcon } from '../../../components/SVG_Icons';
import CustomButton from '../../../components/CustomButton';
import { EditableCell, EditableRow } from '../../../components/EditableCell';
import InputLabel from '../../../components/InputLabel';
import InputValue from '../../../components/InputValue';

class ProductsTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'Item Details',
                dataIndex: 'name',
                width: '30%',
                editable: true,
                inputType: 'select',
                options: genderOptions
            },
            {
                title: 'Quantity',
                dataIndex: 'qty',
                editable: true,
            },
            {
                title: 'Rate',
                dataIndex: 'rate',
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
            },
            {
                title: 'Amount',
                dataIndex: 'amount',
                editable: true,
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
                name: '',
                qty: 1,
                rate: 0,
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
            name: '',
            qty: 1,
            rate: 0,
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
                <div className='table-footer'>
                    <CustomButton onClick={this.handleAdd} text='Add Another Item' className='app-add-new-btn' icon={<PlusIcon />} />
                    <div className='input-container'>
                        <InputLabel name='Total (₹)' />
                        <InputValue size='large' value={totalAmount || 0} />
                    </div>
                </div>
            </div >
        );
    }
}

export default ProductsTable
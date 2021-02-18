import { Table, Button, Popconfirm } from 'antd';
import React, { Component } from 'react';
import { EditableCell, EditableRow } from './EditableCell';

class EditableTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'Item Details',
                dataIndex: 'name',
                width: '30%',
                editable: true,
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
                title: 'Discount',
                dataIndex: 'discount',
                editable: true,
            },
            {
                title: 'Tax',
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
            dataSource: [
                {
                    key: '0',
                    name: 'Edward King 0',
                    age: '32',
                    address: 'London, Park Lane no. 0',
                },
                {
                    key: '1',
                    name: 'Edward King 1',
                    age: '32',
                    address: 'London, Park Lane no. 1',
                },
            ],
            count: 2,
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
            name: `Edward King ${count}`,
            age: '32',
            address: `London, Park Lane no. ${count}`,
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
        const { dataSource } = this.state;
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
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <div style={{ width: '100%' }}>
                <Table
                    pagination={false}
                    className='app-table'
                    components={components}
                    rowClassName={() => 'editable-row'}
                    dataSource={dataSource}
                    columns={columns}
                />
                <Button
                    onClick={this.handleAdd}
                    type="primary"
                    style={{
                        marginTop: 16,
                    }}
                >
                    Add a row
                </Button>
            </div >
        );
    }
}

export default EditableTable
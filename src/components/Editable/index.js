import React from 'react';
import { Table } from 'antd';
import { EditableFormRow, EditableCell } from '@/components/EditableCell';


export default class Editable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const { rows, columns, } = this.props;

        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        const columnss = columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.props.handleSave,
                }),
            };
        });

        return (
            <Table
                rowKey={record => record.index}
                columns={columnss}
                dataSource={rows}
                components={components}
                rowClassName={() => 'editable-row'}
                pagination={false}
            />
        )
    }
}
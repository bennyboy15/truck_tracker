import React from 'react';
import { Table, Card, Typography } from 'antd';
const { Title } = Typography;

function TruckMakeTable({ columns, data, isPending }) {
    return (
        <div style={{ padding: '20px' }}>
            <Card>
                <Title level={2}>Truck Makes</Title>
                <Table
                    dataSource={data}
                    columns={columns}
                    loading={isPending}
                    rowKey="code"
                />
            </Card>
        </div>
    )
}

export default TruckMakeTable
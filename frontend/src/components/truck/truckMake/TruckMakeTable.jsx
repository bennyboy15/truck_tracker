import React from 'react';
import { Table, Card, Typography, Alert } from 'antd';
import axiosInstance from '../../../utils/axios';
import { useQuery } from '@tanstack/react-query';
const { Title } = Typography;

function TruckMakeTable() {

    // GET ALL TRUCK MAKES
    const { isPending, error, data: truckMakes } = useQuery({
        queryKey: ['truckMakes'],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/truck_make");
            return data;
        }
    });

    const truckMakeColumns = [
        {
            title: 'Make Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
        },
    ];

    if (error) return <Alert title="Error" description={error.message} type="error" showIcon />;

    return (
        <Card>
            <Title level={2}>Truck Makes</Title>
            <Table
                dataSource={truckMakes}
                columns={truckMakeColumns}
                loading={isPending}
                rowKey="code"
            />
        </Card>
    )
}

export default TruckMakeTable
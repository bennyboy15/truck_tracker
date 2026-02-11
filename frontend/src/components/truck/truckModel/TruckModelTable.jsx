import React from 'react';
import { Table, Card, Typography, Alert } from 'antd';
import axiosInstance from '../../../utils/axios';
import { useQuery } from '@tanstack/react-query';
const { Title } = Typography;

function TruckModelTable() {

    // GET ALL TRUCK MODELS
    const { isPending, error, data: truckModels } = useQuery({
        queryKey: ['truckModels'],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/truck_model");
            return data;
        }
    });

    const truckMakeColumns = [
        {
            title: 'Model Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Make',
            dataIndex: 'make',
            key: 'make',
            render: (make) => {
                return make?.name || 'N/A';
            },
        },
    ];

    if (error) return <Alert title="Error" description={error.message} type="error" showIcon />;

    return (
        <Card>
            <Title level={2}>Truck Models</Title>
            <Table
                dataSource={truckModels}
                columns={truckMakeColumns}
                loading={isPending}
                rowKey="category"
            />
        </Card>
    )
}

export default TruckModelTable
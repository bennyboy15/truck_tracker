import React from 'react';
import { Table, Card, Typography, Alert, Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axiosInstance from '../../../utils/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const { Title } = Typography;

function TruckModelTable() {
    const queryClient = useQueryClient();

    const { isPending, error, data: truckModels } = useQuery({
        queryKey: ['truckModels'],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/truck_model");
            return data;
        }
    });

    const { mutate: deleteTruckModel } = useMutation({
        mutationFn: async (id) => {
            const { data } = await axiosInstance.delete(`/truck_model/${id}`);
            return data;
        },
        onSuccess: () => {
            toast.success("Truck model deleted");
            queryClient.invalidateQueries({ queryKey: ['truckModels'] });
        },
        onError: (err) => toast.error(err.response?.data?.message || err.message),
    });

    const truckModelColumns = [
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
            render: (make) => make?.name || 'N/A',
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 80,
            render: (_, record) => (
                <Popconfirm
                    title="Delete this model?"
                    onConfirm={() => deleteTruckModel(record._id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
        },
    ];

    if (error) return <Alert message="Error" description={error.message} type="error" showIcon />;

    return (
        <Card>
            <Title level={4}>Truck Models</Title>
            <Table
                dataSource={truckModels}
                columns={truckModelColumns}
                loading={isPending}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
            />
        </Card>
    )
}

export default TruckModelTable
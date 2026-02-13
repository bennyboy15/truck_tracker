import React from 'react';
import { Table, Card, Typography, Alert, Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axiosInstance from '../../../utils/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const { Title } = Typography;

function TruckMakeTable() {
    const queryClient = useQueryClient();

    const { isPending, error, data: truckMakes } = useQuery({
        queryKey: ['truckMakes'],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/truck_make");
            return data;
        }
    });

    const { mutate: deleteTruckMake } = useMutation({
        mutationFn: async (id) => {
            const { data } = await axiosInstance.delete(`/truck_make/${id}`);
            return data;
        },
        onSuccess: () => {
            toast.success("Truck make deleted");
            queryClient.invalidateQueries({ queryKey: ['truckMakes'] });
        },
        onError: (err) => toast.error(err.response?.data?.message || err.message),
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
        {
            title: 'Actions',
            key: 'actions',
            width: 80,
            render: (_, record) => (
                <Popconfirm
                    title="Delete this make?"
                    onConfirm={() => deleteTruckMake(record._id)}
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
            <Title level={4}>Truck Makes</Title>
            <Table
                dataSource={Array.isArray(truckMakes) ? truckMakes : []}
                columns={truckMakeColumns}
                loading={isPending}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
            />
        </Card>
    )
}

export default TruckMakeTable
import React from 'react';
import { Table, Card, Typography, Alert, Button, Popconfirm } from 'antd';
import axiosInstance from '../../utils/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DeleteOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';

const { Title } = Typography;

function CustomerTable() {
    const queryClient = useQueryClient();

    const { isPending, error, data: customers } = useQuery({
        queryKey: ['customers'],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/customer");
            return data;
        }
    });

    const { mutate: deleteCustomer, isPending: isDeleting } = useMutation({
        mutationFn: async (id) => {
            const { data } = await axiosInstance.delete(`/customer/${id}`);
            return data;
        },
        onSuccess: () => {
            toast.success("Customer deleted");
            queryClient.invalidateQueries({ queryKey: ['customers'] });
        },
        onError: (err) => toast.error(err.response?.data?.message || err.message),
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (_, record) => (
                <Popconfirm
                    title="Delete this customer?"
                    onConfirm={() => deleteCustomer(record._id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="text" danger icon={<DeleteOutlined />} loading={isDeleting} />
                </Popconfirm>
            ),
        },
    ];

    if (error) return <Alert message="Error" description={error.message} type="error" showIcon />;

    return (
        <Card>
            <Title level={4}>Customers</Title>
            <Table
                dataSource={Array.isArray(customers) ? customers : []}
                columns={columns}
                loading={isPending}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
            />
        </Card>
    );
}

export default CustomerTable;

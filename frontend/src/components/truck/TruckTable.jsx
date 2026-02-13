import React, { useState } from 'react';
import { Table, Card, Typography, Alert, Button, Popconfirm, Modal, Input, Select } from 'antd';
import axiosInstance from '../../utils/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';

const { Title } = Typography;

function TruckTable() {
    const queryClient = useQueryClient();
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    const { isPending, error, data: trucks } = useQuery({
        queryKey: ['trucks'],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/truck");
            return data;
        }
    });

    const { data: truckModels } = useQuery({
        queryKey: ['truckModels'],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/truck_model");
            return data;
        }
    });

    const { data: customers } = useQuery({
        queryKey: ['customers'],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/customer");
            return data;
        }
    });

    const { mutate: deleteTruck, isPending: isDeleting } = useMutation({
        mutationFn: async (id) => {
            const { data } = await axiosInstance.delete(`/truck/${id}`);
            return data;
        },
        onSuccess: () => {
            toast.success("Truck deleted");
            queryClient.invalidateQueries({ queryKey: ['trucks'] });
        },
        onError: (err) => toast.error(err.response?.data?.message || err.message),
    });

    const { mutate: updateTruck, isPending: isUpdating } = useMutation({
        mutationFn: async ({ id, payload }) => {
            const { data } = await axiosInstance.put(`/truck/${id}`, payload);
            return data;
        },
        onSuccess: () => {
            toast.success("Truck updated");
            queryClient.invalidateQueries({ queryKey: ['trucks'] });
            setEditingId(null);
            setEditForm({});
        },
        onError: (err) => toast.error(err.response?.data?.message || err.message),
    });

    const openEdit = (record) => {
        setEditingId(record._id);
        setEditForm({
            model: record.model?._id || record.model,
            customer: record.customer?._id || record.customer,
            salesman: record.salesman?._id || record.salesman,
            chassis: record.chassis,
            stock: record.stock,
            registration: record.registration,
        });
    };

    const columns = [
        { title: 'Chassis', dataIndex: 'chassis', key: 'chassis', width: 100 },
        { title: 'Stock', dataIndex: 'stock', key: 'stock', width: 100 },
        { title: 'Registration', dataIndex: 'registration', key: 'registration' },
        {
            title: 'Model',
            dataIndex: 'model',
            key: 'model',
            render: (m) => (typeof m === 'object' && m?.name) ? m.name : m || '—',
        },
        {
            title: 'Customer',
            dataIndex: 'customer',
            key: 'customer',
            render: (c) => (typeof c === 'object' && c?.name) ? c.name : c || '—',
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <>
                    <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record)} />
                    <Popconfirm
                        title="Delete this truck?"
                        onConfirm={() => deleteTruck(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </>
            ),
        },
    ];

    if (error) return <Alert message="Error" description={error.message} type="error" showIcon />;

    return (
        <>
            <Card>
                <Title level={4}>Trucks</Title>
                <Table
                    dataSource={Array.isArray(trucks) ? trucks : []}
                    columns={columns}
                    loading={isPending}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title="Edit Truck"
                open={!!editingId}
                onCancel={() => { setEditingId(null); setEditForm({}); }}
                onOk={() => updateTruck({ id: editingId, payload: editForm })}
                confirmLoading={isUpdating}
                okText="Save"
            >
                <div className="flex flex-col gap-2 pt-2">
                    <label>Model</label>
                    <Select
                        value={editForm.model}
                        onChange={(v) => setEditForm((p) => ({ ...p, model: v }))}
                        options={truckModels?.map((m) => ({ value: m._id, label: m.name }))}
                        placeholder="Select model"
                        allowClear
                        style={{ width: '100%' }}
                    />
                    <label>Customer</label>
                    <Select
                        value={editForm.customer}
                        onChange={(v) => setEditForm((p) => ({ ...p, customer: v }))}
                        options={customers?.map((c) => ({ value: c._id, label: c.name }))}
                        placeholder="Select customer"
                        allowClear
                        style={{ width: '100%' }}
                    />
                    <label>Salesman (User ID)</label>
                    <Input
                        value={editForm.salesman}
                        onChange={(e) => setEditForm((p) => ({ ...p, salesman: e.target.value }))}
                        placeholder="User ID"
                    />
                    <label>Chassis</label>
                    <Input
                        type="number"
                        value={editForm.chassis}
                        onChange={(e) => setEditForm((p) => ({ ...p, chassis: e.target.value ? Number(e.target.value) : undefined }))}
                    />
                    <label>Stock</label>
                    <Input
                        value={editForm.stock}
                        onChange={(e) => setEditForm((p) => ({ ...p, stock: e.target.value }))}
                    />
                    <label>Registration</label>
                    <Input
                        value={editForm.registration}
                        onChange={(e) => setEditForm((p) => ({ ...p, registration: e.target.value }))}
                    />
                </div>
            </Modal>
        </>
    );
}

export default TruckTable;

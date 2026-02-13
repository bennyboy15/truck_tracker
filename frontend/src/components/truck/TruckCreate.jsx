import React, { useState } from 'react';
import { Button, Input, Card, Select } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../utils/axios';
import toast from 'react-hot-toast';

function TruckCreate() {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        model: undefined,
        customer: undefined,
        salesman: '',
        chassis: '',
        stock: '',
        registration: '',
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

    const { isPending: isSaving, mutate: createTruck } = useMutation({
        mutationFn: async (payload) => {
            const { data } = await axiosInstance.post("/truck", payload);
            return data;
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || error.message);
        },
        onSuccess: () => {
            toast.success("Truck created");
            queryClient.invalidateQueries({ queryKey: ['trucks'] });
            setFormData({
                model: undefined,
                customer: undefined,
                salesman: '',
                chassis: '',
                stock: '',
                registration: '',
            });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const { model, customer, salesman, chassis, stock, registration } = formData;
        if (!model || !customer || !salesman?.trim() || chassis === '' || !stock?.trim() || !registration?.trim()) {
            return toast.error("Fill all required fields (model, customer, salesman, chassis, stock, registration)");
        }
        createTruck({
            model,
            customer,
            salesman: salesman.trim(),
            chassis: Number(chassis),
            stock: stock.trim(),
            registration: registration.trim(),
        });
    };

    return (
        <Card>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <Select
                    placeholder="Select model"
                    value={formData.model}
                    onChange={(v) => setFormData((p) => ({ ...p, model: v }))}
                    options={truckModels?.map((m) => ({ value: m._id, label: m.name }))}
                    allowClear
                    style={{ width: '100%' }}
                />
                <Select
                    placeholder="Select customer"
                    value={formData.customer}
                    onChange={(v) => setFormData((p) => ({ ...p, customer: v }))}
                    options={customers?.map((c) => ({ value: c._id, label: c.name }))}
                    allowClear
                    style={{ width: '100%' }}
                />
                <Input
                    placeholder="Salesman (User ID)"
                    value={formData.salesman}
                    onChange={(e) => setFormData((p) => ({ ...p, salesman: e.target.value }))}
                />
                <Input
                    type="number"
                    placeholder="Chassis"
                    value={formData.chassis}
                    onChange={(e) => setFormData((p) => ({ ...p, chassis: e.target.value }))}
                />
                <Input
                    placeholder="Stock"
                    value={formData.stock}
                    onChange={(e) => setFormData((p) => ({ ...p, stock: e.target.value }))}
                />
                <Input
                    placeholder="Registration"
                    value={formData.registration}
                    onChange={(e) => setFormData((p) => ({ ...p, registration: e.target.value }))}
                />
                <Button type="primary" htmlType="submit" loading={isSaving}>
                    {isSaving ? "Saving..." : "Add Truck"}
                </Button>
            </form>
        </Card>
    );
}

export default TruckCreate;

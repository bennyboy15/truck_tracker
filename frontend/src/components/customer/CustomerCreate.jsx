import React, { useState } from 'react';
import { Button, Input, Card } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../utils/axios';
import toast from 'react-hot-toast';

function CustomerCreate() {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({ name: '', email: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const { isPending: isSaving, mutate: createCustomer } = useMutation({
        mutationFn: async (payload) => {
            const { data } = await axiosInstance.post("/customer", payload);
            return data;
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || error.message);
        },
        onSuccess: () => {
            toast.success("Customer created");
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            setFormData({ name: '', email: '' });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name?.trim()) return toast.error("Name is required");
        createCustomer(formData);
    };

    return (
        <Card>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <Input
                    name="name"
                    placeholder="Customer name..."
                    value={formData.name}
                    onChange={handleInputChange}
                />
                <Input
                    name="email"
                    type="email"
                    placeholder="Email (optional)..."
                    value={formData.email}
                    onChange={handleInputChange}
                />
                <Button type="primary" htmlType="submit" loading={isSaving}>
                    {isSaving ? "Saving..." : "Add Customer"}
                </Button>
            </form>
        </Card>
    );
}

export default CustomerCreate;

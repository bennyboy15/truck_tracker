import React, { useState } from 'react';
import { Button, Input, Card } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../utils/axios';
import toast from 'react-hot-toast';

function TechnicianCreate() {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({ name: '', techNo: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const finalValue = name === 'techNo' ? (value === '' ? '' : Number(value)) : value;
        setFormData((prev) => ({ ...prev, [name]: finalValue }));
    };

    const { isPending: isSaving, mutate: createTechnician } = useMutation({
        mutationFn: async (payload) => {
            const { data } = await axiosInstance.post("/technician", payload);
            return data;
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || error.message);
        },
        onSuccess: () => {
            toast.success("Technician created");
            queryClient.invalidateQueries({ queryKey: ['technicians'] });
            setFormData({ name: '', techNo: '' });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name?.trim()) return toast.error("Name is required");
        createTechnician({ name: formData.name, techNo: formData.techNo || undefined });
    };

    return (
        <Card>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <Input
                    name="name"
                    placeholder="Technician name..."
                    value={formData.name}
                    onChange={handleInputChange}
                />
                <Input
                    name="techNo"
                    type="number"
                    placeholder="Tech number (optional)..."
                    value={formData.techNo}
                    onChange={handleInputChange}
                />
                <Button type="primary" htmlType="submit" loading={isSaving}>
                    {isSaving ? "Saving..." : "Add Technician"}
                </Button>
            </form>
        </Card>
    );
}

export default TechnicianCreate;

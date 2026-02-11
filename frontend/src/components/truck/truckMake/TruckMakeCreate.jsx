import React, { useState } from 'react'
import { Button, Input, Card } from "antd";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../utils/axios.js';
import toast from 'react-hot-toast';

function TruckMakeCreate() {

    const queryClient = useQueryClient();


    const [formData, setFormData] = useState({
        name: "",
        code: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,          // Keep all existing fields
            [name]: value     // Update only the one that changed
        }));
    };

    // CREATE TRUCK MAKE
    const { isPending: isSaving, mutate: createTruckMake } = useMutation({
        mutationFn: async (newMake) => {
            const { data } = await axiosInstance.post("/truck_make", newMake);
            return data;
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || error.message);
        },
        onSuccess: () => {
            toast.success("Successfully created Truck Make");
            queryClient.invalidateQueries({ queryKey: ['truckMakes'] });
            setFormData({ name: "", code: "" });
        }
    });


    const handleSubmit = (e) => {
        e.preventDefault(); // STOP the page refresh
        if (!formData.name || !formData.code) return toast.error("Please fill all fields");
        createTruckMake(formData);
    };

    return (
        <Card>
            <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
                <Input variant={'underlined'} type="text" name="name" placeholder='Make name...' value={formData.name} onChange={handleInputChange} />
                <Input variant={'underlined'} type="text" name="code" placeholder='Code...' value={formData.code} onChange={handleInputChange} />
                <Button type="primary" htmlType="submit" loading={isSaving}>{isSaving ? "Saving..." : "SUBMIT"}</Button>
            </form>
        </Card>
    )
}

export default TruckMakeCreate
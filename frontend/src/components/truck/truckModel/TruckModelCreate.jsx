import React, { useState } from 'react'
import { Button, Input, Card, Select, Space } from "antd";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../utils/axios.js';
import toast from 'react-hot-toast';

function TruckModelCreate() {

    const queryClient = useQueryClient();


    const [formData, setFormData] = useState({
        name: "",
        category: "",
        make: ""
    });

    const handleInputChange = (value, name) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // GET ALL TRUCK MAKES
    const { isPending, error, data: truckMakes } = useQuery({
        queryKey: ['truckMakes'],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/truck_make");
            return data;
        }
    });

    const selectOptions = truckMakes?.map((item) => ({
        value: item._id,
        label: item.name
    }));

    // CREATE TRUCK MODEL
    const { isPending: isSaving, mutate: createTruckModel } = useMutation({
        mutationFn: async (newModel) => {
            const { data } = await axiosInstance.post("/truck_model", newModel);
            return data;
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || error.message);
        },
        onSuccess: () => {
            toast.success("Successfully created Truck Model");
            queryClient.invalidateQueries({ queryKey: ['truckModels'] });
            setFormData({ name: "", category: "", make: "" });
        }
    });


    const handleSubmit = (e) => {
        e.preventDefault(); // STOP the page refresh
        console.log(formData);
        if (!formData.name || !formData.category || !formData.make) return toast.error("Please fill all fields");
        createTruckModel(formData);
    };

    return (
        <Card>
            <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
                <Input variant={'underlined'} type="text" name="name" placeholder='Model name...' value={formData.name} onChange={handleInputChange} />
                <Input variant={'underlined'} type="text" name="category" placeholder='Category...' value={formData.category} onChange={handleInputChange} />
                <Space wrap>
                    <Select
                        defaultValue="KW"
                        className='w-40'
                        disabled={isPending}
                        allowClear
                        name="make"
                        onChange={(value) => handleInputChange(value, "make")}
                        options={selectOptions}
                        placeholder="Select make..."
                    />
                </Space>
                <Button type="primary" htmlType="submit" loading={isSaving}>{isSaving ? "Saving..." : "SUBMIT"}</Button>
            </form>
        </Card>
    )
}

export default TruckModelCreate
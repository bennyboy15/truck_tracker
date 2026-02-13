import React from 'react';
import { Table, Card, Typography, Alert } from 'antd';
import axiosInstance from '../../utils/axios';
import { useQuery } from '@tanstack/react-query';

const { Title } = Typography;

function TechnicianTable() {
    const { isPending, error, data: technicians } = useQuery({
        queryKey: ['technicians'],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/technician");
            return data;
        }
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
        },
        {
            title: 'Tech No',
            dataIndex: 'techNo',
            key: 'techNo',
            width: 120,
        },
    ];

    if (error) return <Alert message="Error" description={error.message} type="error" showIcon />;

    return (
        <Card>
            <Title level={4}>Technicians</Title>
            <Table
                dataSource={Array.isArray(technicians) ? technicians : []}
                columns={columns}
                loading={isPending}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
            />
        </Card>
    );
}

export default TechnicianTable;

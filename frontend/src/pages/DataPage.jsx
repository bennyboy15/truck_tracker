import React, { useState, useMemo } from 'react';
import { Tabs, Row, Col } from 'antd';
import { UserOutlined, ToolOutlined, CarOutlined, ApartmentOutlined, DatabaseOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axios';
import {
    PageLayout,
    PageHeader,
    SectionCard,
    StatCard,
} from '../components/ui';
import TruckMakeTable from '../components/truck/truckMake/TruckMakeTable.jsx';
import TruckMakeCreate from '../components/truck/truckMake/TruckMakeCreate.jsx';
import TruckModelTable from '../components/truck/truckModel/TruckModelTable.jsx';
import TruckModelCreate from '../components/truck/truckModel/TruckModelCreate.jsx';
import CustomerTable from '../components/customer/CustomerTable.jsx';
import CustomerCreate from '../components/customer/CustomerCreate.jsx';
import TechnicianTable from '../components/technician/TechnicianTable.jsx';
import TechnicianCreate from '../components/technician/TechnicianCreate.jsx';
import TruckTable from '../components/truck/TruckTable.jsx';
import TruckCreate from '../components/truck/TruckCreate.jsx';

function useCount(endpoint, queryKey) {
    const { data, isLoading } = useQuery({
        queryKey: [queryKey, 'count'],
        queryFn: async () => {
            const { data: list } = await axiosInstance.get(endpoint);
            return Array.isArray(list) ? list.length : 0;
        },
    });
    const count = typeof data === 'number' ? data : 0;
    return { count, isLoading };
}

function DataPage() {
    const [activeKey, setActiveKey] = useState('customers');

    const customers = useCount('/customer', 'customers');
    const technicians = useCount('/technician', 'technicians');
    const truckMakes = useCount('/truck_make', 'truckMakes');
    const truckModels = useCount('/truck_model', 'truckModels');
    const trucks = useCount('/truck', 'trucks');

    const tabItems = useMemo(
        () => [
            {
                key: 'customers',
                label: 'Customers',
                children: (
                    <div className="flex flex-col gap-6" key="customers">
                        <CustomerTable />
                        <CustomerCreate />
                    </div>
                ),
            },
            {
                key: 'technicians',
                label: 'Technicians',
                children: (
                    <div className="flex flex-col gap-6" key="technicians">
                        <TechnicianTable />
                        <TechnicianCreate />
                    </div>
                ),
            },
            {
                key: 'truck_makes',
                label: 'Truck Makes',
                children: (
                    <div className="flex flex-col gap-6" key="truck_makes">
                        <TruckMakeTable />
                        <TruckMakeCreate />
                    </div>
                ),
            },
            {
                key: 'truck_models',
                label: 'Truck Models',
                children: (
                    <div className="flex flex-col gap-6" key="truck_models">
                        <TruckModelTable />
                        <TruckModelCreate />
                    </div>
                ),
            },
            {
                key: 'trucks',
                label: 'Trucks',
                children: (
                    <div className="flex flex-col gap-6" key="trucks">
                        <TruckTable />
                        <TruckCreate />
                    </div>
                ),
            },
        ],
        []
    );

    return (
        <PageLayout>
            <PageHeader
                title="Data"
                subtitle="Manage customers, technicians, truck makes and models, and fleet."
                breadcrumbs={[
                    { title: 'Home', path: '/' },
                    { title: 'Data' },
                ]}
            />

            <div className="mb-6">
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <StatCard
                            icon={<UserOutlined />}
                            value={customers.isLoading ? '—' : customers.count}
                            label="Customers"
                            color="primary"
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <StatCard
                            icon={<ToolOutlined />}
                            value={technicians.isLoading ? '—' : technicians.count}
                            label="Technicians"
                            color="blue"
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <StatCard
                            icon={<ApartmentOutlined />}
                            value={truckMakes.isLoading ? '—' : truckMakes.count}
                            label="Truck makes"
                            color="amber"
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <StatCard
                            icon={<DatabaseOutlined />}
                            value={truckModels.isLoading ? '—' : truckModels.count}
                            label="Truck models"
                            color="violet"
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <StatCard
                            icon={<CarOutlined />}
                            value={trucks.isLoading ? '—' : trucks.count}
                            label="Trucks"
                            color="primary"
                        />
                    </Col>
                </Row>
            </div>

            <SectionCard>
                <Tabs
                    activeKey={activeKey}
                    onChange={setActiveKey}
                    items={tabItems}
                    size="large"
                    destroyOnHidden={false}
                />
            </SectionCard>
        </PageLayout>
    );
}

export default DataPage;

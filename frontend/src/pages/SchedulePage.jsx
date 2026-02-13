import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
    Input,
    Tabs,
    Card,
    Button,
    Typography,
    Space,
    Tag,
    Alert,
    Select,
    Modal,
    DatePicker,
    Popconfirm,
} from "antd";
import {
    SearchOutlined,
    PlusOutlined,
    FileTextOutlined,
    CalendarOutlined,
    SwapOutlined,
    DeleteOutlined,
    RightOutlined,
} from "@ant-design/icons";
import axiosInstance from "../utils/axios";
import { PageLayout, PageHeader, EmptyState } from "../components/ui";
import toast from "react-hot-toast";
import dayjs from "dayjs";

const { Text } = Typography;

const STATUS_OPTIONS = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "upcoming", label: "Upcoming" },
    { key: "completed", label: "Completed" },
];

function toTruckPayload(truck, overrides = {}) {
    const id = (ref) => (ref && typeof ref === "object" && ref._id ? ref._id : ref);
    return {
        model: id(truck.model),
        customer: id(truck.customer),
        salesman: id(truck.salesman),
        chassis: truck.chassis,
        stock: truck.stock ?? "",
        registration: truck.registration ?? "",
        status: truck.status,
        deliveryDate: truck.deliveryDate,
        ...overrides,
    };
}

function SchedulePage() {
    const queryClient = useQueryClient();
    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [selectedTruck, setSelectedTruck] = useState(null);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState(null);
    const [pendingDeliveryDate, setPendingDeliveryDate] = useState(null);

    const queryStatus = statusFilter === "all" ? undefined : statusFilter;
    const { data: trucks = [], isPending, error } = useQuery({
        queryKey: ["trucks", queryStatus],
        queryFn: async () => {
            const url = queryStatus ? `/truck?status=${queryStatus}` : "/truck";
            const { data } = await axiosInstance.get(url);
            return data;
        },
    });

    const filteredTrucks = useMemo(() => {
        if (!search.trim()) return trucks;
        const q = search.trim().toLowerCase();
        return trucks.filter(
            (t) =>
                (t.customer?.name ?? "").toLowerCase().includes(q) ||
                (t.stock ?? "").toLowerCase().includes(q) ||
                String(t.chassis ?? "").toLowerCase().includes(q) ||
                (t.model?.name ?? "").toLowerCase().includes(q)
        );
    }, [trucks, search]);

    const updateTruckMutation = useMutation({
        mutationFn: async ({ id, payload }) => {
            const { data } = await axiosInstance.put(`/truck/${id}`, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trucks"] });
            toast.success("Truck updated");
            setStatusModalOpen(false);
            setDeliveryModalOpen(false);
            setPendingStatus(null);
            setPendingDeliveryDate(null);
            if (selectedTruck) {
                queryClient.invalidateQueries({ queryKey: ["truck", selectedTruck._id] });
            }
        },
        onError: (err) => toast.error(err.response?.data?.message || err.message),
    });

    const deleteTruckMutation = useMutation({
        mutationFn: async (id) => {
            const { data } = await axiosInstance.delete(`/truck/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trucks"] });
            setSelectedTruck(null);
            toast.success("Truck deleted");
        },
        onError: (err) => toast.error(err.response?.data?.message || err.message),
    });

    const handleChangeStatus = () => {
        if (!selectedTruck || !pendingStatus) return;
        updateTruckMutation.mutate({
            id: selectedTruck._id,
            payload: toTruckPayload(selectedTruck, { status: pendingStatus }),
        });
    };

    const handleChangeDeliveryDate = () => {
        if (!selectedTruck) return;
        updateTruckMutation.mutate({
            id: selectedTruck._id,
            payload: toTruckPayload(selectedTruck, {
                deliveryDate: pendingDeliveryDate ? pendingDeliveryDate.toISOString() : null,
            }),
        });
    };

    const customerName = selectedTruck?.customer?.name ?? "—";
    const makeName = selectedTruck?.model?.make?.name ?? "—";
    const modelName = selectedTruck?.model?.name ?? "—";

    return (
        <PageLayout maxWidth={false} style={{ padding: 0 }}>
            <PageHeader
                title="Schedule"
                subtitle="Overview trucks, select one for details and actions."
                breadcrumbs={[
                    { title: "Home", path: "/" },
                    { title: "Schedule" },
                ]}
            />

            <div className="flex flex-col lg:flex-row gap-4 p-4 lg:p-6 min-h-[calc(100vh-180px)]">
                {/* Left: Truck list */}
                <Card
                    className="lg:w-[380px] lg:min-w-[340px] lg:max-w-[420px] shrink-0 flex flex-col"
                    styles={{ body: { padding: 0, display: "flex", flexDirection: "column", flex: 1, minHeight: 0 } }}
                >
                    <div className="p-4 border-b border-neutral-200">
                        <Text strong className="block mb-2">
                            Truck List
                        </Text>
                        <Text type="secondary" className="text-xs block mb-3">
                            Select a truck for a detailed view
                        </Text>
                        <Tabs
                            activeKey={statusFilter}
                            onChange={setStatusFilter}
                            size="small"
                            items={STATUS_OPTIONS.map((o) => ({ key: o.key, label: o.label }))}
                        />
                        <Input
                            placeholder="Search by customer, stock or chassis..."
                            prefix={<SearchOutlined className="text-neutral-400" />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            allowClear
                            className="mt-3"
                        />
                    </div>
                    <div className="flex-1 overflow-auto p-2">
                        {error && (
                            <Alert message="Failed to load trucks" type="error" showIcon className="m-2" />
                        )}
                        {isPending && (
                            <div className="p-4 text-center text-neutral-500">Loading...</div>
                        )}
                        {!isPending && !error && filteredTrucks.length === 0 && (
                            <EmptyState
                                description="No trucks match the filters."
                                className="py-6"
                            />
                        )}
                        {!isPending && filteredTrucks.length > 0 && (
                            <div className="space-y-2">
                                {filteredTrucks.map((truck) => {
                                    const isSelected = selectedTruck?._id === truck._id;
                                    const customer = truck.customer?.name ?? "—";
                                    const modelLabel = truck.model?.name ?? "—";
                                    const stockChassis = [truck.stock, truck.chassis].filter(Boolean).join(" ");
                                    return (
                                        <Card
                                            key={truck._id}
                                            size="small"
                                            hoverable
                                            onClick={() => setSelectedTruck(truck)}
                                            className={`cursor-pointer transition-all ${
                                                isSelected
                                                    ? "ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/50"
                                                    : "hover:border-emerald-300"
                                            }`}
                                            styles={{ body: { padding: "12px 16px" } }}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <Text strong className="block truncate">
                                                        {customer}
                                                    </Text>
                                                    <Text type="secondary" className="text-xs block">
                                                        {modelLabel} · {stockChassis || "—"}
                                                    </Text>
                                                    {truck.status && truck.status !== "active" && (
                                                        <Tag color={truck.status === "completed" ? "green" : "blue"} className="mt-1">
                                                            {truck.status}
                                                        </Tag>
                                                    )}
                                                </div>
                                                <RightOutlined className="text-neutral-400 shrink-0" />
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </Card>

                {/* Right: Selected truck details */}
                <Card
                    className="flex-1 min-w-0 flex flex-col"
                    title={
                        selectedTruck
                            ? `Selected Truck Details — Stock #${selectedTruck.stock ?? "—"}`
                            : "Selected Truck Details"
                    }
                    styles={{ body: { flex: 1, minHeight: 0, overflow: "auto" } }}
                >
                    {!selectedTruck ? (
                        <EmptyState
                            description="Select a truck from the list to view details and actions."
                            label="View all trucks in Data"
                            onAction={() => (window.location.href = "/data")}
                        />
                    ) : (
                        <>
                            <div className="flex flex-wrap gap-2 mb-6">
                                <Link to="/data">
                                    <Button icon={<PlusOutlined />}>New Truck</Button>
                                </Link>
                                <Button icon={<FileTextOutlined />}>View Files</Button>
                                <Link to="/data">
                                    <Button type="primary" icon={<CalendarOutlined />}>
                                        Schedule
                                    </Button>
                                </Link>
                                <Button icon={<SwapOutlined />} onClick={() => setStatusModalOpen(true)}>
                                    Change Status
                                </Button>
                                <Popconfirm
                                    title="Delete this truck?"
                                    description="This action cannot be undone."
                                    onConfirm={() => deleteTruckMutation.mutate(selectedTruck._id)}
                                    okText="Delete"
                                    okButtonProps={{ danger: true }}
                                >
                                    <Button danger icon={<DeleteOutlined />}>
                                        Delete Truck
                                    </Button>
                                </Popconfirm>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <Section title="Customer & model">
                                    <Row label="Customer" value={customerName} />
                                    <Row label="Make" value={makeName} />
                                    <Row label="Model" value={modelName} />
                                </Section>

                                <Section title="Specifications">
                                    <Row label="Stock #" value={selectedTruck.stock ?? "—"} />
                                    <Row label="Chassis #" value={selectedTruck.chassis ?? "—"} />
                                    <Row label="Registration" value={selectedTruck.registration ?? "—"} />
                                    {selectedTruck.status && (
                                        <Row
                                            label="Status"
                                            value={
                                                <Tag color={selectedTruck.status === "completed" ? "green" : "blue"}>
                                                    {selectedTruck.status}
                                                </Tag>
                                            }
                                        />
                                    )}
                                </Section>
                            </div>

                            <Section title="Logistics" className="mt-6">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <Text type="secondary" className="text-xs">Delivery date</Text>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="font-medium">
                                                {selectedTruck.deliveryDate
                                                    ? dayjs(selectedTruck.deliveryDate).format("DD/MM/YYYY")
                                                    : "—"}
                                            </span>
                                            <Button
                                                type="link"
                                                size="small"
                                                onClick={() => {
                                                    setPendingDeliveryDate(
                                                        selectedTruck.deliveryDate
                                                            ? dayjs(selectedTruck.deliveryDate)
                                                            : null
                                                    );
                                                    setDeliveryModalOpen(true);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        <Text type="secondary" className="text-xs">Salesman</Text>
                                        <div className="font-medium mt-1">
                                            {selectedTruck.salesman?.name ?? "—"}
                                        </div>
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}
                </Card>
            </div>

            <Modal
                title="Change status"
                open={statusModalOpen}
                onCancel={() => { setStatusModalOpen(false); setPendingStatus(null); }}
                onOk={handleChangeStatus}
                okText="Save"
                confirmLoading={updateTruckMutation.isPending}
            >
                <div className="py-2">
                    <Text type="secondary" className="block mb-2">Status</Text>
                    <Select
                        className="w-full"
                        placeholder="Select status"
                        value={pendingStatus ?? selectedTruck?.status}
                        onChange={setPendingStatus}
                        options={[
                            { value: "active", label: "Active" },
                            { value: "upcoming", label: "Upcoming" },
                            { value: "completed", label: "Completed" },
                        ]}
                    />
                </div>
            </Modal>

            <Modal
                title="Delivery date"
                open={deliveryModalOpen}
                onCancel={() => { setDeliveryModalOpen(false); setPendingDeliveryDate(null); }}
                onOk={handleChangeDeliveryDate}
                okText="Save"
                confirmLoading={updateTruckMutation.isPending}
            >
                <div className="py-2">
                    <Text type="secondary" className="block mb-2">Delivery date</Text>
                    <DatePicker
                        className="w-full"
                        value={pendingDeliveryDate}
                        onChange={setPendingDeliveryDate}
                        format="DD/MM/YYYY"
                    />
                </div>
            </Modal>
        </PageLayout>
    );
}

function Section({ title, children, className = "" }) {
    return (
        <div className={className}>
            <Text strong className="block mb-3 text-base">
                {title}
            </Text>
            {children}
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="py-1.5">
            <Text type="secondary" className="text-xs block">{label}</Text>
            <div className="font-medium mt-0.5">{value}</div>
        </div>
    );
}

export default SchedulePage;

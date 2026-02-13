import React, { useMemo, useState } from 'react';
import { Select, Button, Card, Collapse, Checkbox, Input, Alert, Spin } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { useAuthStore } from '../store/authStore';
import { PageLayout, PageHeader, SectionCard } from '../components/ui';
import toast from 'react-hot-toast';

const { TextArea } = Input;

function buildOptionTree(sections, headings, options) {
    if (!sections?.length || !headings?.length || !options?.length) return [];
    const sectionId = (s) => s?._id ?? s;
    const headingId = (h) => h?._id ?? h;
    return sections.map((section) => ({
        ...section,
        headings: headings
            .filter((h) => (h.section?._id ?? h.section) === sectionId(section))
            .map((heading) => ({
                ...heading,
                options: options.filter(
                    (o) => (o.heading?._id ?? o.heading) === headingId(heading)
                ),
            }))
            .filter((h) => h.options.length > 0),
    })).filter((s) => s.headings.length > 0);
}

function CreateWorksheetPage() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const [selectedTruckId, setSelectedTruckId] = useState(undefined);
    const [selectedOptionIds, setSelectedOptionIds] = useState(new Set());
    const [extras, setExtras] = useState('');

    const { data: trucks = [], isLoading: trucksLoading } = useQuery({
        queryKey: ['trucks'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/truck');
            return data;
        },
    });

    const { data: sections = [], isLoading: sectionsLoading } = useQuery({
        queryKey: ['sections'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/section');
            return data;
        },
    });

    const { data: headings = [], isLoading: headingsLoading } = useQuery({
        queryKey: ['headings'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/heading');
            return data;
        },
    });

    const { data: options = [], isLoading: optionsLoading } = useQuery({
        queryKey: ['options'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/option');
            return data;
        },
    });

    const optionTree = useMemo(
        () => buildOptionTree(sections, headings, options),
        [sections, headings, options]
    );

    const selectedTruck = useMemo(
        () => trucks.find((t) => t._id === selectedTruckId),
        [trucks, selectedTruckId]
    );

    const toggleOption = (optionId) => {
        setSelectedOptionIds((prev) => {
            const next = new Set(prev);
            if (next.has(optionId)) next.delete(optionId);
            else next.add(optionId);
            return next;
        });
    };

    const createWorksheetMutation = useMutation({
        mutationFn: async () => {
            const customerId = selectedTruck?.customer?._id ?? selectedTruck?.customer;
            const payload = {
                salesman: user?._id,
                customer: customerId,
                truck: selectedTruckId,
                extras: extras.trim() || undefined,
                status: 'draft',
            };
            const { data } = await axiosInstance.post('/worksheet', payload);
            return data;
        },
        onError: (err) => {
            toast.error(err.response?.data?.errors ? 'Validation failed' : err.response?.data?.message || err.message);
        },
        onSuccess: (data) => {
            const worksheetId = data?.worksheet?._id;
            if (!worksheetId) {
                toast.error('Worksheet created but ID missing');
                return;
            }
            createWorksheetOptionsMutation.mutate(worksheetId);
        },
    });

    const createWorksheetOptionsMutation = useMutation({
        mutationFn: async (worksheetId) => {
            const promises = Array.from(selectedOptionIds).map((optionId) =>
                axiosInstance.post('/worksheet_option', {
                    worksheet: worksheetId,
                    option: optionId,
                    isCompleted: false,
                })
            );
            await Promise.all(promises);
            return worksheetId;
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to add some options');
        },
        onSuccess: (worksheetId) => {
            toast.success('Worksheet created with selected options');
            queryClient.invalidateQueries({ queryKey: ['worksheets'] });
            setSelectedTruckId(undefined);
            setSelectedOptionIds(new Set());
            setExtras('');
        },
    });

    const isSaving = createWorksheetMutation.isPending || createWorksheetOptionsMutation.isPending;
    const canSubmit = selectedTruckId && user?._id;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!canSubmit) {
            toast.error('Select a truck and ensure you are logged in.');
            return;
        }
        createWorksheetMutation.mutate();
    };

    const truckOptions = trucks.map((t) => ({
        value: t._id,
        label: `${t.stock ?? t._id} — ${t.customer?.name ?? 'No customer'} (Chassis: ${t.chassis ?? '—'})`,
    }));

    return (
        <PageLayout>
            <PageHeader
                title="Create worksheet"
                subtitle="Select a truck and pick options to build the worksheet."
                breadcrumbs={[
                    { title: 'Home', path: '/' },
                    { title: 'Create worksheet' },
                ]}
            />

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <SectionCard
                    title="1. Select truck"
                    subtitle="Choose the truck this worksheet is for. Customer and salesman will be set from the truck and your account."
                >
                    <Select
                        placeholder="Select a truck"
                        value={selectedTruckId}
                        onChange={setSelectedTruckId}
                        options={truckOptions}
                        allowClear
                        style={{ width: '100%', maxWidth: 480 }}
                        loading={trucksLoading}
                    />
                    {selectedTruck && (
                        <div className="mt-3 text-sm text-neutral-600">
                            Customer: {selectedTruck.customer?.name ?? '—'} · Salesman: {user?.name ?? user?.email ?? '—'}
                        </div>
                    )}
                </SectionCard>

                <SectionCard
                    title="2. Pick options"
                    subtitle="Select the options to include on this worksheet. Grouped by section and heading."
                >
                    {sectionsLoading || headingsLoading || optionsLoading ? (
                        <Spin tip="Loading options..." />
                    ) : optionTree.length === 0 ? (
                        <Alert
                            type="info"
                            message="No options available"
                            description="Add sections, headings, and options in Data (or run the worksheet seed script) first."
                        />
                    ) : (
                        <Collapse
                            defaultActiveKey={optionTree.map((s) => s._id)}
                            items={optionTree.map((section) => ({
                                key: section._id,
                                label: section.name,
                                children: (
                                    <div className="flex flex-col gap-4 pl-2">
                                        {section.headings.map((heading) => (
                                            <Card key={heading._id} size="small" title={heading.name}>
                                                <div className="flex flex-col gap-2">
                                                    {heading.options.map((opt) => (
                                                        <Checkbox
                                                            key={opt._id}
                                                            checked={selectedOptionIds.has(opt._id)}
                                                            onChange={() => toggleOption(opt._id)}
                                                        >
                                                            {opt.name}
                                                            {opt.description && (
                                                                <span className="text-neutral-500 text-sm ml-1">
                                                                    — {opt.description}
                                                                </span>
                                                            )}
                                                            {(opt.labourCost > 0 || opt.labourHours > 0) && (
                                                                <span className="text-neutral-400 text-sm ml-1">
                                                                    (${(opt.labourCost / 100).toFixed(2)}, {opt.labourHours}h)
                                                                </span>
                                                            )}
                                                        </Checkbox>
                                                    ))}
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                ),
                            }))}
                        />
                    )}
                    {selectedOptionIds.size > 0 && (
                        <p className="mt-3 text-sm text-neutral-600">
                            {selectedOptionIds.size} option(s) selected
                        </p>
                    )}
                </SectionCard>

                <SectionCard title="3. Extras (optional)" subtitle="Any extra notes for this worksheet.">
                    <TextArea
                        rows={3}
                        placeholder="e.g. Delivery by end of month, special instructions..."
                        value={extras}
                        onChange={(e) => setExtras(e.target.value)}
                    />
                </SectionCard>

                <div className="flex flex-wrap gap-3">
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={isSaving}
                        disabled={!canSubmit}
                    >
                        {isSaving ? 'Creating...' : 'Create worksheet'}
                    </Button>
                    <Link to="/">
                        <Button size="large">Cancel</Button>
                    </Link>
                </div>
            </form>
        </PageLayout>
    );
}

export default CreateWorksheetPage;

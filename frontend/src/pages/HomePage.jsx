import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import { Link } from "react-router-dom";
import { Button, Typography, Calendar, Table, Alert } from "antd";
import { DatabaseOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axios";
import { PageLayout, PageHeader, SectionCard } from "../components/ui";

const { Text } = Typography;

const HomePage = () => {
	const { user } = useAuthStore();

	const { data: trucks, isPending, error } = useQuery({
		queryKey: ["trucks"],
		queryFn: async () => {
			const { data } = await axiosInstance.get("/truck");
			return data;
		},
	});

	const truckColumns = [
		{
			title: "Chassis",
			dataIndex: "chassis",
			key: "chassis",
			width: 100,
			sorter: (a, b) => (a.chassis ?? 0) - (b.chassis ?? 0),
		},
		{
			title: "Stock",
			dataIndex: "stock",
			key: "stock",
			width: 100,
		},
		{
			title: "Registration",
			dataIndex: "registration",
			key: "registration",
		},
		{
			title: "Model",
			dataIndex: "model",
			key: "model",
			render: (m) => (m && typeof m === "object" && m.name ? m.name : m ? String(m) : "—"),
		},
		{
			title: "Customer",
			dataIndex: "customer",
			key: "customer",
			render: (c) => (c && typeof c === "object" && c.name ? c.name : c ? String(c) : "—"),
		},
	];

	return (
		<PageLayout>
			<PageHeader
				title="Dashboard"
				subtitle="Welcome back. Manage your fleet and data from here."
				breadcrumbs={[{ title: "Home" }]}
				extra={
					<Link to="/data">
						<Button type="primary" icon={<DatabaseOutlined />} size="large">
							Open Data
						</Button>
					</Link>
				}
			/>

			<div className="grid gap-6 lg:grid-cols-3">
				{/* User info + Calendar: left column on large screens */}
				<div className="flex flex-col gap-6 lg:col-span-1">
					<motion.div
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
					>
						<SectionCard title="Profile" subtitle="Your account details">
							<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
								<div>
									<Text type="secondary">Name</Text>
									<div className="font-medium">{user?.name}</div>
								</div>
								<div>
									<Text type="secondary">Email</Text>
									<div className="font-medium">{user?.email}</div>
								</div>
								<div>
									<Text type="secondary">Joined</Text>
									<div className="font-medium">
										{user?.createdAt
											? new Date(user.createdAt).toLocaleDateString("en-US", {
													year: "numeric",
													month: "long",
													day: "numeric",
											  })
											: "—"}
									</div>
								</div>
								<div>
									<Text type="secondary">Last login</Text>
									<div className="font-medium">{formatDate(user?.lastLogin)}</div>
								</div>
							</div>
						</SectionCard>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: 0.1 }}
					>
						<SectionCard title="Calendar" subtitle="Today's date">
							<Calendar fullscreen={false} className="w-full" />
						</SectionCard>
					</motion.div>
				</div>

				{/* Trucks table: right column / full width */}
				<motion.div
					className="lg:col-span-2"
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.15 }}
				>
					<SectionCard
						title="Trucks"
						subtitle="Fleet overview"
						extra={
							<Link to="/data">
								<Button type="link" size="small">
									Manage in Data
								</Button>
							</Link>
						}
					>
						{error && (
							<Alert
								message="Could not load trucks"
								description={error.message}
								type="error"
								showIcon
								className="mb-4"
							/>
						)}
						<Table
							dataSource={trucks}
							columns={truckColumns}
							rowKey="_id"
							loading={isPending}
							pagination={{ pageSize: 10, showSizeChanger: false }}
							size="small"
							scroll={{ x: 500 }}
						/>
					</SectionCard>
				</motion.div>
			</div>
		</PageLayout>
	);
};

export default HomePage;

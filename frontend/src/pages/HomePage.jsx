import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import { Link } from "react-router-dom";
import { Button, Typography } from "antd";
import { DatabaseOutlined } from "@ant-design/icons";
import { PageLayout, PageHeader, SectionCard } from "../components/ui";

const { Text } = Typography;

const HomePage = () => {
	const { user } = useAuthStore();

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

			<div className="flex flex-col gap-6">
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
				>
					<SectionCard title="Profile" subtitle="Your account details">
						<div className="grid gap-2 sm:grid-cols-2">
							<div>
								<Text type="secondary">Name</Text>
								<div className="font-medium">{user?.name}</div>
							</div>
							<div>
								<Text type="secondary">Email</Text>
								<div className="font-medium">{user?.email}</div>
							</div>
						</div>
					</SectionCard>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.1 }}
				>
					<SectionCard title="Account activity" subtitle="Sign-up and login info">
						<div className="grid gap-2 sm:grid-cols-2">
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
			</div>
		</PageLayout>
	);
};

export default HomePage;

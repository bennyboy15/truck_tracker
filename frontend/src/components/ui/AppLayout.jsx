import React, { useState } from 'react';
import { Layout, Menu, Typography, Dropdown, Space, Button, ConfigProvider } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    DatabaseOutlined,
    HomeOutlined,
    UserOutlined,
    LogoutOutlined,
    DownOutlined,
    MenuOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';

const { Header, Content } = Layout;
const { Text } = Typography;

const theme = {
    token: {
        colorPrimary: '#10b981',
        borderRadius: 8,
        colorBgContainer: '#ffffff',
    },
    components: {
        Layout: {
            headerBg: 'rgba(15, 23, 42, 0.95)',
            headerColor: 'rgba(248, 250, 252, 0.9)',
        },
        Menu: {
            darkItemBg: 'transparent',
            darkItemSelectedBg: 'rgba(16, 185, 129, 0.2)',
            darkItemSelectedColor: '#34d399',
        },
    },
};

const navItems = [
    { key: '/', icon: <HomeOutlined />, label: 'Dashboard' },
    { key: '/data', icon: <DatabaseOutlined />, label: 'Data' },
];

/**
 * App shell: header with logo, nav (full menu on large screens, dropdown on small), user dropdown; content area with theme.
 */
function AppLayout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [navDropdownOpen, setNavDropdownOpen] = useState(false);

    const userMenuItems = [
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Log out',
            onClick: () => {
                logout();
                navigate('/login');
            },
        },
    ];

    const navDropdownItems = navItems.map((item) => ({
        key: item.key,
        icon: item.icon,
        label: item.label,
        onClick: () => {
            navigate(item.key);
            setNavDropdownOpen(false);
        },
    }));

    return (
        <ConfigProvider theme={theme}>
            <Layout className="min-h-screen">
                <Header className="flex items-center justify-between px-4 sm:px-6 shadow-sm sticky top-0 z-50 backdrop-blur-sm border-b border-slate-700/50">
                    <div className="flex items-center gap-4 sm:gap-8 min-w-0">
                        <Link to="/" className="flex items-center gap-2 no-underline shrink-0">
                            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 text-transparent bg-clip-text">
                                Truck Tracker
                            </span>
                        </Link>
                        {/* Full nav: visible from md (768px) up */}
                        <div className="hidden md:block">
                            <Menu
                                mode="horizontal"
                                selectedKeys={[location.pathname]}
                                items={navItems.map((item) => ({
                                    ...item,
                                    label: <Link to={item.key}>{item.label}</Link>,
                                }))}
                                className="border-0 bg-transparent text-inherit min-w-0 [&_.ant-menu-item]:text-slate-300 [&_.ant-menu-item-selected]:text-emerald-400"
                                style={{ lineHeight: '64px' }}
                            />
                        </div>
                        {/* Nav dropdown: visible on small screens only */}
                        <Dropdown
                            open={navDropdownOpen}
                            onOpenChange={setNavDropdownOpen}
                            menu={{
                                items: navDropdownItems,
                                selectedKeys: [location.pathname],
                            }}
                            trigger={['click']}
                            placement="bottomLeft"
                            className="md:hidden"
                        >
                            <Button
                                type="text"
                                icon={<MenuOutlined />}
                                className="text-slate-300 hover:text-white flex items-center gap-1"
                            >
                                Menu
                                <DownOutlined className="text-xs" />
                            </Button>
                        </Dropdown>
                    </div>
                    <Dropdown
                        menu={{ items: userMenuItems }}
                        trigger={['click']}
                        placement="bottomRight"
                    >
                        <Space className="cursor-pointer text-slate-300 hover:text-white shrink-0">
                            <UserOutlined />
                            <Text className="text-inherit hidden sm:inline">{user?.name || user?.email}</Text>
                            <DownOutlined className="text-xs" />
                        </Space>
                    </Dropdown>
                </Header>
                <Content className="bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 min-h-[calc(100vh-64px)]">
                    {children}
                </Content>
            </Layout>
        </ConfigProvider>
    );
}

export default AppLayout;

import React from 'react';
import { Typography, Space, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

/**
 * Page title with optional subtitle, breadcrumbs, and action buttons.
 * Breadcrumb items: { title, path? } — use path for React Router Link.
 */
function PageHeader({ title, subtitle, breadcrumbs, extra, level = 3 }) {
    const breadcrumbItems = breadcrumbs?.map((item) =>
        item.path
            ? { title: <Link to={item.path}>{item.title}</Link> }
            : { title: item.title }
    );

    return (
        <div className="mb-6">
            {breadcrumbItems?.length > 0 && (
                <Breadcrumb
                    items={breadcrumbItems}
                    className="mb-2"
                />
            )}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <Space direction="vertical" size={0}>
                    <Title level={level} style={{ margin: 0 }}>
                        {title}
                    </Title>
                    {subtitle && (
                        <Text type="secondary" style={{ fontSize: '0.95rem' }}>
                            {subtitle}
                        </Text>
                    )}
                </Space>
                {extra && <div>{extra}</div>}
            </div>
        </div>
    );
}

export default PageHeader;

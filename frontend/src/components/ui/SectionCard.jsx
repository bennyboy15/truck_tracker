import React from 'react';
import { Card, Typography, Space } from 'antd';

const { Title } = Typography;

/**
 * Card section with optional title and header extra (e.g. button).
 */
function SectionCard({ title, subtitle, extra, children, className = '', ...cardProps }) {
    const header = (title || extra) ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
            <Space orientation="vertical" size={0}>
                {title && <Title level={5} style={{ margin: 0 }}>{title}</Title>}
                {subtitle && (
                    <span className="text-neutral-500 text-sm">{subtitle}</span>
                )}
            </Space>
            {extra && <div>{extra}</div>}
        </div>
    ) : null;

    return (
        <Card
            className={className}
            title={header}
            {...cardProps}
        >
            {children}
        </Card>
    );
}

export default SectionCard;

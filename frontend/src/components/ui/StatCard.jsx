import React from 'react';
import { Card, Typography } from 'antd';

const { Text } = Typography;

/**
 * Metric card: icon, value, label, optional trend or description.
 */
function StatCard({ icon, value, label, trend, description, color = 'primary' }) {
    const colorMap = {
        primary: { bg: 'rgba(16, 185, 129, 0.12)', icon: '#10b981' },
        blue: { bg: 'rgba(59, 130, 246, 0.12)', icon: '#3b82f6' },
        amber: { bg: 'rgba(245, 158, 11, 0.12)', icon: '#f59e0b' },
        violet: { bg: 'rgba(139, 92, 246, 0.12)', icon: '#8b5cf6' },
    };
    const theme = colorMap[color] || colorMap.primary;

    return (
        <Card
            size="small"
            className="overflow-hidden"
            styles={{
                body: { padding: '20px' },
            }}
        >
            <div className="flex items-start justify-between gap-3">
                <div
                    className="flex items-center justify-center rounded-xl w-12 h-12 shrink-0"
                    style={{ backgroundColor: theme.bg }}
                >
                    <span style={{ color: theme.icon, fontSize: 24 }}>
                        {icon}
                    </span>
                </div>
                <div className="text-right min-w-0">
                    <div className="text-2xl font-semibold tabular-nums text-neutral-800">
                        {value}
                    </div>
                    {trend && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {trend}
                        </Text>
                    )}
                </div>
            </div>
            <Text type="secondary" className="block mt-2 text-sm">
                {label}
            </Text>
            {description && (
                <Text type="secondary" className="block mt-1 text-xs">
                    {description}
                </Text>
            )}
        </Card>
    );
}

export default StatCard;

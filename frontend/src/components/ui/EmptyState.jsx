import React from 'react';
import { Empty, Button } from 'antd';

/**
 * Empty state with icon, message, and optional action.
 */
function EmptyState({ image, description, label, onAction, className = '' }) {
    return (
        <div className={`py-8 ${className}`}>
            <Empty
                image={image ?? Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                    <span className="text-neutral-500">{description}</span>
                }
            >
                {label && onAction && (
                    <Button type="primary" onClick={onAction}>
                        {label}
                    </Button>
                )}
            </Empty>
        </div>
    );
}

export default EmptyState;

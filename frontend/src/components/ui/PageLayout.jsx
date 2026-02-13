import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

/**
 * Consistent page content wrapper: max-width, padding, optional className.
 */
function PageLayout({ children, className = '', maxWidth = 1400, style = {} }) {
    return (
        <Content
            className={className}
            style={{
                padding: '24px',
                maxWidth: maxWidth ? `${maxWidth}px` : undefined,
                margin: '0 auto',
                width: '100%',
                ...style,
            }}
        >
            {children}
        </Content>
    );
}

export default PageLayout;

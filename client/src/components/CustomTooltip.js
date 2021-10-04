import { Tooltip } from 'antd';
import React from 'react';

const CustomTooltip = ({ className, title, visible, overlayInnerStyle, children, color = '#0062ff' }) => {

    return (
        <Tooltip
            className={className}
            getPopupContainer={node => node.parentNode}
            overlayInnerStyle={overlayInnerStyle}
            title={title}
            color={color}
            visible={visible}
        >
            {children}
        </Tooltip>
    )
}

export default CustomTooltip
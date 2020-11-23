import React from 'react';
import { Pagination } from 'antd';

const CustomPagination = ({ total, pageSize, onChange, current, pageSizeOptions, onPageSizeChange }) => {
    return (
        <div className='app-pagination'>
            <Pagination
                total={total}
                current={current}
                pageSize={pageSize}
                onChange={onChange}
                showSizeChanger
                onShowSizeChange={onPageSizeChange}
                pageSizeOptions={pageSizeOptions}
                showTotal={((total, [from, to]) => `${from} - ${to} of ${total} items`)}
                locale={{ items_per_page: "" }}
            />
        </div>

    );
}

export default CustomPagination
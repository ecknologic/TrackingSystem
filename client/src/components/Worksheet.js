import React from 'react';
import Workbook from 'react-excel-workbook'
import CustomButton from './CustomButton';
import { XLSIcon } from './SVG_Icons';
import { DownloadOutlined } from '@ant-design/icons';

const Worksheet = ({
    disabled,
    rows = [],
    columns = [],
    fileName = 'example',
    sheetName = 'Sheet 1'
}) => {

    const DownloadBtn = <CustomButton icon={<DownloadOutlined />} className='app-extra-btn inverse app-excel-download-btn' suffix={<XLSIcon />} />

    return (
        <div className="row text-center">
            <Workbook filename={`${fileName}.xlsx`} element={disabled ? <></> : DownloadBtn}>
                <Workbook.Sheet data={rows} name={sheetName}>
                    {
                        columns.map((item) => <Workbook.Column key={item.value} label={item.label} value={item.value} />)
                    }
                </Workbook.Sheet>
            </Workbook>
        </div>
    )

}

export default Worksheet
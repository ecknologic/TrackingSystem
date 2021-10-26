import React from 'react';
import Workbook from 'react-excel-workbook'
import CustomButton from './CustomButton';
import { XLSIcon } from './SVG_Icons';

const Worksheet = ({
    disabled,
    rows = [],
    columns = [],
    fileName = 'example',
    sheetName = 'Sheet 1'
}) => {

    const DownloadBtn = <CustomButton text='Download' className='app-extra-btn inverse' suffix={<XLSIcon />} />

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
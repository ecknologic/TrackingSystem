import React from 'react'
import { Col, Upload, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const FormItem = Form.Item;
const UploadImage = (props) => {
    const { colSpan, onUpload, className, accept, showUploadList, name, imageValue, label } = props;
    return (
        <Col span={colSpan}>
            <FormItem label={label || ''}>
                <Upload
                    customRequest={(e) => onUpload(e.file, name)}
                    className={className ? className : "image-uploader"}
                    accept={accept ? accept : ".png,.jpg,.jpeg"}
                    showUploadList={showUploadList ? showUploadList : false}
                >{
                        imageValue ?
                            <img src={imageValue} alt="" className="idProofImg" /> :
                            <PlusOutlined className="avatar-uploader-trigger" />
                    }
                </Upload>
            </FormItem>
        </Col>
    )
}
export default UploadImage;
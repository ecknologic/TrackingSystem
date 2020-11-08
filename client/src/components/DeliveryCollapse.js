import React from 'react';
import { Collapse } from 'antd';
import DeliveryForm from '../UI/accounts/add/forms/Delivery';

const DeliveryCollapse = ({ data }) => {


  return (
    data.length ? data.map((item, index) => {
      const { deliveryLocation, address } = item
      return (
        <Collapse
          // defaultActiveKey={['0']}
          expandIconPosition='right'
          key={index}
        >
          <Panel header={deliveryLocation}>
            <DeliveryForm data={item} mode='collapse-edit' />
          </Panel>
        </Collapse>
      )
    }) : null
  )
}

const { Panel } = Collapse;
export default DeliveryCollapse
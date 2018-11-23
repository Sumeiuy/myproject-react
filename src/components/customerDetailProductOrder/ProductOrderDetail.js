/*
 * @Author: yuanhaojie
 * @Date: 2018-11-23 09:51:00
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-23 22:41:09
 * @Description: 服务订单流水详情
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Button, Tabs } from 'antd';
import Modal from '../common/biz/CommonModal';
import styles from './productOrderDetail.less';

const TabPane = Tabs.TabPane;

export default class ProductOrderDetail extends PureComponent {
  static propsTypes = {
    visible: PropTypes.bool.isRequired,
    orderNumber: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    serviceOrderDetail: PropTypes.object.isRequired,
    serviceProductList: PropTypes.array.isRequired,
    orderApproval: PropTypes.object.isRequired,
    otherCommissions: PropTypes.object.isRequired,
    queryServiceOrderDetail: PropTypes.func.isRequired,
    queryServiceProductList: PropTypes.func.isRequired,
    queryOrderApproval: PropTypes.func.isRequired,
    queryOtherCommissions: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const {
      orderNumber,
      queryServiceOrderDetail,
    } = this.props;
    queryServiceOrderDetail({
      orderNumber,
    });
  }

  @autobind
  handleModalClose() {
    this.props.onClose();
  }

  render() {
    const {
      visible,
      orderNumber,
      serviceOrderDetail,
    } = this.props;
    const {
      originalCommission = '',
      newCommission = '',
      approveFlow = '',
      executiveCondition = '',
    } = serviceOrderDetail;
    const closeButton = (
      <Button onClick={this.handleModalClose}>关闭</Button>
    );

    return (
      <Modal
        visible={visible && orderNumber !== ''}
        maskClosable={false}
        title="订单详情"
        wrapClassName={styles.productOrderDetailWrap}
        selfBtnGroup={closeButton}
        closeModal={this.handleModalClose}
      >
        <div className={styles.serviceOrderDetailWrap}>
          <div className={styles.detailInfo}>
            <div>
              <span>客户原佣金（‰）：{originalCommission}</span>
              <span>客户新佣金（‰）：{newCommission}</span>
              <span>审批流程：{approveFlow}</span>
            </div>
            <div>
              <span>执行情况：{executiveCondition}</span>
            </div>
          </div>
          <Tabs>
            <TabPane tab="服务产品" key="serviceProductList">
            </TabPane>
            <TabPane tab="审批" key="orderApproval">
            </TabPane>
            <TabPane tab="附件" key="ceFiles">
            </TabPane>
            <TabPane tab="其他佣金" key="otherCommissions">
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    );
  }
}

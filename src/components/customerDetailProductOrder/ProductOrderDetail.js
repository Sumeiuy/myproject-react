/*
 * @Author: yuanhaojie
 * @Date: 2018-11-23 09:51:00
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-26 11:13:35
 * @Description: 服务订单流水详情
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Button, Tabs } from 'antd';
import Tooltip from '../common/Tooltip';
import Modal from '../common/biz/CommonModal';
import styles from './productOrderDetail.less';
import OtherCommissions from './OtherCommissions';
import OrderApproval from './OrderApproval';
import ServiceProductList from './ServiceProductList';

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
    attachmentList: PropTypes.array.isRequired,
    getAttachmentList: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    if (this.props.orderNumber !== '' && this.props.orderNumber !== prevProps.orderNumber) {
      const {
        orderNumber,
        queryServiceOrderDetail,
        queryOtherCommissions,
        queryOrderApproval,
        queryServiceProductList,
      } = this.props;
      queryServiceOrderDetail({
        orderNumber,
        // orderNumber: '1-8892870715',
      });
      queryOtherCommissions({
        orderNumber,
      });
      queryOrderApproval({
        orderNumber,
      });
      queryServiceProductList({
        orderNumber,
      });
    }
  }

  @autobind
  handleModalClose() {
    this.props.onClose();
  }

  render() {
    const {
      visible,
      orderNumber,
      orderApproval,
      serviceProductList,
      serviceOrderDetail,
      otherCommissions,
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
        modalKey="productOrderDetail"
        visible={visible && orderNumber !== ''}
        maskClosable={false}
        title="订单详情"
        wrapClassName={styles.productOrderDetailWrap}
        selfBtnGroup={closeButton}
        closeModal={this.handleModalClose}
      >
        <div className={styles.serviceOrderDetailWrap}>
          <div className={styles.detailInfo}>
            <div className={styles.detail}>
              <span className={styles.hint}>客户原佣金（‰）：</span>
              <span className={styles.info}>{originalCommission}</span>
              <span className={styles.hint}>客户新佣金（‰）：</span>
              <span className={styles.info}>{newCommission}</span>
              <span className={styles.hint}>审批流程：</span>
              <span className={styles.info}>{approveFlow}</span>
            </div>
            <div className={styles.detail}>
              <span className={styles.hint}>执行情况：</span>
              <span>
                <Tooltip title={executiveCondition}>{executiveCondition}</Tooltip>
              </span>
            </div>
          </div>
          <Tabs
            className={styles.detailTab}
          >
            <TabPane tab="服务产品" key="serviceProductList">
              <ServiceProductList
                serviceProductList={serviceProductList}
              />
            </TabPane>
            <TabPane tab="审批" key="orderApproval">
              <OrderApproval
                approvalInfo={orderApproval}
              />
            </TabPane>
            <TabPane tab="附件" key="ceFiles">
            </TabPane>
            <TabPane tab="其他佣金" key="otherCommissions">
              <OtherCommissions
                commissions={otherCommissions}
              />
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    );
  }
}

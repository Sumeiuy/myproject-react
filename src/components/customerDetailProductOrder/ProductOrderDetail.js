/*
 * @Author: yuanhaojie
 * @Date: 2018-11-23 09:51:00
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-29 10:14:29
 * @Description: 服务订单流水详情
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Button, Tabs } from 'antd';
import _ from 'lodash';
import Tooltip from '../common/Tooltip';
import Modal from '../common/biz/CommonModal';
import IfTableWrap from '../common/IfTableWrap';
import styles from './productOrderDetail.less';
import OtherCommissions from './OtherCommissions';
import OrderApproval from './OrderApproval';
import ServiceProductList from './ServiceProductList';
import AttachmentList from './AttachmentList';
import logable from '../../decorators/logable';
import { isNull } from '../../helper/check';

const TabPane = Tabs.TabPane;
const DEFAULT_SHOW_VALUE = '--';

export default class ProductOrderDetail extends PureComponent {
  static propsTypes = {
    visible: PropTypes.bool.isRequired,
    orderNumber: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    serviceOrderDetail: PropTypes.object.isRequired,
    serviceProductList: PropTypes.array.isRequired,
    orderApproval: PropTypes.object.isRequired,
    queryServiceOrderDetail: PropTypes.func.isRequired,
    queryServiceProductList: PropTypes.func.isRequired,
    queryOrderApproval: PropTypes.func.isRequired,
    attachmentList: PropTypes.array.isRequired,
    getAttachmentList: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    if (this.props.orderNumber !== '' && this.props.orderNumber !== prevProps.orderNumber) {
      const {
        orderNumber,
        queryServiceOrderDetail,
        queryOrderApproval,
        queryServiceProductList,
        getAttachmentList,
      } = this.props;
      queryServiceOrderDetail({
        orderNumber,
      }).then(res => {
        if (!_.isEmpty(res)) {
          const {
            rowId = '',
            workFlowNumber = '',
            attachmentId = '',
          } = res;
          queryOrderApproval({
            orderRowId: rowId,
            workFlowNumber,
          });
          getAttachmentList({
            attachment: attachmentId,
          });
        }
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

  // 当值为空时，设置默认显示
  @autobind
  ensureShow(item) {
    return isNull(item) ? DEFAULT_SHOW_VALUE : item;
  }

  @autobind
  isValidValue(checked) {
    return !(_.isEmpty(checked) || _.every(checked, item => item === null));
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '服务订单详情切换展示',
      value: '$args[0]',
    },
  })
  handleTabChange(activeTabKey) {
  }

  render() {
    const {
      visible,
      orderNumber,
      orderApproval,
      serviceProductList,
      serviceOrderDetail,
      attachmentList,
    } = this.props;
    const {
      originalCommission,
      newCommission,
      approveFlow,
      executiveCondition,
    } = serviceOrderDetail;
    const closeButton = (
      <Button onClick={this.handleModalClose}>关闭</Button>
    );
    const isServiceProductListRender = serviceProductList.length !== 0;
    const isApprovalRender = this.isValidValue(serviceOrderDetail) && this.isValidValue(orderApproval);
    const isAttachmentListRender = this.isValidValue(serviceOrderDetail) && attachmentList.length !== 0;

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
              <span className={styles.info}>{this.ensureShow(originalCommission)}</span>
              <span className={styles.hint}>客户新佣金（‰）：</span>
              <span className={styles.info}>{this.ensureShow(newCommission)}</span>
              <span className={styles.hint}>审批流程：</span>
              <span className={styles.info}>
                <Tooltip title={approveFlow}>{this.ensureShow(approveFlow)}</Tooltip>
              </span>
            </div>
            <div className={styles.detail}>
              <span className={styles.hint}>执行情况：</span>
              <span>
                <Tooltip title={executiveCondition}>{this.ensureShow(executiveCondition)}</Tooltip>
              </span>
            </div>
          </div>
          <Tabs
            className={styles.detailTab}
            onChange={this.handleTabChange}
          >
            <TabPane tab="服务产品" key="serviceProductList">
              <IfTableWrap isRender={isServiceProductListRender} text="订单暂无服务产品信息">
                <ServiceProductList
                  serviceProductList={serviceProductList}
                />
              </IfTableWrap>
            </TabPane>
            <TabPane tab="审批" key="orderApproval">
              <IfTableWrap isRender={isApprovalRender} text="订单暂无审批信息">
                <OrderApproval
                  approvalInfo={orderApproval}
                />
              </IfTableWrap>
            </TabPane>
            <TabPane tab="附件" key="ceFiles">
              <IfTableWrap isRender={isAttachmentListRender} text="订单暂无附件信息">
                <AttachmentList
                  attachmentList={attachmentList}
                />
              </IfTableWrap>
            </TabPane>
            <TabPane tab="其他佣金" key="otherCommissions">
              <OtherCommissions
                commissions={serviceOrderDetail}
              />
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    );
  }
}

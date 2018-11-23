/**
 * @Author: XuWenKang
 * @Description: 客户360-理财优惠券-优惠券详情modal
 * @Date: 2018-11-22 13:46:00
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-23 14:13:59
 */

import React, { PureComponent } from 'react';
import proptypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import Modal from '../../components/common/biz/CommonModal';
import InfoItem from '../common/infoItem';
import Table from '../../components/common/table';
import { number } from '../../helper';
import {
  checkIsNeedTitle,
  DEFAULT_VALUE,
  productTitleList,
} from './config';
import styles from './detailModal.less';

const INFO_ITEM_WITDH = '155px';
const EMPTY_ARRAY = [];
export default class DetailModal extends PureComponent {
  static propTypes = {
    visible: proptypes.bool.isRequired,
    data: proptypes.object.isRequired,
    onCloseModal: proptypes.func.isRequired,
  }

  @autobind
  getYield(value) {
    return _.isNumber(value) ? value.toString() : DEFAULT_VALUE;
  }

  @autobind
  getQuotient(value) {
    return _.isNumber(value) ? number.thousandFormat(value) : DEFAULT_VALUE;
  }

  render() {
    const {
      data,
      visible,
      onCloseModal,
    } = this.props;
    const paginationProps = {
      pageSize: 5,
    };
    return (
      <Modal
        className={styles.detailModalBox}
        title="优惠券详情"
        size='large'
        visible={visible}
        closeModal={onCloseModal}
        showOkBtn={false}
        showCancelBtn={false}
        modalKey="discountModal"
        maskClosable={false}
      >
        <div className={styles.detailBox}>
          <div className={styles.infoBox}>
            <div className={`${styles.title} clearfix`}>
              <span className={styles.colorBlock} />
              <span className={styles.titleText}>用户优惠券信息</span>
            </div>
            <div className={styles.infoContainer}>
              <div className={styles.infoItemBox}>
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="优惠券名称"
                  value={data.ticketName || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.ticketName || DEFAULT_VALUE)}
                  isNeedOverFlowEllipsis
                />
              </div>
              <div className={styles.infoItemBox}>
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="优惠券类型"
                  value={data.ticketTypeText || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.ticketTypeText || DEFAULT_VALUE)}
                  isNeedOverFlowEllipsis
                />
              </div>
              <div className={styles.infoItemBox}>
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="使用状态"
                  value={data.statusText || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.statusText || DEFAULT_VALUE)}
                  isNeedOverFlowEllipsis
                />
              </div>
              <div className={styles.infoItemBox}>
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="优惠券编号"
                  value={data.ticketId || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.ticketId || DEFAULT_VALUE)}
                  isNeedOverFlowEllipsis
                />
              </div>
              <div className={styles.infoItemBox}>
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="来源营销活动名称"
                  value={data.sourceName || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.sourceName || DEFAULT_VALUE)}
                  isNeedOverFlowEllipsis
                />
              </div>
              <div className={styles.infoItemBox}>
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="来源营销活动编号"
                  value={data.sourceCode || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.sourceCode || DEFAULT_VALUE)}
                  isNeedOverFlowEllipsis
                />
              </div>
              <div className={styles.infoItemBox}>
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="领取时间"
                  value={data.receiveTime || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.receiveTime || DEFAULT_VALUE)}
                  isNeedOverFlowEllipsis
                />
              </div>
              <div className={styles.infoItemBox}>
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="生效开始时间"
                  value={data.startTime || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.startTime || DEFAULT_VALUE)}
                  isNeedOverFlowEllipsis
                />
              </div>
              <div className={styles.infoItemBox}>
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="生效结束时间"
                  value={data.endTime || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.endTime || DEFAULT_VALUE)}
                  isNeedOverFlowEllipsis
                />
              </div>
              <div className={styles.infoItemBox}>
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="收益率"
                  value={this.getYield(data.yield)}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.yield)}
                  isNeedOverFlowEllipsis
                />
              </div>
              <div className={styles.infoItemBox}>
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="额度/份额"
                  value={this.getQuotient(data.quotient)}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.quotient || DEFAULT_VALUE)}
                  isNeedOverFlowEllipsis
                />
              </div>
            </div>
          </div>
          <div className={styles.listBox}>
            <div className={`${styles.title} clearfix`}>
              <span className={styles.colorBlock} />
              <span className={styles.titleText}>可购买产品列表</span>
            </div>
            <Table
              pagination={paginationProps}
              dataSource={data.productList || EMPTY_ARRAY}
              isNeedEmptyRow
              columns={productTitleList}
              scroll={{ x: '1000px' }}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

/**
 * @Author: XuWenKang
 * @Description: 客户360-理财优惠券-优惠券详情modal
 * @Date: 2018-11-22 13:46:00
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-23 14:13:59
 */

import React, { PureComponent } from 'react';
import proptypes from 'prop-types';
import Modal from '../../components/common/biz/CommonModal';
import InfoItem from '../common/infoItem';
import Table from '../../components/common/table';
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
    onToggleModal: proptypes.func.isRequired,
  }

  render() {
    const {
      data,
      visible,
      onToggleModal,
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
        closeModal={() => onToggleModal(false)}
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
                  isNeedValueTitle={checkIsNeedTitle(data.ticketName)}
                  isNeedOverFlowEllipsis
                />
              </div>
              <div className={styles.infoItemBox}>
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="优惠券类型"
                  value={data.ticketTypeText || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.ticketTypeText)}
                  isNeedOverFlowEllipsis
                />
              </div>
              <div className={styles.infoItemBox}>
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="使用状态"
                  value={data.statusText || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.statusText)}
                  isNeedOverFlowEllipsis
                />
              </div>
              <div className={styles.infoItemBox}>
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="优惠券编号"
                  value={data.ticketId || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.ticketId)}
                  isNeedOverFlowEllipsis
                />
              </div>
              <div className={styles.infoItemBox}>
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="来源营销活动名称"
                  value={data.sourceName || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.sourceName)}
                  isNeedOverFlowEllipsis
                />
              </div>
              <div className={styles.infoItemBox}>
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="来源营销活动编号"
                  value={data.sourceCode || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.sourceCode)}
                  isNeedOverFlowEllipsis
                />
              </div>
              <div className={styles.infoItemBox}>
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="领取时间"
                  value={data.receiveTime || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.receiveTime)}
                  isNeedOverFlowEllipsis
                />
              </div>
              <div className={styles.infoItemBox}>
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="生效开始时间"
                  value={data.startTime || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.startTime)}
                  isNeedOverFlowEllipsis
                />
              </div>
              <div className={styles.infoItemBox}>
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="生效结束时间"
                  value={data.endTime || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.endTime)}
                  isNeedOverFlowEllipsis
                />
              </div>
              <div className={styles.infoItemBox}>
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="收益率"
                  value={data.yield || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.yield)}
                  isNeedOverFlowEllipsis
                />
              </div>
              <div className={styles.infoItemBox}>
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="额度/份额"
                  value={data.quotient || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.quotient)}
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

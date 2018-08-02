/**
 * @Author: sunweibin
 * @Date: 2018-07-02 15:49:26
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-30 14:12:26
 * @description 重点监控账户的核查信息列表Modal
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';

import Modal from '../common/biz/CommonModal';
import { env } from '../../helper';
import { fspGlobal } from '../../utils';
import {
  CHECKINFO_LIST_COLUMNS,
} from './config';

import styles from './checkInfoListModal.less';

export default class CheckInfoListModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    moniKey: PropTypes.string.isRequired,
    stockAccount: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    getCheckInfoList: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.queryList();
  }

  @autobind
  queryList(query = {}) {
    const { getCheckInfoList, moniKey } = this.props;
    getCheckInfoList({
      moniKey,
      pageNum: 1,
      pageSize: 1000,
      ...query,
    });
  }

  @autobind
  addOnCellPropsForColumns(columns) {
    return _.map(columns, (column) => {
      const { key } = column;
      if (key === 'checkDate') {
        return {
          ...column,
          render(text) {
            return (<span className={styles.checkDateCell}>{text ? text.substr(0, 10) : ''}</span>);
          },
          onCell: record => ({
            onClick: () => this.handleCheckDateCellClick(record),
          }),
        };
      }
      return column;
    });
  }

  @autobind
  insertStockAccountToData(list) {
    const { stockAccount } = this.props;
    return _.map(list, i => ({ ...i, stockAccount }));
  }

  @autobind
  handleCheckDateCellClick(record) {
    if (env.isInFsp()) {
      // 此处是调用 FSP 框架下的EB弹出层组件，因此添加 env 判断
      const sourceURL = `/fsp/customer/invEvaluate/showMonitorCheckedInfoWindow?checkedInfomationRowId=${record.rowId}`;
      fspGlobal.openFspEBWindow({
        id: 'bz_win_view360KeyMonitorDetailPage',
        title: '重点监控账户核查信息',
        sourceURL,
        z_index: 1100,
      });
    }
  }

  @autobind
  handlePaginationChange(pageNum) {
    this.queryList({ pageNum });
  }

  @autobind
  handleCloseModal() {
    this.props.onClose();
  }

  render() {
    const {
      visible,
      data: { checkInfoList = [] },
    } = this.props;

    const columns = this.addOnCellPropsForColumns(CHECKINFO_LIST_COLUMNS);
    // 将客户的证券账号写进数据中
    const newCheckInfoList = this.insertStockAccountToData(checkInfoList);

    return (
      <Modal
        modalKey="custCheckInfoListModal"
        title="重点监控账户核查信息"
        needBtn={false}
        maskClosable={false}
        size="large"
        visible={visible}
        closeModal={this.handleCloseModal}
      >
        <div className={styles.checkInfoListContainer}>
          <div className={styles.checkInfoListArea}>
            <Table
              columns={columns}
              rowKey="rowId"
              dataSource={newCheckInfoList}
              pagination={{
                pageSize: 5,
                showTotal(total) {
                  return `共 ${total} 条`;
                },
              }}
              scroll={{ x: 1200 }}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

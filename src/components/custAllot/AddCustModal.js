/**
 * @Description: 添加客户弹窗
 * @Author: Liujianshu
 * @Date: 2018-05-24 10:13:17
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-05-24 11:09:01
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import { message } from 'antd';
// import _ from 'lodash';

import CommonModal from '../common/biz/CommonModal';
// import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import CommonTable from '../../components/common/biz/CommonTable';
import commonConfirm from '../common/confirm_';
import logable from '../../decorators/logable';
import config from './config';
import styles from './addCustModal.less';

// 表头
const { titleList } = config;

export default class AddCustModal extends PureComponent {
  static propTypes = {
    // 获取客户数据
    data: PropTypes.object.isRequired,
    queryList: PropTypes.func.isRequired,
    // 关闭弹窗
    closeModal: PropTypes.func.isRequired,
    // 弹窗状态
    visible: PropTypes.bool.isRequired,
    // 弹窗 KEY
    modalKey: PropTypes.string.isRequired,
  }


  componentDidMount() {
    // 获取客户
    this.props.queryList({});
  }


  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '关闭分公司客户划转添加客户弹框' } })
  closeModal() {
    // 关闭模态框
    commonConfirm({
      shortCut: 'close',
      onOk: this.clearBoardAllData,
    });
  }

  render() {
    const {
      // data,
      visible,
      closeModal,
      modalKey,
    } = this.props;
    // const { list, page } = data;
    // 客户列表分页
    const paginationOption = {
      current: 1,
      total: 10,
      pageSize: 10,
      onChange: this.pageChangeHandle,
    };

    return (
      <CommonModal
        title="添加客户"
        visible={visible}
        closeModal={() => closeModal(modalKey)}
        size="large"
        modalKey="addCustModal"
        afterClose={this.afterClose}
        wrapClassName={styles.addCustModal}
      >
        <div className={styles.modalContent}>
          <div className={styles.contentItem}>
            <div className={styles.operateDiv}>
              放置添加客户的表单元素
            </div>
            <div className={styles.tableDiv}>
              <CommonTable
                data={[]}
                titleList={titleList.cust}
              />
              <Pagination {...paginationOption} />
            </div>
          </div>
        </div>
      </CommonModal>
    );
  }
}

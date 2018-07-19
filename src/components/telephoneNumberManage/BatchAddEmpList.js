/*
 * @Description: 业务手机申请批量添加服务经理页面
 * @Author: hongguangqing
 * @Date: 2017-09-22 14:49:16
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-04-26 09:40:18
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Table } from 'antd';
import _ from 'lodash';
import CommonModal from '../common/biz/CommonModal';
import styles from './batchAddEmpList.less';
import logable, { logCommon } from '../../decorators/logable';

export default class BatchAddEmpList extends PureComponent {
  static propTypes = {
    closeBatchAddModal: PropTypes.func.isRequired,
    // 获取批量投顾
    batchAdvisorListData: PropTypes.object,
    // 保存批量选中服务经理的数据，用于最终的提交
    saveSelectedBatchEmpList: PropTypes.func.isRequired,
  }

  static defaultProps = {
    batchAdvisorListData: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      // 选中的行key
      selectedRowKeys: [],
    };
  }

  // 手动点击每行选中或取消
  @autobind
  @logable({ type: 'ViewItem', payload: { name: '批量添加服务经理' } })
  onSelectChange(selectedRowKeys) {
    this.setState({ selectedRowKeys });
  }

  // 将用户选择添加的服务经理列表返回到弹出层用于提交
  @autobind
  submitBatchEmplistData() {
    const { selectedRowKeys } = this.state;
    const { batchAdvisorListData, saveSelectedBatchEmpList } = this.props;
    const { advisorList } = batchAdvisorListData;
    const chooseAllBatchEmpList = selectedRowKeys.map(
      item => _.find(advisorList, o => o.empId === item),
    );
    saveSelectedBatchEmpList(chooseAllBatchEmpList);
    // 手动上传日志
    logCommon({
      type: 'Submit',
      payload: {
        name: '批量添加服务经理',
        value: JSON.stringify(chooseAllBatchEmpList),
      },
    });
  }

  // 分页显示总条数和选中总条数
  @autobind
  showTotal(total) {
    const { selectedRowKeys } = this.state;
    // 选中个数
    const selectedRowKeysSize = _.size(selectedRowKeys);
    return (
      <span>
        已选中 <span className={styles.selectedRowKeysSize}>{selectedRowKeysSize}</span> 条 /共 {total} 条
      </span>
    );
  }
  // 关闭新建弹框
  @autobind
  closeModal() {
    this.setState({
      visible: false,
    });
  }

  @autobind
  afterClose() {
    this.props.closeBatchAddModal();
  }

  // 渲染表头
  @autobind
  renderColumnTitle() {
    return [{
      dataIndex: 'empName',
      title: '姓名',
    },
    {
      dataIndex: 'empId',
      title: '工号',
    },
    {
      dataIndex: 'orgName',
      title: '所属营业部',
    }];
  }

  render() {
    const { selectedRowKeys, visible } = this.state;
    const { batchAdvisorListData } = this.props;
    const { advisorList } = batchAdvisorListData;
    // 处理数据，为每个增加key
    const advisorListWithKey = advisorList.map(item => ({ ...item, key: item.empId }));
    // 表头
    const columnTitle = this.renderColumnTitle();
    // 选中个数
    const selectedRowKeysSize = _.size(selectedRowKeys);
    // 数据总个数
    const advisorListTotalNum = _.size(advisorList);
    const text = advisorListTotalNum !== selectedRowKeysSize ? '全选' : '取消全选';
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      hideDefaultSelections: true,
      selections: [{
        text,
        key: 'all-data',
        onSelect: () => {
          // 手动上传日志
          logCommon({
            type: 'Click',
            payload: {
              name: text,
            },
          });
          if (advisorListTotalNum !== selectedRowKeysSize) {
            // 选中的个数不等于总数，此时显示的是全选，点击全部选中
            this.setState({
              selectedRowKeys: advisorListWithKey.map(item => item.key),
            });
          } else {
            // 若选中的个数等于总数，此时显示的是取消全选，点击则全不选
            this.setState({
              selectedRowKeys: [],
            });
          }
        },
      }],
    };
    return (
      <CommonModal
        title="批量添加服务经理"
        visible={visible}
        onOk={this.submitBatchEmplistData}
        closeModal={this.closeModal}
        afterClose={this.afterClose}
        modalKey="myBatchAddEmpListModal"
        wrapClassName={styles.batchAddEmpListModal}
      >
        <div className={styles.batchAddEmpListBox}>
          <div className={styles.tip}>请从以下未分配机卡的服务经理名单中选择：</div>
          <Table
            rowSelection={rowSelection}
            columns={columnTitle}
            dataSource={advisorListWithKey}
            pagination={{
              total: advisorListTotalNum,
              showTotal: this.showTotal,
            }}
          />
        </div>
      </CommonModal>
    );
  }
}

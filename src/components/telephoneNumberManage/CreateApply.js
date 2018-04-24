/**
 * @Author: hongguangqing
 * @Description 业务手机申请新建页面
 * @Date: 2018-04-23 21:37:55
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-04-24 13:10:43
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import CommonModal from '../common/biz/CommonModal';
import InfoTitle from '../common/InfoTitle';
import AddEmpList from './AddEmpList';
import Select from '../common/Select';
import styles from './createApply.less';

export default class CreateFilialeCustTransfer extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    closeCreateModalBoard: PropTypes.func.isRequired,
    // 新建页面获取投顾
    advisorListData: PropTypes.object,
    queryAdvisorList: PropTypes.func.isRequired,
    // 新建页面获取下一步审批人
    nextApprovalData: PropTypes.array,
    queryNextApproval: PropTypes.func.isRequired,
    // 获取批量投顾
    batchAdvisorListData: PropTypes.object.isRequired,
    queryBatchAdvisorList: PropTypes.func.isRequired,
  }

  static defaultProps = {
    advisorListData: {},
    nextApprovalData: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      // 模态框是否显示 默认状态下是隐藏的
      isShowModal: true,
      // 选择添加的服务经理列表
      empLists: [],
      // 选择的审批人
      approval: '',
    };
  }

  componentWillMount() {
    // 获取下一步审批人
    this.props.queryNextApproval({});
  }

  // 关闭新建弹框
  @autobind
  closeModal() {
    this.props.closeCreateModalBoard();
  }

  // 将用户选择添加的服务经理列表返回到弹出层用于提交
  @autobind
  saveSelectedEmpList(list) {
    this.setState({
      empLists: list,
    });
  }

  // 切换审批人
  @autobind
  handleApprovalSelectChange(name, value) {
    this.setState({
      approval: value,
    });
  }

  // 处理审批人数据
  @autobind
  handleApprovalData(data) {
    const options = [];
    _.forEach(data, (item) => {
      const { login, empName } = item;
      const approvalLabel = `${empName}(${login})`;
      options.push({
        show: true,
        label: approvalLabel,
        value: login,
      });
    });
    return options;
  }

  render() {
    const {
      isShowModal,
      approval,
    } = this.state;
    const {
      advisorListData,
      queryAdvisorList,
      nextApprovalData,
      batchAdvisorListData,
      queryBatchAdvisorList,
    } = this.props;
    const { advisorList } = advisorListData;
    // 处理审批人数据
    const newNextApprovalData = this.handleApprovalData(nextApprovalData);
    return (
      <CommonModal
        title="新建公务手机申请"
        visible={isShowModal}
        closeModal={this.closeModal}
        size="large"
        modalKey="myModal"
      >
        <div className={styles.createApplyWrapper} >
          <div id="createApplyEmp_module" className={styles.module}>
            <InfoTitle head="服务经理" />
            <AddEmpList
              queryAdvisorList={queryAdvisorList}
              advisorList={advisorList}
              batchAdvisorListData={batchAdvisorListData}
              queryBatchAdvisorList={queryBatchAdvisorList}
              saveSelectedEmpList={this.saveSelectedEmpList}
            />
          </div>
          <div id="approval_module" className={styles.module}>
            <InfoTitle head="审批" />
            <span className={styles.approvalTip}><span>*</span>选择审批人：</span>
            <Select
              width="160px"
              name="approval"
              data={newNextApprovalData}
              value={approval}
              onChange={this.handleApprovalSelectChange}
            />
          </div>
        </div>
      </CommonModal>
    );
  }
}

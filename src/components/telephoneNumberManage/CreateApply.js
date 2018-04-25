/**
 * @Author: hongguangqing
 * @Description 业务手机申请新建页面
 * @Date: 2018-04-23 21:37:55
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-04-25 19:17:12
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { message } from 'antd';
import _ from 'lodash';
import CommonModal from '../common/biz/CommonModal';
import InfoTitle from '../common/InfoTitle';
import AddEmpList from './AddEmpList';
import Select from '../common/Select';
import commonConfirm from '../common/Confirm';
import styles from './createApply.less';

export default class CreateApply extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 新建页面获取投顾
    advisorListData: PropTypes.object,
    queryAdvisorList: PropTypes.func.isRequired,
    // 新建页面获取下一步审批人
    nextApprovalData: PropTypes.array,
    queryNextApproval: PropTypes.func.isRequired,
    // 获取批量投顾
    batchAdvisorListData: PropTypes.object.isRequired,
    queryBatchAdvisorList: PropTypes.func.isRequired,
    // 新建修改的更新接口
    updateBindingFlowAppId: PropTypes.string.isRequired,
    updateBindingFlow: PropTypes.func.isRequired,
    // 走流程接口
    doApprove: PropTypes.func.isRequired,
    // 更新申请列表
    queryAppList: PropTypes.func.isRequired,
    // 清除数据
    clearProps: PropTypes.func.isRequired,
    onEmitClearModal: PropTypes.func.isRequired,
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
    // 关闭模态框
    commonConfirm({
      shortCut: 'close',
      onOk: this.clearBoardAllData,
    });
  }

  @autobind
  afterClose() {
    this.props.onEmitClearModal('isShowCreateModal');
  }

  // 清空弹出层数据
  @autobind
  clearBoardAllData() {
    this.setState({ isShowModal: false }, () => {
      this.props.clearProps();
    });
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

  @autobind
  sendCreateRequest() {
    const { empLists, approval } = this.state;
    const { updateBindingFlow } = this.props;
    // 用empId去重
    const finalEmplists = _.uniqBy(empLists, 'empId');
    const finalEmplistsSize = _.size(finalEmplists);
    if (_.isEmpty(finalEmplists)) {
      message.error('请添加服务经理');
      return;
    } else if (_.isEmpty(approval)) {
      message.error('请选择审批人');
      return;
    } else if (finalEmplistsSize > 200) {
      message.error('服务经理最多只能添加200条');
      return;
    }
    updateBindingFlow({
      advisorBindingList: finalEmplists,
    }).then(() => {
      this.sendDoApproveRequest();
    });
  }

  // 发送请求，先走新建（修改）接口，再走走流程接口
  @autobind
  sendDoApproveRequest() {
    const {
      doApprove,
      updateBindingFlowAppId,
      queryAppList,
      location: {
        query,
        query: {
          pageNum,
          pageSize,
        },
      },
    } = this.props;
    const { approval } = this.state;
    doApprove({
      itemId: updateBindingFlowAppId,
      groupName: 'fgsfzr_group',
      auditors: approval,
      operate: 'commit',
    }).then(() => {
      message.success('公务手机申请新建成功');
      this.setState({
        isShowModal: false,
      }, () => {
        // 服务经理新建成功，清楚新建弹框的数据
      //  this.props.clearProps();
        queryAppList(query, pageNum, pageSize);
      });
    });
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
        onOk={this.sendCreateRequest}
        closeModal={this.closeModal}
        afterClose={this.afterClose}
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

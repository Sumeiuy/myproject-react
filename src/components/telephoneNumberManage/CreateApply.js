/**
 * @Author: hongguangqing
 * @Description 业务手机申请新建页面
 * @Date: 2018-04-23 21:37:55
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-07 11:12:27
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { message, Modal } from 'antd';
import _ from 'lodash';
import CommonModal from '../common/biz/CommonModal';
import BottonGroup from '../permission/BottonGroup';
import TableDialog from '../common/biz/TableDialog';
import InfoTitle from '../common/InfoTitle';
import AddEmpList from './AddEmpList';
import commonConfirm from '../common/confirm_';
import config from './config';
import styles from './createApply.less';
import { logCommon } from '../../decorators/logable';

// 最大可以选择的服务经理的数量200
const { MAXSELECTNUM, approvalColumns } = config;
export default class CreateApply extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 新建页面获取投顾
    advisorListData: PropTypes.object,
    queryAdvisorList: PropTypes.func.isRequired,
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
    // 获取按钮组
    buttonList: PropTypes.object.isRequired,
    getButtonList: PropTypes.func.isRequired,
    // 验证提交数据
    validateResultData: PropTypes.object.isRequired,
    validateData: PropTypes.func.isRequired,
  }

  static defaultProps = {
    advisorListData: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      // 模态框是否显示 默认状态下是隐藏的
      isShowModal: true,
      // 选择添加的服务经理列表
      empList: [],
      // 下一步审批人列表
      nextApproverList: [],
      // 审批人弹窗
      nextApproverModal: false,
    };
  }

  componentDidMount() {
   // 获取下一步骤按钮列表
    this.props.getButtonList();
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
    this.setState({
      isShowModal: false,
      nextApproverModal: false,
    }, this.props.clearProps);
  }

  // 将用户选择添加的服务经理列表返回到弹出层用于提交
  @autobind
  saveSelectedEmpList(list) {
    this.setState({
      empList: list,
    });
  }

  // 提交
  @autobind
  handleSubmit(item) {
    const { empList } = this.state;
    // 用empId去重
    const finalEmplists = _.uniqBy(empList, 'empId');
    const finalEmplistsSize = _.size(finalEmplists);
    if (_.isEmpty(finalEmplists)) {
      message.error('请添加服务经理');
      return;
    } else if (finalEmplistsSize > MAXSELECTNUM) {
      message.error(`服务经理最多只能添加${MAXSELECTNUM}条`);
      return;
    }
    this.setState({
      operate: item.operate,
      groupName: item.nextGroupName,
      auditors: !_.isEmpty(item.flowAuditors) ? item.flowAuditors[0].login : '',
      nextApproverList: item.flowAuditors,
      nextApproverModal: true,
    });
    // log日志 --- 公务手机卡号申请
    logCommon({
      type: 'Submit',
      payload: {
        name: '公务手机卡号申请',
        value: JSON.stringify(item),
      },
    });
  }

  @autobind
  sendCreateRequest(value) {
    const { updateBindingFlow, validateData } = this.props;
    const { empList } = this.state;
    // 用empId去重
    const finalEmplists = _.uniqBy(empList, 'empId');
    if (_.isEmpty(value)) {
      message.error('请选择审批人');
      return;
    }
    this.setState({
      nextApproverModal: false,
    });
    // 提交前先对提交的数据调验证接口进行进行验证
    // 新建，节点是new，后端规定的且必传
    validateData({
      advisorBindingList: finalEmplists,
      currentNodeCode: 'new',
    }).then(() => {
      const { validateResultData } = this.props;
      const { isValid, msg } = validateResultData;
       // isValid为true，代码数据验证通过，此时可以往下走，为false弹出错误信息
      if (isValid) {
        updateBindingFlow({
          advisorBindingList: finalEmplists,
        }).then(() => {
          this.sendDoApproveRequest(value);
        });
      } else {
        Modal.error({
          title: '提示信息',
          okText: '确定',
          content: msg,
        });
      }
    });
  }

  // 发送请求，先走新建（修改）接口，再走走流程接口
  @autobind
  sendDoApproveRequest(value) {
    const {
      doApprove,
      updateBindingFlowAppId,
      queryAppList,
      location: { query, query: { pageNum, pageSize } },
    } = this.props;
    const { groupName, auditors, operate } = this.state;
    doApprove({
      itemId: updateBindingFlowAppId,
      groupName,
      auditors: !_.isEmpty(value) ? value.login : auditors,
      operate,
    }).then(() => {
      message.success('公务手机申请新建成功');
      this.setState({
        isShowModal: false,
      }, () => {
        // 新建成功，清楚新建弹框的数据
        this.props.clearProps();
        queryAppList(query, pageNum, pageSize);
      });
    });
  }

  render() {
    const {
      isShowModal,
      nextApproverModal,
      nextApproverList,
    } = this.state;
    const {
      advisorListData,
      queryAdvisorList,
      batchAdvisorListData,
      queryBatchAdvisorList,
      buttonList,
    } = this.props;
    const { advisorList } = advisorListData;
    const selfBtnGroup = (<BottonGroup
      list={buttonList}
      onEmitEvent={this.handleSubmit}
    />);
    const searchProps = {
      visible: nextApproverModal,
      onOk: this.sendCreateRequest,
      onCancel: () => { this.setState({ nextApproverModal: false }); },
      dataSource: nextApproverList,
      columns: approvalColumns,
      title: '选择下一审批人员',
      modalKey: 'phoneApplyNextApproverModal',
      rowKey: 'login',
      searchShow: false,
    };
    return (
      <CommonModal
        title="新建公务手机申请"
        visible={isShowModal}
        closeModal={this.closeModal}
        afterClose={this.afterClose}
        size="large"
        modalKey="myModal"
        selfBtnGroup={selfBtnGroup}
      >
        <div className={styles.createApplyWrapper}>
          <div id="createApplyEmp_module" className={styles.module}>
            <InfoTitle head="服务经理" />
            <AddEmpList
              queryAdvisorList={queryAdvisorList}
              advisorList={advisorList}
              batchAdvisorListData={batchAdvisorListData}
              queryBatchAdvisorList={queryBatchAdvisorList}
              onAddEmpList={this.saveSelectedEmpList}
            />
          </div>
          <TableDialog {...searchProps} />
        </div>
      </CommonModal>
    );
  }
}

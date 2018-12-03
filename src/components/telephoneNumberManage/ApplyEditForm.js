/**
 * @Author: hongguangqing
 * @Description: 公务手机卡号申请详情页面
 * @Date: 2018-04-19 18:46:58
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-05-03 22:28:50
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { message, Modal } from 'antd';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import AddEmpList from './AddEmpList';
import BottonGroup from '../permission/BottonGroup';
import TableDialog from '../common/biz/TableDialog';
import ApprovalRecord from '../permission/ApprovalRecord';
import config from './config';
import styles from './applyEditForm.less';

const REJECT_STATUS_CODE = '04'; // 驳回状态code
const COMMITOPERATE = 'commit'; // 提交的operate值
// 最大可以选择的服务经理的数量200
const { MAXSELECTNUM, approvalColumns } = config;
export default class ApplyEditForm extends PureComponent {
  static propTypes = {
    detailInfo: PropTypes.object.isRequired,
    getDetailInfo: PropTypes.func.isRequired,
    empAppBindingList: PropTypes.object.isRequired,
    advisorListData: PropTypes.object.isRequired,
    queryAdvisorList: PropTypes.func.isRequired,
    batchAdvisorListData: PropTypes.object.isRequired,
    queryBatchAdvisorList: PropTypes.func.isRequired,
    updateBindingFlowAppId: PropTypes.string.isRequired,
    updateBindingFlow: PropTypes.func.isRequired,
    doApprove: PropTypes.func.isRequired,
    // 获取按钮组
    buttonList: PropTypes.object.isRequired,
    getButtonList: PropTypes.func.isRequired,
    // 验证提交数据
    validateResultData: PropTypes.object.isRequired,
    validateData: PropTypes.func.isRequired,
    // 删除绑定的服务经理
    deleteBindingAdvisor: PropTypes.func.isRequired,
  }

  static defaultProps = {
    // attachmentList: [],
  }

  constructor(props) {
    super(props);
    const { empAppBindingList, buttonList } = this.props;
    const { advisorBindList } = empAppBindingList;
    this.state = {
      // 选择添加的服务经理列表,默认为修改前添加的服务列表
      empList: advisorBindList,
      // 审批人弹框默认false不显示
      nextApproverModal: false,
      // 下一步审批人列表
      nextApproverList: [],
      // 按钮组信息
      buttonListData: buttonList,
    };
  }

  componentDidMount() {
    const {
      flowId,
      statusCode,
    } = this.props.detailInfo;
    if (statusCode === REJECT_STATUS_CODE) {
      // 获取下一步骤按钮列表
      this.props.getButtonList({ flowId });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { buttonList } = nextProps;
    if (buttonList !== this.props.buttonList) {
      this.setState({ buttonListData: buttonList });
    }
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
    } if (finalEmplistsSize > MAXSELECTNUM) {
      message.error(`服务经理最多只能添加${MAXSELECTNUM}条`);
      return;
    }
    this.setState({
      operate: item.operate,
      groupName: item.nextGroupName,
      auditors: !_.isEmpty(item.flowAuditors) ? item.flowAuditors[0].login : '',
      nextApproverList: item.flowAuditors,
    }, () => {
      // approverNum为none代表没有审批人，则不需要弹审批弹框直接走接口
      // 终止按钮的approverNum为none，提交按钮的approverNum不为none
      if (item.approverNum !== 'none') {
        this.setState({
          nextApproverModal: true,
        });
      } else {
        this.sendDoApproveRequest();
      }
    });
  }

  // 发送修改请求,先走修改接口，再走走流程接口
  @autobind
  sendModifyRequest(value) {
    const { validateData, detailInfo } = this.props;
    const { flowId, appId, currentNodeCode } = detailInfo;
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
    // 驳回重新提交，节点是submit，后端规定的且必传
    validateData({
      advisorBindingList: finalEmplists,
      currentNodeCode: 'resubmit',
    }).then(() => {
      const { updateBindingFlow, validateResultData } = this.props;
      const { isValid, msg } = validateResultData;
      // isValid为true，代码数据验证通过，此时可以往下走，为false弹出错误信息
      if (isValid) {
        updateBindingFlow({
          flowId,
          appId,
          currentNodeCode,
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

  // 发送请求，走流程接口
  @autobind
  sendDoApproveRequest(value) {
    const { doApprove, detailInfo, getDetailInfo } = this.props;
    const { appId, flowId } = detailInfo;
    const { groupName, auditors, operate } = this.state;
    doApprove({
      itemId: appId,
      flowId,
      wobNum: flowId,
      // 下一组ID
      groupName,
      operate,
      // 审批人
      auditors: !_.isEmpty(value) ? value.login : auditors,
    }).then(() => {
      if (operate === COMMITOPERATE) {
        message.success('公务手机申请修改成功');
      } else {
        message.success('该业务手机申请已被终止');
      }
      this.setState({
        buttonListData: {},
      }, () => {
        getDetailInfo({ flowId });
      });
    });
  }

  render() {
    const {
      id,
      empId,
      empName,
      orgName,
      createTime,
      statusDesc,
      currentApproval,
      workflowHistoryBeans,
      currentNodeName,
    } = this.props.detailInfo;
    const {
      queryAdvisorList,
      advisorListData,
      batchAdvisorListData,
      queryBatchAdvisorList,
      empAppBindingList,
      deleteBindingAdvisor,
    } = this.props;
    const {
      nextApproverModal,
      buttonListData,
      nextApproverList,
    } = this.state;
    const { advisorBindList } = empAppBindingList;
    const { advisorList } = advisorListData;
    if (_.isEmpty(this.props.detailInfo)) {
      return null;
    }
    // 拟稿人信息
    const drafter = `${orgName} - ${empName} (${empId})`;
    // 审批人弹框
    const searchProps = {
      visible: nextApproverModal,
      onOk: this.sendModifyRequest,
      onCancel: () => { this.setState({ nextApproverModal: false }); },
      dataSource: nextApproverList,
      columns: approvalColumns,
      title: '选择下一审批人员',
      modalKey: 'phoneEditNextApproverModal',
      rowKey: 'login',
      searchShow: false,
    };
    return (
      <div className={styles.applyEditFormbox}>
        <div className={styles.inner}>
          <div className={styles.innerWrap}>
            <h1 className={styles.title}>
编号
              {id}
            </h1>
            <div id="createApplyEmp_module" className={styles.module}>
              <InfoTitle head="服务经理" />
              <AddEmpList
                queryAdvisorList={queryAdvisorList}
                advisorList={advisorList}
                batchAdvisorListData={batchAdvisorListData}
                queryBatchAdvisorList={queryBatchAdvisorList}
                onAddEmpList={this.saveSelectedEmpList}
                advisorBindList={advisorBindList}
                pageType="edit"
                deleteBindingAdvisor={deleteBindingAdvisor}
              />
            </div>
            <div id="nginformation_module" className={styles.module}>
              <InfoTitle head="拟稿信息" />
              <div className={styles.modContent}>
                <ul className={styles.propertyList}>
                  <li className={styles.item}>
                    <InfoItem label="拟稿人" value={drafter} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="申请请时间" value={createTime} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="状态" value={statusDesc} />
                  </li>
                </ul>
              </div>
            </div>
            <ApprovalRecord
              head="审批记录"
              info={workflowHistoryBeans}
              currentApproval={currentApproval}
              currentNodeName={currentNodeName}
              statusType="ready"
            />
            <BottonGroup
              list={buttonListData}
              onEmitEvent={this.handleSubmit}
            />
            <TableDialog {...searchProps} />
          </div>
        </div>
      </div>
    );
  }
}

/**
 * @Author: hongguangqing
 * @Description: 分公司客户人工划转修改页面
 * @Date: 2018-01-30 09:43:02
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-02-02 15:36:33
 */

import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { message, Modal } from 'antd';
import _ from 'lodash';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import InfoForm from '../../components/common/infoForm';
import DropDownSelect from '../../components/common/dropdownSelect';
import ApprovalRecord from '../permission/ApprovalRecord';
import BottonGroup from '../permission/BottonGroup';
import TableDialog from '../common/biz/TableDialog';
import CommonTable from '../common/biz/CommonTable';
import Pagination from '../common/Pagination';
import { seibelConfig } from '../../config';
import styles from './editForm.less';

const confirm = Modal.confirm;
// 表头
const { titleList, approvalColumns } = seibelConfig.filialeCustTransfer;
const SINGLECUSTTRANSFER = '0701'; // 单客户人工划转
const OVERFLOWBTNID = 118006; // 终止按钮的flowBtnId
// 下拉搜索组件样式
const dropDownSelectBoxStyle = {
  width: 220,
  height: 32,
  border: '1px solid #d9d9d9',
};

export default class FilialeCustTransferEditForm extends PureComponent {
  static propTypes = {
    // 详情列表
    data: PropTypes.object.isRequired,
    // 获取客户列表
    getCustList: PropTypes.func.isRequired,
    custList: PropTypes.array,
    // 获取新服务经理
    getNewManagerList: PropTypes.func.isRequired,
    newManagerList: PropTypes.array,
    // 选择新的服务经理
    getOrigiManagerList: PropTypes.func.isRequired,
    origiManagerList: PropTypes.object,
    // 提交保存
    saveChange: PropTypes.func.isRequired,
    // 走流程
    doApprove: PropTypes.func.isRequired,
    // 获取按钮列表和下一步审批人
    buttonList: PropTypes.object.isRequired,
    getButtonList: PropTypes.func.isRequired,
    // 客户表格的分页信息
    getPageAssignment: PropTypes.func.isRequired,
    pageAssignment: PropTypes.object,
  }

  static defaultProps = {
    custList: [],
    newManagerList: [],
    origiManagerList: {},
    pageAssignment: {},
  }

  constructor(props) {
    super(props);
    const { assignmentList } = props.data;
    this.state = {
      // 审批人弹框
      nextApproverModal: false,
      // 下一审批人列表
      nextApproverList: [],
      // 客户信息
      client: {
        custName: assignmentList[0].custName,
        brokerNumber: assignmentList[0].brokerNumber,
        custId: assignmentList[0].custId,
        custType: assignmentList[0].custType,
      },
      // 所选新服务经理
      newManager: {
        newEmpName: assignmentList[0].newEmpName,
        newLogin: assignmentList[0].newEmpId,
        newIntegrationId: assignmentList[0].newIntegrationId,
        newPostnId: assignmentList[0].newPostnId,
        newPostnName: assignmentList[0].newPostnName,
        newOrgName: assignmentList[0].newOrgName,
      },
      assignmentListData: assignmentList,
    };
  }

  componentWillMount() {
    const {
      flowId,
    } = this.props.data;
    // 获取下一步骤按钮列表
    this.props.getButtonList({ flowId });
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    if (data !== this.props.data) {
      this.setState({ assignmentListData: data.assignmentList });
    }
  }


  // 切换页码
  @autobind
  handlePageNumberChange(nextPage, currentPageSize) {
    const { appId } = this.props.data;
    this.props.getPageAssignment({
      appId,
      pageNum: nextPage,
      pageSize: currentPageSize,
    }).then(() => {
      const { pageAssignment } = this.props;
      this.setState({
        assignmentListData: pageAssignment.assignmentList,
      });
    });
  }

  // 选择客户
  @autobind
  handleSelectClient(v) {
    this.setState({
      client: v,
      newManager: {},
      assignmentListData: [{
        ...this.state.assignmentListData[0],
        newEmpName: '',
        newOrgName: '',
        newPostnName: '',
      }],
    }, () => {
      // 选择客户之后触发查询该客户的原服务经理
      const { getOrigiManagerList } = this.props;
      getOrigiManagerList({
        brokerNumber: v.brokerNumber,
      }).then(() => {
        this.setState({
          assignmentListData: [{
            ...this.state.assignmentListData[0],
            ...this.props.origiManagerList,
          }],
        });
      });
    });
  }

  // 查询客户
  @autobind
  handleSearchClient(v) {
    if (!v) {
      return;
    }
    const { getCustList } = this.props;
    getCustList({
      keyword: v,
    });
  }

  // 选择新服务经理
  @autobind
  handleSelectNewManager(v) {
    this.setState({
      newManager: v,
    }, () => {
      const { assignmentListData } = this.state;
      this.setState({
        assignmentListData: [{
          ...assignmentListData[0],
          ...v,
        }],
      });
    });
  }

  // 查询新服务经理
  @autobind
  handleSearchNewManager(v) {
    if (!v) {
      return;
    }
    const { getNewManagerList } = this.props;
    getNewManagerList({
      login: v,
    });
  }

  // 点击按钮进行相应处理
  @autobind
  handleButtonInfo(item) {
    // 修改状态下的提交按钮
    // 点击按钮后 弹出下一审批人 模态框
    this.setState({
      operate: item.operate,
      groupName: item.nextGroupName,
      approverIdea: item.btnName,
      auditors: item.flowAuditors.login,
      nextApproverList: item.flowAuditors,
    }, () => {
      if (item.flowBtnId !== OVERFLOWBTNID) {
        this.setState({
          nextApproverModal: true,
        });
      } else {
        this.sendDoApproveRequest();
      }
    });
  }

  // 提交前校验
  @autobind
  submitCreateInfo(item) {
    const { client, newManager } = this.state;
    const { origiManagerList } = this.props;
    if (_.isEmpty(client)) {
      message.error('请选择客户');
      return;
    }
    if (_.isEmpty(newManager)) {
      message.error('请选择新客户经理');
      return;
    }
    if (origiManagerList.hasContract) {
      confirm({
        title: '确认要划转吗?',
        content: '该客户名下有生效中的合作合约，请确认是否划转?',
        onOk: () => {
          this.handleButtonInfo(item);
        },
      });
      return;
    }
    this.handleButtonInfo(item);
  }

  // 发送单客户终止或者批量客户终止的请求,只需要走走流程接口
  @autobind
  sendDoApproveRequest() {
    const { flowId, appId } = this.props.data;
    const { doApprove } = this.props;
    doApprove({
      itemId: appId,
      wobNum: flowId,
      flowId,
      // 下一组ID
      groupName: this.state.groupName,
      approverIdea: this.state.approverIdea,
      auditors: this.state.auditors,
      operate: this.state.operate,
    }).then(() => {
      message.success('提交成功，后台正在进行数据处理！若数据处理失败，将在首页生成一条通知提醒。');
      this.setState({ nextApproverModal: false });
    });
  }

  // 发送单客户修改请求,先走修改接口，再走走流程接口
  @autobind
  sendModifyRequest() {
    const { client, newManager } = this.state;
    const { saveChange } = this.props;
    saveChange({
      custId: client.custId,
      custType: client.custType,
      integrationId: newManager.newIntegrationId,
      orgName: newManager.newOrgName,
      postnName: newManager.newPostnName,
      postnId: newManager.newPostnId,
    }).then(() => {
      this.sendDoApproveRequest();
    });
  }


  render() {
    const {
      id,
      subType,
      subTypeDesc,
      workflowHistoryBeans,
      currentApproval,
      createTime,
      status,
      orgName,
      empName,
      empId,
      page,
    } = this.props.data;
    // 拟稿人信息
    const drafter = `${orgName} - ${empName} (${empId})`;
    const { custList, newManagerList, buttonList } = this.props;
    const { client, newManager, assignmentListData } = this.state;
    // 批量人工划转只能终止不能修改，单客户可以终止也可以修改
    const searchProps = {
      visible: this.state.nextApproverModal,
      onOk: this.sendModifyRequest,
      onCancel: () => { this.setState({ nextApproverModal: false }); },
      dataSource: this.state.nextApproverList,
      columns: approvalColumns,
      title: '选择下一审批人员',
      placeholder: '员工号/员工姓名',
      modalKey: 'nextApproverModal',
      rowKey: 'login',
      searchShow: false,
    };
    if (_.isEmpty(this.props.data)) {
      return null;
    }
    // 分页
    const paginationOption = {
      curPageNum: page.curPageNum,
      totalRecordNum: page.totalRecordNum,
      curPageSize: page.pageSize,
      onPageChange: this.handlePageNumberChange,
    };
    return (
      <div className={styles.editFormBox}>
        <div className={styles.inner}>
          <div className={styles.innerWrap}>
            <h1 className={styles.title}>编号{id}</h1>
            <div id="detailModule" className={styles.module}>
              <InfoTitle head="基本信息" />
              <div className={styles.modContent}>
                <div className={styles.propertyList}>
                  <div className={styles.item}>
                    <InfoItem label="划转方式" value={subTypeDesc} width="160px" />
                  </div>
                  {
                    subType !== SINGLECUSTTRANSFER ?
                    null
                    :
                    <div className={styles.selectBox}>
                      <div className={styles.selectLeft}>
                        <InfoForm label="选择客户" required>
                          <DropDownSelect
                            placeholder="选择客户"
                            showObjKey="custName"
                            objId="brokerNumber"
                            value={`${client.custName || ''} ${client.brokerNumber || ''}` || ''}
                            searchList={custList}
                            emitSelectItem={this.handleSelectClient}
                            emitToSearch={this.handleSearchClient}
                            boxStyle={dropDownSelectBoxStyle}
                            ref={ref => this.queryCustComponent = ref}
                          />
                        </InfoForm>
                      </div>
                      <div className={styles.selectRight}>
                        <InfoForm label="选择新服务经理" required>
                          <DropDownSelect
                            placeholder="选择新服务经理"
                            showObjKey="newEmpName"
                            objId="newLogin"
                            value={`${newManager.newEmpName || ''} ${newManager.newLogin || ''}` || ''}
                            searchList={newManagerList}
                            emitSelectItem={this.handleSelectNewManager}
                            emitToSearch={this.handleSearchNewManager}
                            boxStyle={dropDownSelectBoxStyle}
                            ref={ref => this.queryManagerComponent = ref}
                          />
                        </InfoForm>
                      </div>
                    </div>
                  }
                </div>
                <CommonTable
                  data={assignmentListData}
                  titleList={titleList}
                />
                {
                  subType !== SINGLECUSTTRANSFER ?
                    <Pagination
                      {...paginationOption}
                    />
                  :
                  null
                }
              </div>
            </div>
            <div id="nginformation_module" className={styles.module}>
              <InfoTitle head="拟稿信息" />
              <div className={styles.modContent}>
                <ul className={styles.propertyList}>
                  <li className={styles.item}>
                    <InfoItem label="拟稿人" value={drafter} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="提请时间" value={createTime} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="状态" value={status} />
                  </li>
                </ul>
              </div>
            </div>
            <div id="approvalRecord_module">
              <ApprovalRecord
                head="审批记录"
                info={workflowHistoryBeans}
                currentApproval={currentApproval}
                statusType="modify"
              />
            </div>
            <div id="button_module" className={styles.buttonModule}>
              <BottonGroup
                list={buttonList}
                onEmitEvent={this.submitCreateInfo}
              />
            </div>
            <TableDialog {...searchProps} />
          </div>
        </div>
      </div>
    );
  }
}

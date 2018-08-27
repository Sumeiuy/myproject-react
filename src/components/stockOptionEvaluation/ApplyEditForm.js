/*
 * @Author: zhangjun
 * @Date: 2018-06-15 09:08:24
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-08-03 22:05:35
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { message, Modal } from 'antd';
import _ from 'lodash';

import InfoTitle from '../common/InfoTitle';
import BottonGroup from '../permission/BottonGroup';
import TableDialog from '../common/biz/TableDialog';
import commonConfirm from '../common/confirm_';
import EditBasicInfo from './EditBasicInfo';
import AssessTable from './AssessTable';
import CommonUpload from '../common/biz/CommonUpload';
import Approval from '../permission/Approval';
import ApproveList from '../common/approveList';
import { approvalColumns } from './config';
import { data } from '../../helper';
import logable, { logPV, logCommon } from '../../decorators/logable';

import styles from './applyEditForm.less';

const EMPTY_INFO = '--';
const SRTYPE = 'SRStkOpReq';
const STOPOPERATE = 'falseOver'; // 终止的operate值

export default class ApplyEditForm extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 详情数据
    detailInfo: PropTypes.object.isRequired,
    getDetailInfo: PropTypes.func.isRequired,
    // 附件列表
    attachmentList: PropTypes.array,
    // 客户类型下拉列表
    stockCustTypeList: PropTypes.array.isRequired,
    // 申请类型下拉列表
    reqTypeList: PropTypes.array.isRequired,
    // 开立期权市场类别下拉列表
    optionMarketTypeList: PropTypes.array.isRequired,
    // 业务受理营业部下拉列表
    busDivisionList: PropTypes.array.isRequired,
    // 受理营业部变更
    acceptOrgData: PropTypes.object.isRequired,
    queryAcceptOrg: PropTypes.func.isRequired,
    // 编辑页面获取下一步按钮和审批人
    editButtonListData: PropTypes.object.isRequired,
    getEditButtonList: PropTypes.func.isRequired,
    // 验证提交数据结果
    validateResultData: PropTypes.object.isRequired,
    validateResult: PropTypes.func.isRequired,
    // 走流程接口
    doApprove: PropTypes.func.isRequired,
    // 新建修改的更新接口
    updateBindingFlowAppId: PropTypes.string.isRequired,
    updateBindingFlow: PropTypes.func.isRequired,
    clearReduxData: PropTypes.func.isRequired,
  }
  static defaultProps = {
    attachmentList: [],
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.editButtonListData !== prevState.editButtonList) {
      return {
        editButtonList: nextProps.editButtonListData,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const { detailInfo } = this.props;
    this.state = {
      // 是否是编辑页面
      isEdit: true,
      // 审批意见
      suggestion: '',
      // 下一步审批人列表
      nextApproverList: [],
      // 审批人弹窗
      nextApproverModal: false,
      // 客户交易级别
      custTransLv: detailInfo.custTransLv,
      // 客户交易级别Name
      custTransLvName: detailInfo.custTransLvName,
      // 股票客户类型
      stockCustType: detailInfo.stockCustType,
      // 申请类型
      reqType: detailInfo.reqType,
      // 开立期权市场类别
      openOptMktCatg: detailInfo.openOptMktCatg,
      // 业务受理营业部
      busPrcDivId: detailInfo.busPrcDivId,
      // 受理时间
      accptTime: detailInfo.accptTime,
      // 申报事项
      declareBus: detailInfo.declareBus,
      // 已提供大专及以上的学历证明材料
      degreeFlag: detailInfo.degreeFlag,
      // A股账户开立时间6个月以上
      aAcctOpenTimeFlag: detailInfo.aAcctOpenTimeFlag,
      // 已开立融资融券账户
      rzrqzqAcctFlag: detailInfo.rzrqzqAcctFlag,
      // 已提供金融期货交易证明
      jrqhjyFlag: detailInfo.jrqhjyFlag,
      // 附件
      attachment: detailInfo.attachment,
      // 按钮组信息
      editButtonList: {},
      // 用于重新渲染上传组件的key
      uploadKey: data.uuid(),
      // 附件是否可以编辑，终止流程后附件不能编辑
      isAttachmentEdit: true,
    };
  }

  componentDidMount() {
    // 获取下一步按钮和审批人
    this.getEditButtonList();
  }

  // 获取下一步按钮和审批人
  @autobind
  getEditButtonList() {
    const { detailInfo: { flowId } } = this.props;
    this.props.getEditButtonList({ flowId });
  }

  // 更新基本信息数据
  @autobind
  handleChange(obj) {
    this.setState({ ...obj });
  }

  // 修改审批意见
  @autobind
  changeTextValue(name, value) {
    this.setState({ suggestion: value });
  }

  // 校验必填项
  @autobind
  checkIsRequired() {
    const {
      detailInfo: {
        stockCustType,
        reqType,
        invFlag,
        ageFlag,
      },
    } = this.props;
    const {
      custTransLvName,
      openOptMktCatg,
      declareBus,
      degreeFlag,
      aAcctOpenTimeFlag,
      rzrqzqAcctFlag,
      jrqhjyFlag,
    } = this.state;
    // 客户交易级别校验
    if (!custTransLvName) {
      this.setCustTransLvErrorProps();
    }
    // 开立期权市场类别校验
    if (!openOptMktCatg) {
      this.setOpenOptMktCatgErrorProps();
    }
    // 申报事项校验
    if (!declareBus) {
      this.setOpenDeclareBusErrorProps();
    }
    // 检测是否是新开客户，初次申请，学历提示选项校验，和投资经历评估3个提示选项校验
    if (stockCustType === 'New' && reqType === 'New') {
      // 学历不符合
      if (ageFlag === 'N') {
        if (!degreeFlag) {
          this.setDegreeFlagErrorProps();
        }
      }
      // 投资经历不符合
      if (invFlag === 'N') {
        if (!aAcctOpenTimeFlag) {
          this.setAAcctOpenTimeFlagErrorProps();
        }
        if (!rzrqzqAcctFlag) {
          this.setRzrqzqAcctFlagErrorProps();
        }
        if (!jrqhjyFlag) {
          this.setJrqhjyFlagErrorProps();
        }
      }
    }
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '$args[0].btnName' } })
  handleSubmit(item) {
    this.setState({
      operate: item.operate,
      groupName: item.nextGroupName,
      auditors: !_.isEmpty(item.flowAuditors) ? item.flowAuditors[0].login : '',
      nextApproverList: item.flowAuditors,
      defaultNextApproverList: item.flowAuditors,
      currentNodeName: item.currentNodeName,
      approverNum: item.approverNum,
    }, () => {
      // approverNum为none代表没有审批人，则不需要弹审批弹框直接走接口
      // 终止按钮的approverNum为none，提交按钮的approverNum不为none
      if (item.approverNum !== 'none') {
        // 校验必填项
        const { validateFieldsAndScroll } = this.basicInfoForm.getForm();
        validateFieldsAndScroll((err) => {
          if (!err) {
            const {
              detailInfo: {
                custType,
                isProfessInvset,
              },
            } = this.props;
            // 个人客户且是专业投资者
            if (custType === 'per' && isProfessInvset === 'Y') {
              commonConfirm({
                content: '请确认是否上传客户朗读风险揭示书确认条款的视频及其它适当性评估材料。',
                onOk: this.validateResult,
              });
            } else {
              commonConfirm({
                content: '请确认是否已上传相关附件。',
                onOk: this.validateResult,
              });
            }
          }
        });
      } else {
        this.sendDoApproveRequest();
      }
    });
  }

  // 展示下一步审批人
  @autobind
  @logPV({ pathname: '/modal/choiceApproval', title: '选择下一步审批人' })
  showNextApprover() {
    this.setState({
      nextApproverModal: true,
    });
  }

  // 校验数据
  @autobind
  validateResult() {
    // 校验的数据
    const {
      detailInfo: {
        bizId,
        econNum,
        custType,
        stockCustType,
        reqType,
        invFlag,
        nonAlertblackFlag,
        riskEval,
        riskEvalTime,
        ageFlag,
        investPrefer,
      },
    } = this.props;
    const {
      custTransLv,
      aAcctOpenTimeFlag,
      rzrqzqAcctFlag,
      jrqhjyFlag,
      degreeFlag,
    } = this.state;
    const query = {
      bizId,
      econNum,
      custTransLv,
      custType,
      stockCustType,
      reqType,
      aAcctOpenTimeFlag,
      rzrqzqAcctFlag,
      jrqhjyFlag,
      invFlag,
      nonAlertblackFlag,
      riskEval,
      riskEvalTime,
      ageFlag,
      degreeFlag,
      investPrefer,
    };
    // 提交前先对提交的数据调验证接口进行进行验证
    this.props.validateResult(query)
      .then(() => {
        const {
          validateResultData: {
            isValid,
            msg,
          },
        } = this.props;
        // isValid为true，代码数据验证通过，此时可以往下走，为false弹出错误信息
        if (isValid) {
          this.sendEditRequest();
        } else {
          Modal.error({
            title: '提示信息',
            okText: '确定',
            content: msg,
          });
        }
      });
  }

  // 发送请求，先走修改接口，再走流程
  @autobind
  sendEditRequest() {
    const {
      detailInfo: {
        id,
        bizId,
        flowId,
        econNum,
        custId,
        custName,
        custType,
        stockCustType,
        reqType,
        divisionId,
        openDivId,
        idType,
        idNum,
        aAcct,
        openSys,
        isProfessInvset,
        invFlag,
        nonAlertblackFlag,
        riskEval,
        riskEvalTime,
        ageFlag,
        investPrefer,
      },
    } = this.props;
    const {
      custTransLv,
      aAcctOpenTimeFlag,
      rzrqzqAcctFlag,
      jrqhjyFlag,
      degreeFlag,
      openOptMktCatg,
      busPrcDivId,
      accptTime,
      declareBus,
      attachment,
      suggestion,
    } = this.state;
    const query = {
      id,
      bizId,
      flowId,
      custId,
      custName,
      custType,
      econNum,
      divisionId,
      openDivId,
      idType,
      idNum,
      aAcct,
      openSys,
      isProfessInvset,
      custTransLv,
      stockCustType,
      reqType,
      openOptMktCatg,
      busPrcDivId,
      accptTime,
      declareBus,
      srType: SRTYPE,
      attachment,
      aAcctOpenTimeFlag,
      rzrqzqAcctFlag,
      jrqhjyFlag,
      invFlag,
      nonAlertblackFlag,
      riskEval,
      riskEvalTime,
      ageFlag,
      degreeFlag,
      investPrefer,
      suggestion,
    };
    this.props.updateBindingFlow(query)
      .then(() => {
        // 神策上报修改表单
        logCommon({
          type: 'Submit',
          payload: {
            name: '股票期权申请修改',
            vlaue: JSON.stringify(query),
          },
        });
        this.showNextApprover();
      });
  }

  // 流程接口
  @autobind
  sendDoApproveRequest(value) {
    const { approverNum } = this.state;
    if (approverNum !== 'none') {
      if (_.isEmpty(value)) {
        message.error('请选择审批人');
        return;
      }
      this.setState({
        nextApproverModal: false,
      });
    }
    const { doApprove, detailInfo, getDetailInfo } = this.props;
    const { bizId, flowId } = detailInfo;
    const {
      groupName,
      auditors,
      operate,
      currentNodeName,
      suggestion,
    } = this.state;
    doApprove({
      itemId: bizId,
      flowId,
      wobNum: flowId,
      // 下一组ID
      groupName,
      operate,
      // 审批人
      auditors: !_.isEmpty(value) ? value.login : auditors,
      currentNodeName,
      approverIdea: suggestion,
    }).then(() => {
      if (operate === STOPOPERATE) {
        message.success('该股票期权申请已被终止');
      } else {
        message.success('股票期权申请修改成功');
      }
      getDetailInfo({ flowId }).then(() => {
        this.props.clearReduxData({ editButtonListData: {} });
        this.setState({
          editButtonList: {},
          isAttachmentEdit: false,
        });
      });
    });
  }

  @autobind
  setBasicInfoFormRef(form) {
    this.basicInfoForm = form;
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '上传附件' } })
  updateValue(attachment) {
    this.setState({ attachment });
  }

  // 搜索下一步审批人
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '搜索下一步审批人',
      value: '$args[0]',
    },
  })
  handleSearchApproval(value) {
    const { defaultNextApproverList } = this.state;
    const filterNextApproverList = _.filter(defaultNextApproverList,
      item => (item.login.indexOf(value) > -1 || item.empName.indexOf(value) > -1));
    this.setState({ nextApproverList: filterNextApproverList });
  }

  render() {
    const {
      detailInfo,
      detailInfo: {
        econNum,
        custName,
        id,
        empId,
        empName,
        orgName,
        createTime,
        statusDesc,
        custType,
        workflowHistoryBeans,
      },
      attachmentList,
      stockCustTypeList,
      optionMarketTypeList,
      reqTypeList,
      busDivisionList,
      acceptOrgData,
      queryAcceptOrg,
    } = this.props;
    const {
      isEdit,
      suggestion,
      accptTime,
      openOptMktCatg,
      busPrcDivId,
      custTransLv,
      custTransLvName,
      degreeFlag,
      aAcctOpenTimeFlag,
      rzrqzqAcctFlag,
      jrqhjyFlag,
      nextApproverModal,
      nextApproverList,
      attachment,
      uploadKey,
      editButtonList,
      isAttachmentEdit,
    } = this.state;
    if (_.isEmpty(this.props.detailInfo)) {
      return null;
    }
    const custInfo = `${custName}(${econNum})`;
    // 拟稿人信息
    const drafter = `${orgName} - ${empName} (${empId})`;
    // 判断是否是个人客户
    const isPerCustType = custType === 'per';
    const searchProps = {
      visible: nextApproverModal,
      onOk: this.sendDoApproveRequest,
      onCancel: () => { this.setState({ nextApproverModal: false }); },
      dataSource: nextApproverList,
      columns: approvalColumns,
      title: '选择下一审批人员',
      modalKey: 'stockApplyNextApproverModal',
      rowKey: 'login',
      searchShow: true,
      placeholder: '员工工号/员工姓名',
      onSearch: this.handleSearchApproval,
      pagination: {
        pageSize: 10,
      },
    };
    return (
      <div className={styles.applyEditForm}>
        <div className={styles.inner}>
          <div className={styles.innerWrap}>
            <h1 className={styles.title}>编号{id}</h1>
            <div className={styles.module}>
              <div className={styles.coloumn}>
                <div className={styles.label}>
                  <i className={styles.isRequired}>*</i>
                  客户
                  <span className={styles.colon}>:</span>
                </div>
                <div className={styles.value}>
                  { custInfo || EMPTY_INFO }
                </div>
              </div>
              <EditBasicInfo
                wrappedComponentRef={this.setBasicInfoFormRef}
                isEdit={isEdit}
                stockCustTypeList={stockCustTypeList}
                optionMarketTypeList={optionMarketTypeList}
                reqTypeList={reqTypeList}
                busDivisionList={busDivisionList}
                custInfo={detailInfo}
                accptTime={accptTime}
                openOptMktCatg={openOptMktCatg}
                busPrcDivId={busPrcDivId}
                custTransLv={custTransLv}
                custTransLvName={custTransLvName}
                degreeFlag={degreeFlag}
                aAcctOpenTimeFlag={aAcctOpenTimeFlag}
                rzrqzqAcctFlag={rzrqzqAcctFlag}
                jrqhjyFlag={jrqhjyFlag}
                onChange={this.handleChange}
                acceptOrgData={acceptOrgData}
                queryAcceptOrg={queryAcceptOrg}
              />
            </div>
            {
              isPerCustType ?
                (
                  <div className={styles.module}>
                    <InfoTitle head="适当性评估表" />
                    <AssessTable data={detailInfo} />
                  </div>
                )
              : null
            }
            <div className={styles.module}>
              <InfoTitle head="拟稿信息" />
              <div className={styles.modContent}>
                <ul className={styles.propertyList}>
                  <li className={styles.item}>
                    <div className={styles.coloumn}>
                      <div className={styles.label}>
                        拟稿人
                        <span className={styles.colon}>:</span>
                      </div>
                      <div className={styles.value}>
                        {drafter || EMPTY_INFO}
                      </div>
                    </div>
                  </li>
                  <li className={styles.item}>
                    <div className={styles.coloumn}>
                      <div className={styles.label}>
                        申请请时间
                        <span className={styles.colon}>:</span>
                      </div>
                      <div className={styles.value}>
                        {createTime || EMPTY_INFO}
                      </div>
                    </div>
                  </li>
                  <li className={styles.item}>
                    <div className={styles.coloumn}>
                      <div className={styles.label}>
                        状态
                        <span className={styles.colon}>:</span>
                      </div>
                      <div className={styles.value}>
                        {statusDesc || EMPTY_INFO}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className={styles.module}>
              <InfoTitle head="附件信息" />
              <CommonUpload
                edit={isAttachmentEdit}
                reformEnable
                key={uploadKey}
                attachment={attachment || ''}
                needDefaultText={false}
                attachmentList={attachmentList}
                wrapClassName={styles.stockAttachmentList}
                uploadAttachment={this.updateValue}
              />
            </div>
            <Approval
              head="审批"
              type="suggestion"
              textValue={suggestion}
              onEmitEvent={this.changeTextValue}
            />
            <div className={styles.approveList}>
              <InfoTitle head="审批记录" />
              <ApproveList data={workflowHistoryBeans} />
            </div>
            <BottonGroup
              list={editButtonList}
              onEmitEvent={this.handleSubmit}
            />
            <TableDialog {...searchProps} />
          </div>
        </div>
      </div>
    );
  }
}

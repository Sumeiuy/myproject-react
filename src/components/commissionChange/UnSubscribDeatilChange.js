/**
 * @file components/commissionChange/UnSubscribDeatilChange.js
 * @description 资讯退订驳回再修改页面
 * @author baojiajia
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input, Icon, message } from 'antd';
import _ from 'lodash';

import RejectButtons from './RejectButtons';
import CommonUpload from '../../components/common/biz/CommonUpload';
import Transfer from '../../components/common/biz/TableTransfer';
import ChoiceApproverBoard from '../../components/commissionAdjustment/ChoiceApproverBoard';
import InfoTitle from '../../components/common/InfoTitle';
import CommissionLine from '../../components/commissionAdjustment/CommissionLine';
import {
  pagination,
  subScribeProColumns,
} from '../../components/commissionAdjustment/commissionTransferHelper/transferPropsHelper';

import styles from './change.less';

const { TextArea } = Input;

export default class UnSubscribeDetailToChange extends PureComponent {
  static propTypes = {
    empInfo: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    // 退订详情
    getUnSubDetailToChange: PropTypes.func.isRequired,
    unSubDetailToChange: PropTypes.object.isRequired,
    // 新建咨讯退订提交接口
    submitUnSub: PropTypes.func.isRequired,
    // 修改咨讯退订提交后返回值
    consultUnSubId: PropTypes.string.isRequired,
    // 根据接口返回的操作按钮
    approvalBtns: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      remark: '',
      choiceApprover: false,
      approverName: '',
      approverId: '',
      attachment: '',
      unSubProList: [], // 咨讯退订产品列表
      canShowAppover: false, // 新建咨讯订阅和退订时是否需要选择审批人
    };
  }

  componentDidMount() {
    const { location: { query: { flowId } } } = this.props;
    this.props.getUnSubDetailToChange({ flowId });
  }

  // 清空页面数据
  @autobind
  clearApprovalBoard() {
    if (this.digital) this.digital.reset();
    if (this.addCustomer) this.addCustomer.clearCustList();
    this.setState({
      remark: '',
      choiceApprover: false,
      approverName: '',
      approverId: '',
      customer: {},
      attachment: '',
      unSubProList: [], // 咨讯退订产品列表
    });
  }

  // 填写备注
  @autobind
  handleChangeRemark(e) {
    this.setState({
      remark: e.target.value,
    });
  }

  @autobind
  addCustomerRef(input) {
    this.addCustomer = input;
  }

  // 清空用户选择的客户列表
  @autobind
  clearCustList() {
    this.addCustomer.clearCustList();
  }

  // 选择其他佣金比率
  @autobind
  changeOtherCommission(name, value) {
    this.setState({
      [name]: value,
    });
  }

  // 打开选择审批人弹窗
  @autobind
  openApproverBoard() {
    this.setState({
      choiceApprover: true,
    });
  }

  // 关闭审批人员选择弹出窗
  @autobind
  closeChoiceApproverModal() {
    this.setState({
      choiceApprover: false,
    });
  }

  // 审批人弹出框确认按钮
  @autobind
  handleApproverModalOK(approver) {
    this.setState({
      approverName: approver.empName,
      approverId: approver.empNo,
    });
  }

  // 咨讯退订选择子产品的时候的处理程序
  @autobind
  handleSubscribelTransferSubProductCheck(item, array) {
    this.setState({
      unSubProList: array,
    });
  }

  @autobind
  changeSubscriProList(product) {
    const { prodRowId, prodId, prodName } = product;
    return {
      key: prodRowId,
      // 产品代码
      prodCode: prodId,
      // 产品名称
      prodName,
      // 传入的产品原始数据
      ...product,
    };
  }

  // 重组咨讯退订可选产品List
  @autobind
  createSubscribelProList(data) {
    const newSubscriProList = data.map((product) => {
      const newSubscribel = this.changeSubscriProList(product);
      const { children } = product;
      if (!_.isEmpty(children)) {
        newSubscribel.children = children.map(item => ({
          xDefaultOpenFlag: 'Y',
          canNotBeChoice: 'Y',
          ...item,
        }));
      }
      return newSubscribel;
    });
    return newSubscriProList;
  }

  // 重组咨讯退订已选产品List
  @autobind
  choiceSubProList(data) {
    const newChoiceProList = data.forEach((product) => {
      const { subItem } = product;
      if (!_.isEmpty(subItem)) {
        newChoiceProList.children = subItem.map(item => ({
          xDefaultOpenFlag: 'Y',
          canNotBeChoice: 'Y',
          ...item,
        }));
      }
    });
    return newChoiceProList;
  }

  // 附件上传成功后的回调
  @autobind
  uploadCallBack(attachment) {
    this.setState({
      attachment,
    });
  }

  // 将原本订单所选中的产品从可选中去除
  filterProList(choiceList, proList) {
    const productCodeList = choiceList.map(item => item.prodCode);
    return _.filter(proList, product => !_.includes(productCodeList, product.prodCode));
  }

  // 选中的咨讯退订父产品数据结构改为提交所需
  @autobind
  changeSubmitscriProList(product, matchInfos) {
    const {
      prodCode,
      prodName,
    } = product;
    const matchInfo = _.filter(matchInfos, item => item.productCode === prodCode)[0] || {};
    return {
      prodCode,
      aliasName: prodName,
      ...matchInfo,
    };
  }
  // 咨讯退订调整穿梭变化的时候处理程序
  @autobind
  handleUnSubscribelTransferChange(flag, item, array) {
    this.setState({
      unSubProList: array,
    });
  }

  // 咨讯订阅选择子产品的时候的处理程序
  @autobind
  handleUnSubscribelTransferSubProductCheck(item, array) {
    this.setState({
      unSubProList: array,
    });
  }

  // 选中的咨讯退订、退订子产品数据结构改为提交所需
  @autobind
  changeSubmitSubscriProChildren(product) {
    const {
      prodCode,
      prodName,
    } = product;
    return {
      prodCode,
      aliasName: prodName,
    };
  }

  // 将选中的咨讯退订产品数据结构改为提交所需
  @autobind
  changeSubmitSubProList(list, matchInfos) {
    const newSubmitSubscriProList = list.map((product) => {
      const { children } = product;
      const newSubmitSubscribel = this.changeSubmitscriProList(product, matchInfos);
      if (!_.isEmpty(children)) {
        // 存在子产品
        newSubmitSubscribel.subItem = children.map(this.changeSubmitSubscriProChildren);
      }
      return newSubmitSubscribel;
    });
    return newSubmitSubscriProList;
  }

// 提交前检查各项输入的值是否符合要求
  @autobind
  submitCheck() {
    let result = true;
    const { approverId } = this.state;
    if (_.isEmpty(approverId)) {
      message.error('审批人员不能为空');
      result = false;
    }
    return result;
  }

  // 资讯退订提交修改
  @autobind
  handleSubmit() {
    if (!this.submitCheck()) return;
    const { empNum } = this.props.empInfo;
    const {
      customer,
      remark,
      unSubProList,
      subscribelProductMatchInfo,
      approverId, // 审批人工号
      attachment, // 附件编号
    } = this.state;
    const newSubProList = this.changeSubmitSubProList(unSubProList, subscribelProductMatchInfo);
    const params = {
      type: customer.custType,
      aprovaluser: approverId,
      custNum: customer.custEcom,
      custId: customer.id,
      createdBy: empNum,
      comments: remark,
      attachmentNum: attachment,
      item: newSubProList,
    };
    // 提交
    this.props.submitUnSub(params);
  }

  // 点击页面的按钮事件处理
  @autobind
  handleRejctBtnClick(btn) {
    console.warn('handleRejctBtnClick>btn', btn);
  }


  render() {
    const {
      approvalBtns,
      unSubDetailToChange: {
        base,
        unSubscribeCustList,
        unSubProList,
        attachmentList,
        approvList,
      },
    } = this.props;
    if (_.isEmpty(base)) return null;
    if (_.isEmpty(unSubscribeCustList)) return null;
    const { riskLevelLabel } = unSubscribeCustList;
    const {
      // 客户名称
      custName,
      // 经纪客户号
      custNum,
      // 备注
      comments,
      // 产品
      item: choiceProList,
    } = base;
    const customer = `${custName}（${custNum}） - ${riskLevelLabel}`;
    const newApproverList = approvList.map((item, index) => {
      const key = `${new Date().getTime()}-${index}`;
      return {
        ...item,
        key,
      };
    });
    const newUnSubscriProList = this.createSubscribelProList(unSubProList);
    const choiceUnSubProList = this.choiceSubProList(choiceProList);
    const newUnSubscribelProList = this.filterProList(choiceUnSubProList, newUnSubscriProList);
    const {
      choiceApprover,
      approverName,
      approverId,
      remark,
      canShowAppover,
    } = this.state;

    // 资讯退订中的产品选择配置
    const unsubScribetransferProps = {
      firstTitle: '可退订服务',
      secondTitle: '已选服务',
      firstData: newUnSubscribelProList,
      secondData: choiceUnSubProList,
      firstColumns: subScribeProColumns,
      secondColumns: subScribeProColumns,
      transferChange: this.handleUnSubscribelTransferChange,
      checkChange: this.handleUnSubscribelTransferSubProductCheck,
      rowKey: 'key',
      showSearch: false,
      placeholder: '产品代码/产品名称',
      pagination,
      defaultCheckKey: 'xDefaultOpenFlag',
      disableCheckKey: 'canNotBeChoice',
      supportSearchKey: [['prodCode'], ['prodName']],
    };

    return (
      <div className={styles.rejectContainer}>
        <div className={styles.newApprovalBox}>
          <div className={styles.approvalBlock}>
            <InfoTitle head="基本信息" />
            <CommissionLine label="子类型" labelWidth="90px" required>
              <Input
                value="咨讯退订"
                disabled
                className={styles.inputValue}
              />
            </CommissionLine>
            <CommissionLine label="客户" labelWidth="90px" needInputBox={false}>
              <Input
                value={customer}
                disabled
                className={styles.inputValue}
              />
            </CommissionLine>
            <CommissionLine label="备注" labelWidth="90px">
              <TextArea
                placeholder={comments}
                value={remark}
                onChange={this.handleChangeRemark}
                style={{
                  fontSize: '14px',
                }}
              />
            </CommissionLine>
          </div>
          <div className={styles.approvalBlock}>
            <InfoTitle head="资讯产品选择" />
            <Transfer {...unsubScribetransferProps} />
          </div>
          <div className={styles.approvalBlock}>
            <InfoTitle head="附件信息" />
            <CommonUpload
              edit
              attachmentList={attachmentList}
            />
          </div>
          {
            !canShowAppover ? null
            : (
              <div className={styles.approvalBlock}>
                <InfoTitle head="审批人" />
                <CommissionLine label="选择审批人" labelWidth="110px">
                  <div className={styles.checkApprover} onClick={this.openApproverBoard}>
                    {approverName === '' ? '' : `${approverName}(${approverId})`}
                    <div className={styles.searchIcon}>
                      <Icon type="search" />
                    </div>
                  </div>
                </CommissionLine>
              </div>
            )
          }
        </div>
        <RejectButtons
          btnList={approvalBtns}
          onClick={this.handleRejctBtnClick}
        />
        <ChoiceApproverBoard
          visible={choiceApprover}
          approverList={newApproverList}
          onClose={this.closeChoiceApproverModal}
          onOk={this.handleApproverModalOK}
        />
      </div>
    );
  }
}

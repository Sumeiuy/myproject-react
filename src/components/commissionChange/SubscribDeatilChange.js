/**
 * @file components/commissionChange/SubscribDeatilChange.js
 * @description 资讯订阅、资讯退订驳回再修改页面
 * @author baojiajia
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input, Icon } from 'antd';
import _ from 'lodash';

import confirm from '../../components/common/Confirm/confirm';
import CommonUpload from '../../components/common/biz/CommonUpload';
import Transfer from '../../components/common/biz/TableTransfer';
import ChoiceApproverBoard from '../../components/commissionAdjustment/ChoiceApproverBoard';
import InfoTitle from '../../components/common/InfoTitle';
import CommissionLine from '../../components/commissionAdjustment/CommissionLine';
import Button from '../../components/common/Button';
import ThreeMatchTip from '../../components/commissionAdjustment/ThreeMatchTip';
import {
  pagination,
  subScribeProColumns,
} from '../../components/commissionAdjustment/commissionTransferHelper/transferPropsHelper';

import styles from './change.less';

const { TextArea } = Input;

export default class SubscribeDetailToChange extends PureComponent {
  static propTypes = {
    empInfo: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    // 订阅详情
    getSubscribeDetailToChange: PropTypes.func.isRequired,
    subscribeDetailToChange: PropTypes.object.isRequired,
    // 产品与客户的三匹配信息
    threeMatchInfo: PropTypes.object.isRequired,
    queryThreeMatchInfo: PropTypes.func.isRequired,
    // 查询审批人
    queryApprovalUser: PropTypes.func.isRequired,
    // 新建咨询订阅提交接口
    submitSub: PropTypes.func.isRequired,
    // 修改咨讯订阅提交后返回值
    consultSubId: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      remark: '',
      choiceApprover: false,
      approverName: '',
      approverId: '',
      custLists: [],
      attachment: '',
      subProList: [], // 咨询订阅产品列表
      subscribelProductMatchInfo: [], // 咨询订阅的产品的三匹配信息
    };
  }

  componentDidMount() {
    const { location: { query: { flowId } } } = this.props;
    this.props.getSubscribeDetailToChange({ flowId });
  }

  componentWillReceiveProps(nextProps) {
    const { threeMatchInfo: prev3 } = this.props;
    const { threeMatchInfo: next3 } = nextProps;
    if (!_.isEqual(prev3, next3)) {
      // 资讯订阅的
      this.merge3MatchSubInfo(next3);
    }
  }

  @autobind
  merge3MatchSubInfo(info) {
    const { riskRankMhrt, investProdMhrt, investTypeMhrt, productCode } = info;
    const matchInfo = {
      productCode,
      riskMatch: riskRankMhrt,
      prodMatch: investProdMhrt,
      termMatch: investTypeMhrt,
    };
    const { subscribelProductMatchInfo } = this.state;
    const exsit = _.findIndex(subscribelProductMatchInfo, o => o.productCode === productCode) > -1;
    if (!exsit) {
      this.setState({
        subscribelProductMatchInfo: [matchInfo, ...subscribelProductMatchInfo],
      });
    }
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
      custLists: [],
      customer: {},
      attachment: '',
      subProList: [], // 咨询订阅产品列表
      subscribelProductMatchInfo: [], // 咨询订阅的产品的三匹配信息
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

  // 切换选择某个产品
  @autobind
  handleSelectProduct(targetProduct) {
    const { custLists } = this.state;
    this.setState({
      targetProduct,
    });
    if (!_.isEmpty(custLists)) {
      confirm({
        shortCut: 'changeproduct',
        onOk: this.clearCustList,
      });
    }
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

  // 咨讯订阅选择子产品的时候的处理程序
  @autobind
  handleSubscribelTransferSubProductCheck(item, array) {
    this.setState({
      subProList: array,
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
      product,
    };
  }

  // 重组咨讯订阅可选产品List
  @autobind
  createSubscribelProList(data) {
    const newSubscriProList = data.map((product) => {
      const newSubscribel = this.changeSubscriProList(product);
      return newSubscribel;
    });
    return newSubscriProList;
  }

  // 重组咨讯订阅已选产品List
  // TODO
  @autobind
  choiceSubProList(data, preProList) {
    const newChoiceProList = [];
    data.forEach((product) => {
      const { prodCode, subItem } = product;
      const tableProList = product;
      preProList.forEach((item) => {
        const { prodCode: choiceProCode, children } = item;
        if (prodCode === choiceProCode) {
          const {
            riskMatch,
            prodMatch,
            termMatch,
          } = tableProList;
          const proList = {
            riskMatch,
            prodMatch,
            termMatch,
            ...item,
          };
          if (!_.isEmpty(subItem)) {
            const { prodCode: choiceChildCode } = subItem;
            proList.children = children.map((pro) => {
              const { prodCode: childProCode } = pro;
              if (childProCode === choiceChildCode) {
                return {
                  xDefaultOpenFlag: 'Y',
                  ...pro,
                };
              }
              return pro;
            });
          }
          newChoiceProList.push(proList);
        }
      });
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

  // 选中的咨询订阅父产品数据结构改为提交所需
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

  // 选中的咨询订阅、退订子产品数据结构改为提交所需
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

  // 将选中的咨询订阅产品数据结构改为提交所需
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

  // 资讯订阅提交
  @autobind
  advisorySub() {
    if (!this.submitCheck()) return;
    const { empNum } = this.props.empInfo;
    const {
      customer,
      remark,
      subProList,
      subscribelProductMatchInfo,
      approverId, // 审批人工号
      attachment, // 附件编号
    } = this.state;
    const newSubProList = this.changeSubmitSubProList(subProList, subscribelProductMatchInfo);
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
    this.props.submitSub(params);
  }

  render() {
    const {
      threeMatchInfo,
    } = this.props;
    const {
      subscribeDetailToChange: {
        base,
        attachmentList,
        subscribeCustList,
        subProList,
        approvList,
      },
    } = this.props;
    if (_.isEmpty(base)) return null;
    if (_.isEmpty(subscribeCustList)) return null;
    const { riskLevelLabel } = subscribeCustList;
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
    const newSubscriProList = this.createSubscribelProList(subProList);
    const choiceSubscribelProList = this.choiceSubProList(choiceProList, newSubscriProList);
    const newSubscribelProList = this.filterProList(choiceSubscribelProList, newSubscriProList);
    const {
      choiceApprover,
      approverName,
      approverId,
      remark,
    } = this.state;

    // 资讯订阅中的产品选择配置
    const subScribetransferProps = {
      firstTitle: '可选服务',
      secondTitle: '已选服务',
      firstData: newSubscribelProList,
      secondData: choiceSubscribelProList,
      firstColumns: subScribeProColumns,
      secondColumns: subScribeProColumns,
      transferChange: this.handleTransferChange, // 三匹配未做
      checkChange: this.handleCheckChange,
      rowKey: 'key',
      showSearch: true,
      placeholder: '产品代码/产品名称',
      pagination,
      defaultCheckKey: 'xDefaultOpenFlag',
      supportSearchKey: [['prodCode'], ['prodName']],
    };

    return (
      <div className={styles.rejectAmend}>
        <div className={styles.newApprovalBox}>
          <div className={styles.approvalBlock}>
            <InfoTitle head="基本信息" />
            <CommissionLine label="子类型" labelWidth="90px" required>
              <Input
                value="咨询订阅"
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
            <Transfer {...subScribetransferProps} />
          </div>
          <ThreeMatchTip info={threeMatchInfo} />
          <div className={styles.approvalBlock}>
            <InfoTitle head="附件信息" />
            <CommonUpload
              edit
              attachmentList={attachmentList}
            />
          </div>
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
        </div>
        <ChoiceApproverBoard
          visible={choiceApprover}
          approverList={newApproverList}
          onClose={this.closeChoiceApproverModal}
          onOk={this.handleApproverModalOK}
        />
        <Button>提交</Button>
        <Button>终止</Button>
      </div>
    );
  }
}

/**
 * @Author: sunweibin
 * @Date: 2017-11-01 18:37:35
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-03 19:52:17
 * @description 单佣金调整驳回后修改页面
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input, Icon } from 'antd';
import _ from 'lodash';

import RejectButtons from './RejectButtons';
import InfoTitle from '../common/InfoTitle';
import CommonUpload from '../common/biz/CommonUpload';
import AutoComplete from '../common/AutoComplete';
import CommissionLine from '../commissionAdjustment/CommissionLine';
import Transfer from '../common/biz/TableTransfer';
import ThreeMatchTip from '../commissionAdjustment/ThreeMatchTip';
import ChoiceApproverBoard from '../commissionAdjustment/ChoiceApproverBoard';
import OtherCommissionSelectList from '../commissionAdjustment/OtherCommissionSelectList';
import {
  pagination,
  singleColumns,
} from '../commissionAdjustment/commissionTransferHelper/transferPropsHelper';

import styles from './change.less';

const { TextArea } = Input;

export default class SingleDetailChange extends PureComponent {
  static propTypes = {
    flowCode: PropTypes.string.isRequired,
    detailLoading: PropTypes.bool.isRequired,
    detail: PropTypes.object.isRequired,
    singleGJ: PropTypes.array.isRequired,
    optionalList: PropTypes.array.isRequired,
    threeMatchInfo: PropTypes.object.isRequired,
    otherRate: PropTypes.array.isRequired,
    onQueryDetail: PropTypes.func.isRequired,
    onQueryGJ: PropTypes.func.isRequired,
    onQueryProductList: PropTypes.func.isRequired,
    onQuery3Match: PropTypes.func.isRequired,
    onQueryOtherRate: PropTypes.func.isRequired,
    onQueryBtns: PropTypes.func.isRequired,
    approvalBtns: PropTypes.array.isRequired,
    submitResult: PropTypes.string.isRequired,
    onSubmit: PropTypes.array.isRequired,
    onUpdateFlow: PropTypes.array.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    // TODO state里面的初始值，使用detail里面的字段值
    this.state = {
      remark: '',
      newCommission: '',
      choiceApprover: false,
      approverName: '',
      approverId: '',
      attachment: '',
      otherComReset: new Date().getTime(), // 用来判断是否重置
    };
  }

  componentDidMount() {
    const { flowCode } = this.props;
    this.props.onQueryDetail({
      flowCode,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { detailLoading: prevDL } = this.props;
    const { detailLoading: nextDL } = nextProps;
    if (prevDL && !nextDL) {
      const { detail: { base } } = nextProps;
      // 表示初始化将detail的数据获取完毕
      const {
        newCommission,
        comments,
        attachmentNum,
      } = base;
      this.setState({
        newCommission,
        remark: comments,
        attachment: attachmentNum,
      });
    }
  }

  // 填写备注
  @autobind
  handleChangeRemark(e) {
    this.setState({
      remark: e.target.value,
    });
  }

  // 客户修改的目标估计佣金率来查询码值列表
  @autobind
  changeTargetGJCommission(v) {
    const { customer } = this.props.detail;
    this.props.onQueryGJ({
      custId: customer.custEcom,
      commision: v,
    });
  }

  // 切换目标产品股基佣金率
  @autobind
  selectTargetGJCommission(v) {
    this.setState({
      newCommission: v.codeValue,
    });
    const { customer: { id } } = this.props.detail; // 取出客户的row_id
    this.props.onQueryProductList({
      custRowId: id,
      commRate: v.codeValue,
    });
  }

  // 附件上传成功后的回调
  @autobind
  uploadCallBack(attachment) {
    this.setState({
      attachment,
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

  // 选择审批人弹出层按确认键
  @autobind
  handleApproverModalOK(approver) {
    this.setState({
      approverName: approver.empName,
      approverId: approver.empNo,
    });
  }

  @autobind
  mergeChildrenProduct(original, merged) {
    const productCodeList = merged.map(o => o.prodCode);
    return original.map((child) => {
      // 判断child在不在productCodeList中
      // TODO 此处需要进行一个判断就是有些子产品是默认选中的，用户可以取消勾选
      const { prodCode, xDefaultOpenFlag } = child;
      if (_.includes(productCodeList, prodCode)) {
        return {
          ...child,
          xDefaultOpenFlag: 'Y',
        };
      }
      if (xDefaultOpenFlag === 'Y') {
        // 表示该子产品默认勾选,此时代表该子产品已经被用户取消勾选了
        return {
          ...child,
          xDefaultOpenFlag: 'N',
        };
      }
      return child;
    });
  }

  // 将原始数据与用户选择的数据进行合并
  @autobind
  mergeOrigianl2User(original, user) {
    // original和user为含有相同父产品的产品数组
    // 合并的目的在于将original中的相关子产品的xDefaultOpenFlag设为true
    return original.map((product) => {
      const { children, ...resetInfo } = product;
      const newProduct = resetInfo;
      if (!_.isEmpty(children)) {
        // 存在子产品列表
        // 找到user中的相关产品
        const userRelativeProd = _.find(user, p => p.prodCode === product.prodCode);
        // 判断有无子产品
        const userChildren = (userRelativeProd && userRelativeProd.subItem) || [];
        newProduct.children = this.mergeChildrenProduct(children, userChildren);
      }
      return newProduct;
    });
  }

  // 根据可选产品列表和用户选择的列表进行比对
  // 生成Transfer左右两侧需要的数组
  @autobind
  makeTransferNeedData(list, selectedList) {
    // 用户选择的产品列表信息,此处需要先删除里面action为删除的产品,该种产品不显示到左侧列表中去
    const userProList = _.filter(selectedList, product => product.action !== '删除');
    const userProdCodeList = userProList.map(p => p.prodCode);
    // 将原始数据中的数据根据用户选择的数据的父产品进行比对，选出用户添加的原始数据，以及没有选择的数据
    // 用户选择的原始数据
    const userSelectOriginalList = _.filter(list,
      product => _.includes(userProdCodeList, product.prodCode));
    // 左侧列表
    const userOptionalList = _.filter(list,
      product => !_.includes(userProdCodeList, product.prodCode));
    // 将用户选择的原始数据和用户选择的数据进行比对，生成右侧列表项
    const rightList = this.mergeOrigianl2User(userSelectOriginalList, userProList);
    return {
      first: userOptionalList,
      second: rightList,
    };
  }

  // 点击页面的按钮事件处理
  @autobind
  handleRejctBtnClick(btn) {
    console.warn('handleRejctBtnClick>btn', btn);
  }

  render() {
    const { detail } = this.props;
    if (_.isEmpty(detail.base)) {
      return null;
    }
    const { customer, approvalList, attachmentList } = detail;
    const { item } = detail.base;
    const {
      newCommission,
      remark,
      choiceApprover,
      approverName,
      approverId,
      attachment,
      otherComReset,
    } = this.state;
    const {
      singleGJ,
      optionalList,
      threeMatchInfo,
      otherRate,
      approvalBtns,
    } = this.props;

    // 1. 针对用户选择的单佣金调整的申请中添加的item产品列表
    const transferData = this.makeTransferNeedData(optionalList, item);
    // 单佣金调整中的产品选择配置
    const singleTransferProps = {
      firstTitle: '可选佣金产品',
      secondTitle: '已选产品',
      firstData: transferData.first,
      secondData: transferData.second,
      firstColumns: singleColumns,
      secondColumns: singleColumns,
      transferChange: this.handleSingleTransferChange,
      checkChange: this.handleSingleTransferSubProductCheck,
      rowKey: 'id',
      defaultCheckKey: 'xDefaultOpenFlag',
      placeholder: '产品代码/产品名称',
      pagination,
      aboutRate: [newCommission, 'prodRate'],
      supportSearchKey: [['prodCode'], ['prodName']],
      totalData: optionalList,
    };

    // 附件上传配置项
    const uploadProps = {
      // 可上传，可编辑
      edit: true,
      attachmentList,
      // 上传成功callback
      uploadAttachment: this.uploadCallBack,
      // 附件Id
      attachment,
      needDefaultText: false,
    };

    return (
      <div className={styles.rejectContainer}>
        <div className={styles.newApprovalBox}>
          <div className={styles.approvalBlock}>
            <InfoTitle head="基本信息" />
            <CommissionLine label="子类型" labelWidth="90px" required>
              <Input
                value="佣金调整"
                disabled
                style={{ width: '300px' }}
              />
            </CommissionLine>
            <CommissionLine label="客户" labelWidth="90px" needInputBox={false}>
              <Input
                value={`${customer.custName}(${customer.custEcom})-${customer.riskLevelLabel}`}
                disabled
                style={{ width: '300px' }}
              />
            </CommissionLine>
            <CommissionLine label="备注" labelWidth="90px">
              <TextArea
                placeholder="备注内容"
                value={remark}
                onChange={this.handleChangeRemark}
                style={{
                  fontSize: '14px',
                }}
              />
            </CommissionLine>
          </div>
          <div className={styles.approvalBlock}>
            <InfoTitle head="佣金产品选择" />
            <CommissionLine
              label="目标股基佣金率"
              labelWidth="110px"
              needInputBox={false}
              extra={
                <span
                  style={{
                    fontSize: '14px',
                    color: '#9b9b9b',
                    lineHeight: '26px',
                    paddingLeft: '4px',
                  }}
                >
                  ‰
                </span>
              }
            >
              <AutoComplete
                defaultInput={newCommission}
                dataSource={singleGJ}
                onChangeValue={this.changeTargetGJCommission}
                onSelectValue={this.selectTargetGJCommission}
                width="100px"
              />
            </CommissionLine>
            <Transfer {...singleTransferProps} />
            <ThreeMatchTip info={threeMatchInfo} />
          </div>
          <div className={styles.approvalBlock}>
            <InfoTitle head="其他佣金费率" />
            <OtherCommissionSelectList
              showTip
              reset={otherComReset}
              otherRatios={otherRate}
              onChange={this.changeOtherCommission}
            />
          </div>
          <div className={styles.approvalBlock}>
            <InfoTitle head="附件信息" />
            <CommonUpload {...uploadProps} />
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
        <RejectButtons
          btnList={approvalBtns}
          onClick={this.handleRejctBtnClick}
        />
        <ChoiceApproverBoard
          visible={choiceApprover}
          approverList={approvalList}
          onClose={this.closeChoiceApproverModal}
          onOk={this.handleApproverModalOK}
        />
      </div>
    );
  }
}

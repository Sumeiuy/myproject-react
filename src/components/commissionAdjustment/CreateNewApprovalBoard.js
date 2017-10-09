/**
 * @file components/commissionAdjustment/CreateNewApprovalBoard.js
 * @description 新建佣金调整、批量佣金调整、资讯订阅、资讯退订弹出框
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input, Icon, Modal, message } from 'antd';
import _ from 'lodash';

import CommonModal from '../common/biz/CommonModal';
import ChoiceApproverBoard from './ChoiceApproverBoard';
import AddCustomer from './AddCustomer';
import InfoTitle from '../common/InfoTitle';
import Select from '../common/Select';
import DigitalTrimmer from '../common/DigitalTrimmer';
import ProductsDropBox from './ProductsDropBox';
import OtherCommissionSelectList from './OtherCommissionSelectList';
import CommissionLine from './CommissionLine';
import { seibelConfig } from '../../config';
import { getEmpId } from '../../utils/helper';
import styles from './createNewApprovalBoard.less';

const confirm = Modal.confirm;
const { TextArea } = Input;
const { commission: { subType } } = seibelConfig;
// 给subType去除全部的选项
const newSubTypes = _.filter(subType, item => !!item.value);
// 增加一个"请选择申请类型的option"
newSubTypes.unshift({
  show: true,
  label: '请选择申请类型',
  value: '',
});

// 佣金调整的子类型常量
const commadj = {
  noSelected: '', // 用户未选择子类型的情况
  single: '0201', // 单佣金调整
  batch: '0202', // 批量佣金调整
};

// 其他佣金率的参数名称数组
const otherComs = [
  'zqCommission',
  'stkCommission',
  'creditCommission',
  'ddCommission',
  'hCommission',
  'dzCommission',
  'coCommission',
  'stbCommission',
  'oCommission',
  'doCommission',
  'hkCommission',
  'bgCommission',
  'qCommission',
  'dqCommission',
  'opCommission',
  'dCommission',
];

export default class CreateNewApprovalBoard extends PureComponent {
  static propTypes = {
    modalKey: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    onSearchApplyCust: PropTypes.func.isRequired,
    targetProductList: PropTypes.array,
    approverList: PropTypes.array,
    customerList: PropTypes.array,
    validateResult: PropTypes.string,
    validataLoading: PropTypes.bool,
    queryProductList: PropTypes.func.isRequired,
    validateCust: PropTypes.func.isRequired,
    onBatchSubmit: PropTypes.func.isRequired,
    otherRatios: PropTypes.array,
  }

  static defaultProps = {
    visible: false,
    validateResult: '',
    validataLoading: false,
    onClose: () => {},
    targetProductList: [],
    customerList: [],
    approverList: [],
    otherRatios: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      approvalType: commadj.batch,
      remark: '',
      targetProduct: '',
      choiceApprover: false,
      newCommission: '1.6',
      approverName: '',
      approverId: '',
      custLists: [],
      otherComReset: new Date().getTime(), // 用来判断是否重置
      custReset: new Date().getTime(),
    };
  }

  @autobind
  getPopupContainer() {
    return this.approvalBody;
  }

  // 判断当前是否某个子类型
  @autobind
  judgeSubtypeNow(assert) {
    return this.state.approvalType === assert;
  }

  // 关闭弹出框后，清空页面数据
  @autobind
  clearApprovalBoard() {
    this.setState({
      approvalType: commadj.batch,
      remark: '',
      targetProduct: '',
      choiceApprover: false,
      newCommission: '1.6',
      approverName: '',
      approverId: '',
      custLists: [],
      otherComReset: new Date().getTime(),
    });
  }

  // 关闭弹出层后的提示框信息
  @autobind
  closeModalConfirm(key) {
    // 关闭我的模态框
    const closeFunc = this.props.onClose;
    const clear = this.clearApprovalBoard;
    confirm({
      title: '真的要关闭此弹框嘛?',
      content: '亲~~弹框关闭以后，您所填写的信息是不会保存的哟！！！',
      onOk() {
        // 清空数据
        clear();
        closeFunc(key);
      },
      onCancel() {

      },
    });
  }

  // 关闭弹窗
  @autobind
  closeModal(key) {
    this.closeModalConfirm(key);
  }

  // 提交
  @autobind
  handleSubmitApprovals(key) {
    const {
      newCommission,
      targetProduct,
      remark,
      approverId,
      custLists,
    } = this.state;
    // 判断什么时候能够提交
    if (_.isEmpty(targetProduct)) {
      message.error('请选择目标产品');
      return;
    }
    if (_.isEmpty(custLists)) {
      message.error('请添加客户');
      return;
    }
    if (_.isEmpty(approverId)) {
      message.error('审批人员不能为空');
      return;
    }
    // 挑选出用户选择的其他佣金率
    const otherCommissions = _.pick(this.state, [otherComs]);
    const empId = getEmpId();
    const submitParams = {
      custLists,
      newCommsion: newCommission,
      prodInfo: { prdCode: targetProduct },
      aprovaluser: approverId,
      remark,
      loginUser: empId,
      ...otherCommissions,
    };
    // 提交
    this.props.onBatchSubmit(submitParams);
    this.props.onClose(key);
  }

  @autobind
  newApprovalBoxRef(input) {
    this.approvalBody = input;
  }

  // 选择申请子类型
  @autobind
  choiceApprovalSubType(name, key) {
    this.setState({
      [name]: key,
    });
    // 如果切换批量佣金需要，先查一把1.6下目标产品
    if (name === 'approvalType') {
      this.props.queryProductList({ prodCommision: 1.6 });
    }
  }

  // 填写备注
  @autobind
  handleChangeRemark(e) {
    this.setState({
      remark: e.target.value,
    });
  }

  // 切换目标产品股基佣金率
  @autobind
  changeTargetGJCommission(v) {
    this.setState({
      newCommission: v,
    });
    this.props.queryProductList({ prodCommision: v });
  }

  // 选择新目标产品后，清空选中客户
  @autobind
  clearCustList() {
    this.setState({
      custReset: new Date().getTime(),
    });
  }

  // 切换选择某个产品
  @autobind
  handleSelectProduct(targetProduct) {
    const clearCust = this.clearCustList;
    const { custLists } = this.state;
    this.setState({
      targetProduct,
    });
    if (!(_.isEmpty(custLists))) {
      confirm({
        title: '真的要重新选择目标产品么?',
        content: '选择新的目标产品后，您之前所选择的客户会被清空哟！！！',
        onOk() {
          clearCust();
        },
        onCancel() {
        },
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

  // 根据用户输入查询客户列表
  @autobind
  handleCustomerListSearch(keyword) {
    this.props.onSearchApplyCust({
      keyword,
    });
  }

  // 将用户选择添加的客户列表返回到弹出层，以便提交试用
  @autobind
  saveSelectedCustomerList(list) {
    this.setState({
      custLists: list,
    });
  }

  // 验证用户资格
  @autobind
  handleCustomerValidate(customer) {
    const { approvalType, newCommission, targetProduct } = this.state;
    const { cusId, custType } = customer;
    // 如果是批量佣金则传递businessType = 'BatchProcess'
    // '0202' ：表示批量佣金调整
    this.props.validateCust({
      businessType: approvalType === commadj.batch ? 'BatchProcess' : null,
      custId: cusId,
      custType,
      newCommission,
      prodCode: targetProduct,
      ignoreCatch: true,
    });
  }

  render() {
    const {
      modalKey,
      visible,
      targetProductList,
      approverList,
      validataLoading,
      validateResult,
      customerList,
      otherRatios,
    } = this.props;
    const newApproverList = approverList.map((item, index) => {
      const key = `${new Date().getTime()}-${index}`;
      return {
        ...item,
        key,
      };
    });
    const {
      approvalType,
      remark,
      choiceApprover,
      approverName,
      approverId,
      otherComReset,
      custReset,
    } = this.state;
    const needBtn = !this.judgeSubtypeNow('');
    return (
      <div>
        <CommonModal
          title="新建"
          modalKey={modalKey}
          needBtn={needBtn}
          maskClosable={false}
          size="large"
          visible={visible}
          closeModal={this.closeModal}
          okText="提交"
          showCancelBtn={false}
          onOk={this.handleSubmitApprovals}
        >
          <div className={styles.newApprovalBox} ref={this.newApprovalBoxRef}>
            <div className={styles.approvalBlock}>
              <InfoTitle head="基本信息" />
              <CommissionLine label="子类型" labelWidth="90px" required needInputBox>
                <Select
                  name="approvalType"
                  data={newSubTypes}
                  value={approvalType}
                  onChange={this.choiceApprovalSubType}
                  getPopupContainer={this.getPopupContainer}
                />
              </CommissionLine>
              {
                this.judgeSubtypeNow(commadj.noSelected) ? null
                : (
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
                )
              }
            </div>
            {
              !this.judgeSubtypeNow(commadj.batch) ? null
              : (
                <div className={styles.approvalBlock}>
                  <InfoTitle head="佣金产品选择" />
                  <CommissionLine label="目标股基佣金率" labelWidth="135px">
                    <DigitalTrimmer
                      getValue={this.changeTargetGJCommission}
                    />
                  </CommissionLine>
                  <CommissionLine label="目标产品" labelWidth="135px" needInputBox={false}>
                    <ProductsDropBox
                      productList={targetProductList}
                      onSelect={this.handleSelectProduct}
                    />
                  </CommissionLine>
                </div>
              )
            }
            {
              !this.judgeSubtypeNow(commadj.batch) ? null
              : (
                <div className={styles.approvalBlock}>
                  <InfoTitle head="其他佣金费率" />
                  <OtherCommissionSelectList
                    reset={otherComReset}
                    otherRatios={otherRatios}
                    onChange={this.changeOtherCommission}
                  />
                </div>
              )
            }
            {
              !this.judgeSubtypeNow(commadj.batch) ? null
              : (
                <div className={styles.approvalBlock}>
                  <InfoTitle head="客户" />
                  <AddCustomer
                    onSearch={this.handleCustomerListSearch}
                    passList2Home={this.saveSelectedCustomerList}
                    onValidate={this.handleCustomerValidate}
                    validateResult={validateResult}
                    validataLoading={validataLoading}
                    searchList={customerList}
                    custReset={custReset}
                  />
                </div>
              )
            }
            {
              !this.judgeSubtypeNow(commadj.batch) ? null
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
        </CommonModal>
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

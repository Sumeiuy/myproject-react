/**
 * @file components/commissionAdjustment/CreateNewApprovalBoard.js
 * @description 新建佣金调整、批量佣金调整、资讯订阅、资讯退订弹出框
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input, Icon, Modal } from 'antd';
import _ from 'lodash';

import CommonModal from '../common/biz/CommonModal';
import ChoiceApproverBoard from './ChoiceApproverBoard';
import AddCustomer from './AddCustomer';
import InfoTitle from '../common/InfoTitle';
import Select from '../common/Select';
import DigitalTrimmer from '../common/DigitalTrimmer';
import ProductsDropBox from './ProductsDropBox';
import OtherCommissionSelect from './OtherCommissionSelect';
import { seibelConfig } from '../../config';
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

export default class CreateNewApprovalBoard extends PureComponent {
  static propTypes = {
    modalKey: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    targetProductList: PropTypes.array,
    approverList: PropTypes.array,
  }

  static defaultProps = {
    visible: false,
    onClose: () => {},
    targetProductList: [],
    approverList: [
      {
        empId: 'HTSC001234',
        empName: 'sunweibin',
        org: '南京长江路证券营业部',
      },
      {
        empId: 'HTSC001234',
        empName: 'sunweibin',
        org: '南京长江路证券营业部',
      },
      {
        empId: 'HTSC001234',
        empName: 'sunweibin',
        org: '南京长江路证券营业部',
      },
      {
        empId: 'HTSC001234',
        empName: 'sunweibin',
        org: '南京长江路证券营业部',
      },
      {
        empId: 'HTSC001234',
        empName: 'sunweibin',
        org: '南京长江路证券营业部',
      },
      {
        empId: 'HTSC001234',
        empName: 'sunweibin',
        org: '南京长江路证券营业部',
      },
      {
        empId: 'HTSC001234',
        empName: 'sunweibin',
        org: '南京长江路证券营业部',
      },
      {
        empId: 'HTSC001234',
        empName: 'sunweibin',
        org: '南京长江路证券营业部',
      },
      {
        empId: 'HTSC001234',
        empName: 'sunweibin',
        org: '南京长江路证券营业部',
      },
      {
        empId: 'HTSC001234',
        empName: 'sunweibin',
        org: '南京长江路证券营业部',
      },
    ],
  }

  constructor(props) {
    super(props);
    this.state = {
      approvalType: '',
      remark: '',
      targetProduct: '',
      bgCommission: '',
      choiceApprover: false,
    };
  }

  // 查询审批人员
  @autobind
  onSearchApprover(e) {
    console.warn('onSearchApprover', e);
  }

  // 关闭弹出层后的提示框信息
  @autobind
  closeModalConfirm(key) {
    // 关闭我的模态框
    const closeFunc = this.props.onClose;
    confirm({
      title: '真的要关闭此弹框嘛?',
      content: '亲~~弹框关闭以后，您所填写的信息是不会保存的哟！！！',
      onOk() {
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
    // this.props.onClose(key);
  }

  // 提交
  @autobind
  handleSubmitApprovals(key) {
    console.warn('点击提交按钮');
    this.props.onClose(key);
  }

  // 选择申请子类型
  @autobind
  choiceApprovalSubType(name, key) {
    this.setState({
      [name]: key,
    });
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
    console.warn('changeTargetGJCommission', v);
  }

  // 选择某个产品后
  @autobind
  handleProductSelect(targetProduct) {
    this.setState({
      targetProduct,
    });
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

  @autobind
  closeChoiceApproverModal() {
    this.setState({
      choiceApprover: false,
    });
  }

  @autobind
  handleApproverSelected() {
    console.warn('66666666666');
  }

  // 审批人弹出框确认按钮
  @autobind
  handleApproverModalOK(emp) {
    console.warn('handleApproverModalOK', emp);
  }

  render() {
    const {
      modalKey,
      visible,
      targetProductList,
      approverList,
    } = this.props;
    const {
      approvalType,
      remark,
      choiceApprover,
    } = this.state;
    return (
      <div>
        <CommonModal
          title="新建"
          modalKey={modalKey}
          needBtn
          maskClosable={false}
          size="large"
          visible={visible}
          closeModal={this.closeModal}
          okText="提交"
          showCancelBtn={false}
          onOk={this.handleSubmitApprovals}
        >
          <div className={styles.newApprovalBox}>
            <div className={styles.approvalBlock}>
              <InfoTitle head="基本信息" />
              <div className={styles.lineInputWrap}>
                <div className={styles.label}>
                  <i className={styles.required}>*</i>
                    子类型<span className={styles.colon}>:</span>
                </div>
                <div className={`${styles.componentBox} ${styles.selectBox}`}>
                  <Select
                    name="approvalType"
                    data={newSubTypes}
                    value={approvalType}
                    onChange={this.choiceApprovalSubType}
                  />
                </div>
              </div>
              <div className={styles.lineInputWrap}>
                <div className={styles.label}>
                    备注<span className={styles.colon}>:</span>
                </div>
                <div className={`${styles.componentBox} ${styles.textAreaBox}`}>
                  <TextArea
                    placeholder="备注内容"
                    value={remark}
                    onChange={this.handleChangeRemark}
                    style={{
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>
            </div>
            <div className={styles.approvalBlock}>
              <InfoTitle head="佣金产品选择" />
              <div className={styles.lineInputWrap}>
                <div className={styles.label}>
                    目标股基佣金率<span className={styles.colon}>:</span>
                </div>
                <div className={`${styles.componentBox} ${styles.selectBox}`}>
                  <DigitalTrimmer
                    getValue={this.changeTargetGJCommission}
                  />
                </div>
              </div>
              <div className={styles.lineInputWrap}>
                <div className={styles.label}>
                    目标产品<span className={styles.colon}>:</span>
                </div>
                <div className={`${styles.componentBox}`}>
                  <ProductsDropBox
                    productList={targetProductList}
                    onSelect={this.changeTargetGJCommission}
                  />
                </div>
              </div>
            </div>
            <div className={styles.approvalBlock}>
              <InfoTitle head="其他佣金费率" />
              <div className={styles.otherComsBox}>
                <OtherCommissionSelect
                  label="B股"
                  name="bgCommission"
                  onChange={this.changeOtherCommission}
                />
                <OtherCommissionSelect
                  label="债券"
                  name="zqCommission"
                  onChange={this.changeOtherCommission}
                />
                <OtherCommissionSelect
                  label="回购"
                  name="hCommission"
                  onChange={this.changeOtherCommission}
                />
                <OtherCommissionSelect
                  label="场内基金"
                  name="oCommission"
                  onChange={this.changeOtherCommission}
                />
                <OtherCommissionSelect
                  label="权证"
                  name="qCommission"
                  onChange={this.changeOtherCommission}
                />
                <OtherCommissionSelect
                  label="担保股基"
                  name="stkCommission"
                  onChange={this.changeOtherCommission}
                />
                <OtherCommissionSelect
                  label="担保债券"
                  name="dzCommission"
                  onChange={this.changeOtherCommission}
                />
                <OtherCommissionSelect
                  label="担保场内基金"
                  name="doCommission"
                  onChange={this.changeOtherCommission}
                />
              </div>
              <div className={styles.otherComsBox}>
                <OtherCommissionSelect
                  label="担保权证"
                  name="dqCommission"
                  onChange={this.changeOtherCommission}
                />
                <OtherCommissionSelect
                  label="信用股基"
                  name="creditCommission"
                  onChange={this.changeOtherCommission}
                />
                <OtherCommissionSelect
                  label="信用场内基金"
                  name="coCommission"
                  onChange={this.changeOtherCommission}
                />
                <OtherCommissionSelect
                  label="港股通（净佣金）"
                  name="hkCommission"
                  onChange={this.changeOtherCommission}
                />
                <OtherCommissionSelect
                  label="个股期权"
                  name="opCommission"
                  onChange={this.changeOtherCommission}
                />
                <OtherCommissionSelect
                  label="担保品大宗交易"
                  name="ddCommission"
                  onChange={this.changeOtherCommission}
                />
                <OtherCommissionSelect
                  label="股转"
                  name="stbCommission"
                  onChange={this.changeOtherCommission}
                />
                <OtherCommissionSelect
                  label="大宗交易"
                  name="dCommission"
                  onChange={this.changeOtherCommission}
                />
              </div>
              <div className={styles.blockTip}>
                <Icon type="exclamation-circle" />本功能不提供特殊资产校验的费率设置，如需调整请通过单客户佣金调整功能
              </div>
            </div>
            <div className={styles.approvalBlock}>
              <InfoTitle head="客户" />
              <AddCustomer />
            </div>
            <div className={styles.approvalBlock}>
              <InfoTitle head="审批人" />
              <div className={styles.lineInputWrap}>
                <div className={styles.label}>
                  选择审批人<span className={styles.colon}>:</span>
                </div>
                <div className={`${styles.componentBox} ${styles.selectBox}`}>
                  <div className={styles.checkApprover} onClick={this.openApproverBoard}>
                    <div className={styles.searchIcon}><Icon type="search" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CommonModal>
        <ChoiceApproverBoard
          visible={choiceApprover}
          approverList={approverList}
          onClose={this.closeChoiceApproverModal}
          onOk={this.handleApproverModalOK}
          onSearchApprover={this.onSearchApprover}
        />
      </div>
    );
  }
}

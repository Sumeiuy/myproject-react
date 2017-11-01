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
    // 订阅详情
    getSubscribeDetailToChange: PropTypes.func.isRequired,
    subscribeDetailToChange: PropTypes.object.isRequired,
    // 新建咨讯订阅可选产品列表
    getSubscribelProList: PropTypes.func.isRequired,
    subscribelProList: PropTypes.array.isRequired,
    // 产品与客户的三匹配信息
    threeMatchInfo: PropTypes.object.isRequired,
    queryThreeMatchInfo: PropTypes.func.isRequired,
    // 查询审批人
    queryApprovalUser: PropTypes.func.isRequired,
    // 新建咨询订阅提交接口
    submitSub: PropTypes.func.isRequired,
    // 修改咨讯订阅提交后返回值
    consultSubId: PropTypes.string.isRequired,
    // 审批人员列表
    approvalUserList: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      remark: '',
      choiceApprover: false,
      approverName: '',
      approverId: '',
      custLists: [],
      customer: {}, // 资讯订阅选择的客户
      attachment: '',
      subProList: [], // 咨询订阅产品列表
      subscribelProductMatchInfo: [], // 咨询订阅的产品的三匹配信息
    };
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
      unSubProList: [], // 咨询退订产品列表
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

  // 咨询订阅基本信息选择客户
  @autobind
  handleSelectAssembly(customer) {
    const { id, custType } = customer;
    this.setState({
      customer,
    });
    this.querySubscribelProList({
      custId: id,
      custType,
    });
  }

  // 查询咨讯订阅调整产品
  @autobind
  querySubscribelProList(param) {
    this.props.getSubscribelProList(param);
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

  // 重组咨讯订阅可选产品子产品
  @autobind
  changeSubscriProChildren(product) {
    const { prodRowid, prodCode, prodName, xDefaultOpenFlag } = product;
    return {
      key: prodRowid,
      // 产品代码
      prodCode,
      // 产品名称
      prodName,
      // 是否默认选择
      xDefaultOpenFlag,
      // 传入的产品原始数据
      product,
    };
  }

  // 重组咨讯订阅可选产品List
  @autobind
  createSubscribelProList(data) {
    const newSubscriProList = data.map((product) => {
      const { subProds } = product;
      const newSubscribel = this.changeSubscriProList(product);
      if (!_.isEmpty(subProds)) {
        // 存在子产品
        newSubscribel.children = subProds.map(this.changeSubscriProChildren);
      }
      return newSubscribel;
    });
    return newSubscriProList;
  }

  // 附件上传成功后的回调
  @autobind
  uploadCallBack(attachment) {
    this.setState({
      attachment,
    });
  }

  render() {
    const {
      approvalUserList,
      threeMatchInfo,
      subscribelProList,
    } = this.props;
    const newApproverList = approvalUserList.map((item, index) => {
      const key = `${new Date().getTime()}-${index}`;
      return {
        ...item,
        key,
      };
    });
    const newSubscribelProList = this.createSubscribelProList(subscribelProList);
    const {
      remark,
      choiceApprover,
      approverName,
      approverId,
    } = this.state;

    const uploadProps = {
      attachmentList: [{
        creator: '002332',
        attachId: '{6795CB98-B0CD-4CEC-8677-3B0B9298B209}',
        name: '新建文本文档 (3).txt',
        size: '0',
        createTime: '2017/09/12 13:37:45',
        downloadURL: 'http://ceflow:8086/unstructured/downloadDocument?sessionId=675fd3be-baca-4099-8b52-bf9dde9f2b59&documentId={6795CB98-B0CD-4CEC-8677-3B0B9298B209}',
        realDownloadURL: '/attach/download?filename=%E6%96%B0%E5%BB%BA%E6%96%87%E6%9C%AC%E6%96%87%E6%A1%A3+%283%29.txt&attachId={6795CB98-B0CD-4CEC-8677-3B0B9298B209',
      },
      {
        creator: '002332',
        attachId: '{2EF837DE-508C-4FCA-93B8-99CEA68DCB0D}',
        name: '测试.docx',
        size: '11',
        createTime: '2017/09/12 11:53:36',
        downloadURL: 'http://ceflow:8086/unstructured/downloadDocument?sessionId=675fd3be-baca-4099-8b52-bf9dde9f2b59&documentId={2EF837DE-508C-4FCA-93B8-99CEA68DCB0D}',
        realDownloadURL: '/attach/download?filename=%E6%B5%8B%E8%AF%95.docx&attachId={2EF837DE-508C-4FCA-93B8-99CEA68DCB0D',
      },
      {
        creator: '002332',
        attachId: '{24C098F0-9DE3-4DC6-9E7D-FECE683E4B6F}',
        name: '生产sql和修改后sql.txt',
        size: '2',
        createTime: '2017/09/12 11:55:32',
        downloadURL: 'http://ceflow:8086/unstructured/downloadDocument?sessionId=675fd3be-baca-4099-8b52-bf9dde9f2b59&documentId={24C098F0-9DE3-4DC6-9E7D-FECE683E4B6F}',
        realDownloadURL: '/attach/download?filename=%E7%94%9F%E4%BA%A7sql%E5%92%8C%E4%BF%AE%E6%94%B9%E5%90%8Esql.txt&attachId={24C098F0-9DE3-4DC6-9E7D-FECE683E4B6F',
      }],
    };

    // 资讯订阅中的产品选择配置
    const subScribetransferProps = {
      firstTitle: '可选服务',
      secondTitle: '已选服务',
      firstData: newSubscribelProList,
      secondData: [],
      firstColumns: subScribeProColumns,
      secondColumns: subScribeProColumns,
      transferChange: this.handleTransferChange, // 三匹配未做
      checkChange: this.handleCheckChange,
      onSearch: this.handleSearch,
      rowKey: 'key',
      showSearch: true,
      placeholder: '产品代码/产品名称',
      pagination,
      defaultCheckKey: 'xDefaultOpenFlag',
      supportSearchKey: [['prodId'], ['prodName']],
      totalData: newSubscribelProList,
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
              />
            </CommissionLine>
            <CommissionLine label="客户" labelWidth="90px" needInputBox={false}>
              <Input
                value="测试数据-张三"
                disabled
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
            <InfoTitle head="资讯产品选择" />
            <Transfer {...subScribetransferProps} />
          </div>
          <ThreeMatchTip info={threeMatchInfo} />
          <div className={styles.approvalBlock}>
            <InfoTitle head="附件信息" />
            <CommonUpload edit {...uploadProps} />
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

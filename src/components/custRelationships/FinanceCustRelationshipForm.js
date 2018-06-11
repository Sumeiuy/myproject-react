/**
 * @Author: sunweibin
 * @Date: 2018-06-11 14:09:17
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-11 20:22:01
 * @description 融资类业务客户关联关系数据填写表单
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Button, AutoComplete } from 'antd';
// import _ from 'lodash';

import InfoTitle from '../common/InfoTitle';
import SimilarAutoComplete from '../common/similarAutoComplete';
import Select from '../common/Select';
import CommonUpload from '../common/biz/CommonUpload';
import FormItem from './FormItem';
import CustInfo from './CustInfo';
import AssociateRelationTable from './AssociateRelationTable';
import AddRelationshipModal from './AddRelationshipModal';

import { StockRepurchaseOptions, custRelationships } from './config';

import styles from './financeCustRelationshipForm.less';

const Option = AutoComplete.Option;
const APPLY_TYPE_CODE = custRelationships.pageType;

export default class FinanceCustRelationshipForm extends Component {
  static propTypes = {
    // 判断此组件用于新建页面还是驳回后修改页面，'CREATE'或者'UPDATE'
    action: PropTypes.oneOf(['CREATE', 'UPDATE']),
    // 获取客户详情
    getCustDetail: PropTypes.func.isRequired,
    custDetail: PropTypes.object.isRequired,
    // 获取可申请客户列表
    queryCustList: PropTypes.func.isRequired,
    custList: PropTypes.array.isRequired,
  }

  static defaultProps = {
    action: 'CREATE',
  }

  constructor(props) {
    super(props);
    this.state = {
      // 是否办理股票质押回购业务选项，默认 是 'Y'
      stockRepurchase: 'Y',
      // 添加关联关系Modal
      addAssociateModal: false,
      // 客户的关联关系
      custRelationshipList: [],
      // 上传后的附件ID
      attatchment: '',
      // 判断是修改关联关系，还是添加关联关系
      relationModalAction: 'CREATE',
    };
  }

  @autobind
  updateAssociateList() {
    const { custDetail: { custRelationshipList = [] } } = this.props;
    this.setState({ custRelationshipList });
  }

  @autobind
  handleSearchCustList(keyword) {
    this.props.queryCustList({ keyword, type: APPLY_TYPE_CODE });
  }

  @autobind
  handleSelectCust(cust) {
    // TODO 此处需要与后端确认接口请求参数
    console.warn('获取选中的客户的基本信息：', cust);
    this.props.getCustDetail({}).then(this.updateAssociateList);
  }

  @autobind
  handleStockRepurchaseSelectChange(name, stockRepurchase) {
    console.warn('handleStockRepurchaseSelectChange', stockRepurchase);
    this.setState({ stockRepurchase });
  }

  @autobind
  handlAddAssociateRelationBtnClick() {
    this.setState({
      addAssociateModal: true,
      relationModalAction: 'CREATE',
    });
  }

  @autobind
  handleDelRelation(record) {
    console.warn('删除关联关系:', record);
  }

  @autobind
  handleUpdateRelation(record) {
    this.setState({ relationModalAction: 'UPDATE' });
    console.warn('handleUpdateRelation: ', record);
  }

  @autobind
  handleUploadCallBack(attatchment) {
    this.setState({ attatchment });
  }

  @autobind
  handleRelationshipModalClose() {
    this.setState({ addAssociateModal: false });
  }

  @autobind
  handleAddRelationModalConfirm(param) {
    console.warn('点击添加关联关系确认按钮:', param);
    this.setState({
      addAssociateModal: false,
    });
  }

  @autobind
  renderCustAutoCompleteOption(cust) {
    // 渲染客户下拉列表的选项DOM
    const { brokerNumber, custName } = cust;
    const text = `${custName}（${brokerNumber}）`;
    return (
      <Option key={brokerNumber} value={text} >
        <span className={styles.custAutoCompleteOptionValue} title={text}>{text}</span>
      </Option>
    );
  }

  render() {
    const {
      stockRepurchase,
      addAssociateModal,
      custRelationshipList,
      relationModalAction,
    } = this.state;
    const { custList, custDetail } = this.props;

    return (
      <div className={styles.custRelationshipContainer}>
        <InfoTitle head="基本信息" />
        <FormItem label="客户" labelWidth={90}>
          <SimilarAutoComplete
            placeholder="经纪客户号/客户名称"
            optionList={custList}
            optionKey="brokerNumber"
            onSelect={this.handleSelectCust}
            onSearch={this.handleSearchCustList}
            renderOptionNode={this.renderCustAutoCompleteOption}
          />
        </FormItem>
        <CustInfo cust={custDetail} />
        <FormItem label="是否办理股票质押回购业务" labelWidth={204}>
          <Select
            name="stockRepurchase"
            width="80px"
            needShowKey={false}
            value={stockRepurchase}
            data={StockRepurchaseOptions}
            onChange={this.handleStockRepurchaseSelectChange}
          />
        </FormItem>
        <div className={styles.divider} />
        <InfoTitle head="关联信息" />
        <div className={styles.associateBtn}>
          <Button
            ghost
            type="primary"
            icon="plus"
            onClick={this.handlAddAssociateRelationBtnClick}
          >
            添加
          </Button>
        </div>
        <AssociateRelationTable
          data={custRelationshipList}
          onDelRelation={this.handleDelRelation}
          onUpdateRelation={this.handleUpdateRelation}
        />
        <div className={styles.divider} />
        <InfoTitle head="附件信息" />
        <CommonUpload
          edit
          attachment=""
          needDefaultText={false}
          attachmentList={[]}
          uploadAttachment={this.handleUploadCallBack}
        />
        {
          !addAssociateModal ? null :
          (
            <AddRelationshipModal
              action={relationModalAction}
              ralationTree={[]}
              data={{}}
              visible={addAssociateModal}
              onClose={this.handleRelationshipModalClose}
              onOK={this.handleAddRelationModalConfirm}
            />
          )
        }
      </div>
    );
  }
}

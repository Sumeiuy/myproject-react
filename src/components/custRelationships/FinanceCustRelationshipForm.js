/**
 * @Author: sunweibin
 * @Date: 2018-06-11 14:09:17
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-12 16:13:37
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
    // 获取关联关系树
    getRelationshipTree: PropTypes.func.isRequired,
    relationshipTree: PropTypes.array.isRequired,
    // 当用户选的数据发生变化时候的回调
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    action: 'CREATE',
  }

  constructor(props) {
    super(props);
    this.state = {
      // 选择的用户
      cust: {},
      // 是否办理股票质押回购业务选项，默认 是 'Y'
      stockRepurchase: '',
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
    this.setState({ cust });
    this.props.getCustDetail({ custId: cust.brokerNumber }).then(this.updateAssociateList);
    // 切换客户之后，需要查询下客户类型下的关联关系树
    this.props.getRelationshipTree({ custType: cust.custType });
  }

  @autobind
  handleStockRepurchaseSelectChange(name, stockRepurchase) {
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
    const { action, custList, custDetail, relationshipTree } = this.props;
    let cust = custDetail;
    if (action === 'UPDATE') {
      cust = custDetail.custDetail;
    }

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
        <CustInfo cust={cust} />
        <FormItem label="是否办理股票质押回购业务" labelWidth={204}>
          <Select
            name="stockRepurchase"
            width="105px"
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
              ralationTree={relationshipTree}
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

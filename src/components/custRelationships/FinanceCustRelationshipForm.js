/**
 * @Author: sunweibin
 * @Date: 2018-06-11 14:09:17
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-11 17:03:37
 * @description 融资类业务客户关联关系数据填写表单
 */

import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Button } from 'antd';
import _ from 'lodash';

import InfoTitle from '../common/InfoTitle';
import AutoComplete from '../common/similarAutoComplete';
import Select from '../common/Select';
import CommonUpload from '../common/biz/CommonUpload';
import FormItem from './FormItem';
import CustInfo from './CustInfo';
import AssociateRelationTable from './AssociateRelationTable';

import { StockRepurchaseOptions } from './config';

import styles from './financeCustRelationshipForm.less';

export default class FinanceCustRelationshipForm extends Component {
  static propTypes = {
  }

  constructor(props) {
    super(props);
    this.state = {
      // 是否办理股票质押回购业务选项，默认 是 'Y'
      stockRepurchase: 'Y',
      // 添加关联关系Modal
      addAssociateModal: false,
    };
  }

  @autobind
  handleSearchCustList(v) {
    console.warn('搜索客户列表', v);
  }

  @autobind
  handleSelectCust(cust) {
    console.warn('选择某个客户:', cust);
  }

  @autobind
  handleStockRepurchaseSelectChange(stockRepurchase) {
    this.setState({ stockRepurchase });
  }

  @autobind
  handlAddAssociateRelationBtnClick() {
    this.setState({ addAssociateModal: true });
  }

  @autobind
  handleUploadCallBack() {

  }

  @autobind
  renderCustAutoCompleteOption(cust) {
    // 渲染客户下拉列表的选项DOM
    console.warn('渲染cust:', cust);
    return null;
  }

  render() {
    const { stockRepurchase } = this.state;

    return (
      <div className={styles.custRelationshipContainer}>
        <InfoTitle head="基本信息" />
        <FormItem label="客户" labelWidth={90}>
          <AutoComplete
            placeholder="经纪客户号/客户名称"
            optionList={[]}
            optionKey="custEcom"
            onSelect={this.handleSelectCust}
            onSearch={this.handleSearchCustList}
            renderOptionNode={this.renderCustAutoCompleteOption}
          />
        </FormItem>
        <CustInfo cust={{}} />
        <FormItem label="是否办理股票质押回购业务" labelWidth={204}>
          <Select
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
          <AssociateRelationTable
            data={[]}
            onDelRelation={_.noop}
            onUpdateRelation={_.noop}
          />
        </div>
        <div className={styles.divider} />
        <InfoTitle head="附件信息" />
        <CommonUpload
          edit
          attachment=""
          needDefaultText={false}
          attachmentList={[]}
          uploadAttachment={this.handleUploadCallBack}
        />
      </div>
    );
  }
}

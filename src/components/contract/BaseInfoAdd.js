/*
* @Description: 合作合约新建 -基本信息
* @Author: XuWenKang
* @Date:   2017-09-21 15:27:31
* @Last Modified by:   XuWenKang
* @Last Modified time: 2017-09-27 19:00:34
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import { Input } from 'antd';
import moment from 'moment';
import Select from '../common/Select';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import DropDownSelect from '../common/dropdownSelect';
import DatePicker from '../common/datePicker';
import { seibelConfig } from '../../config';

import styles from './baseInfoAdd.less';

const { TextArea } = Input;

// 操作类型列表
const { contract: { operationList } } = seibelConfig;
// 退订的类型
const unsubscribe = operationList[1].value;
// 子类型列表
const childTypeList = _.filter(seibelConfig.contract.subType, v => v.label !== '全部');
// 临时数据待删
// const contractNumList = [{
//   show: true,
//   label: '合约编号1',
//   value: '1',
// }, {
//   show: true,
//   label: '合约编号2',
//   value: '2',
// }];
// 下拉搜索组件样式
const dropDownSelectBoxStyle = {
  width: 220,
  height: 32,
  border: '1px solid #d9d9d9',
};
// 时间选择组件样式
const datePickerBoxStyle = {
  width: 220,
  height: 32,
};
const EMPTY_OBJECT = {};
export default class BaseInfoEdit extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    // 查询客户
    onSearchClient: PropTypes.func.isRequired,
    // 查询合约编号
    onSearchContractNum: PropTypes.func.isRequired,
    // 查询合约详情
    onSearchContractDetail: PropTypes.func.isRequired,
    // 客户列表
    custList: PropTypes.array.isRequired,
    // 合约详情
    contractDetail: PropTypes.object.isRequired,
    // 合约编号列表
    contractNumList: PropTypes.array.isRequired,
    // 更改操作类型时重置表单数据
    onReset: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {
      operation: '1',
      contractNum: {
        id: '',
      },
      childType: '',
      client: EMPTY_OBJECT,
      contractStarDate: '',
      contractPalidity: '',
      remark: '',
    };
  }

  // 更改操作类型时重置表单数据
  @autobind
  resetState() {
    console.log('reset');
    this.setState({
      contractNum: {
        value: '1',
      },
      childType: '',
      client: EMPTY_OBJECT,
      contractStarDate: '',
      contractPalidity: '',
      remark: '',
    }, () => {
      this.props.onChange(this.state);
      this.props.onReset();
    });
  }

  // 通用Select Change方法
  @autobind
  handleSelectChange(key, value) {
    console.log({ [key]: value });
    const { oldOperation } = this.state;
    this.setState({
      ...this.state,
      [key]: value,
    }, () => {
      this.props.onChange(this.state);
      const { operation, childType, client } = this.state;
      // 当前操作类型为“退订”并且子类型变化的时候触发合作合约编号查询
      if (operation === unsubscribe && key === 'childType') {
        this.props.onSearchContractNum({ childType, client });
      }
      // 操作类型发生变化时重置所有填入的数据
      if (key === 'operation' && value !== oldOperation) {
        this.resetState();
      }
    });
  }

  // 选择客户
  @autobind
  handleSelectClient(value) {
    console.log('selectClient', value);
    this.setState({
      ...this.state,
      client: value,
    }, () => {
      this.props.onChange(this.state);
      const { operation, childType, client } = this.state;
      // 当前操作类型为“退订”并且子类型变化的时候触发合作合约编号查询
      if (operation === unsubscribe) {
        this.props.onSearchContractNum({ childType, client });
      }
    });
  }

  // 根据关键字查询客户
  @autobind
  handleSearchClient(v) {
    console.log('searchClient', v);
    this.props.onSearchClient(v);
  }

  // 选择合约编号
  @autobind
  handleSelectContractNum(value) {
    this.setState({
      ...this.state,
      contractNum: value,
    }, () => {
      this.props.onChange(this.state);
      // 退订选择合约编号后搜索该合约详情
      this.props.onSearchContractDetail(value);
    });
  }

  // 根据填入关键词筛选合约编号
  @autobind
  handleSearchContractNum(value) {
    console.log('筛选合约编号', value);
  }

  // 通用 Date组件更新方法
  @autobind
  handleChangeDate(obj) {
    console.log(obj);
    this.setState({
      ...this.state,
      [obj.name]: obj.value,
    }, () => {
      this.props.onChange(this.state);
    });
  }

  // 修改备注
  @autobind
  handleChangeRemark(e) {
    console.log(e.target.value);
    this.setState({
      ...this.state,
      remark: e.target.value,
    }, () => {
      this.props.onChange(this.state);
    });
  }

  render() {
    const { custList, contractDetail, contractNumList } = this.props;
    console.log('contractDetail', contractDetail);
    const { operation } = this.state;
    const contractNumComponent = operation === unsubscribe ?
      (<div className={styles.lineInputWrap}>
        <div className={styles.label}>
          <i className={styles.required}>*</i>
            合约编号<span className={styles.colon}>:</span>
        </div>
        <div className={`${styles.componentBox} ${styles.selectBox}`}>
          <DropDownSelect
            placeholder="合约编号"
            showObjKey="contractName"
            objId="id"
            value={this.state.contractNum.id || ''}
            searchList={contractNumList}
            emitSelectItem={this.handleSelectContractNum}
            emitToSearch={this.handleSearchContractNum}
            boxStyle={dropDownSelectBoxStyle}
          />
        </div>
      </div>)
      :
      null;
    const contractStarDateComponent = operation !== unsubscribe ?
      (<div className={styles.lineInputWrap}>
        <div className={styles.label}>
          <i className={styles.required}>*</i>
                合约开始日期<span className={styles.colon}>:</span>
        </div>
        <div className={`${styles.componentBox}`}>
          <DatePicker
            name="contractStarDate"
            value={
                  this.state.contractStarDate ?
                  moment(this.state.contractStarDate, 'YYYY-MM-DD')
                  :
                  ''
                }
            onChange={this.handleChangeDate}
            boxStyle={datePickerBoxStyle}
          />
        </div>
      </div>)
      :
      <InfoItem label="合约开始日期" value={contractDetail.startDt || ''} />;
    const contractPalidityComponent = operation !== unsubscribe ?
      (<div className={styles.lineInputWrap}>
        <div className={styles.label}>
              合约有效期<span className={styles.colon}>:</span>
        </div>
        <div className={`${styles.componentBox}`}>
          <DatePicker
            name="contractPalidity"
            value={
                this.state.contractPalidity ?
                moment(this.state.contractPalidity, 'YYYY-MM-DD')
                :
                ''
              }
            onChange={this.handleChangeDate}
            boxStyle={datePickerBoxStyle}
          />
        </div>
      </div>)
      :
      <InfoItem label="合约有效期" value={contractDetail.vailDt || ''} />;
    const remarkComponent = operation !== unsubscribe ?
      (<div className={styles.lineInputWrap}>
        <div className={styles.label}>
              备注<span className={styles.colon}>:</span>
        </div>
        <div className={`${styles.componentBox} ${styles.textAreaBox}`}>
          <TextArea
            value={this.state.remark}
            onChange={this.handleChangeRemark}
          />
        </div>
      </div>)
      :
      <InfoItem label="备注" value={contractDetail.description || ''} />;
    return (
      <div className={styles.editWrapper}>
        <InfoTitle head="基本信息" />
        <div className={styles.lineInputWrap}>
          <div className={styles.label}>
            <i className={styles.required}>*</i>
              操作类型<span className={styles.colon}>:</span>
          </div>
          <div className={`${styles.componentBox} ${styles.selectBox}`}>
            <Select
              name="operation"
              data={operationList}
              value={this.state.operation}
              onChange={this.handleSelectChange}
            />
          </div>
        </div>
        <div className={styles.lineInputWrap}>
          <div className={styles.label}>
            <i className={styles.required}>*</i>
              子类型<span className={styles.colon}>:</span>
          </div>
          <div className={`${styles.componentBox} ${styles.selectBox}`}>
            <Select
              name="childType"
              data={childTypeList}
              value={this.state.childType}
              onChange={this.handleSelectChange}
            />
          </div>
        </div>
        <div className={styles.lineInputWrap}>
          <div className={styles.label}>
            <i className={styles.required}>*</i>
              客户<span className={styles.colon}>:</span>
          </div>
          <div className={styles.componentBox}>
            <DropDownSelect
              placeholder="经纪客户号/客户名称"
              showObjKey="custName"
              objId="cusId"
              value={this.state.client.cusId || ''}
              searchList={custList}
              emitSelectItem={this.handleSelectClient}
              emitToSearch={this.handleSearchClient}
              boxStyle={dropDownSelectBoxStyle}
            />
          </div>
        </div>
        {contractNumComponent}
        {contractStarDateComponent}
        {contractPalidityComponent}
        {remarkComponent}
      </div>
    );
  }

}


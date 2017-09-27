/*
* @Description: 合作合约修改 -基本信息
* @Author: XuWenKang
* @Date:   2017-09-20 13:47:07
* @Last Modified by:   XuWenKang
* @Last Modified time: 2017-09-27 09:42:22
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import { Input } from 'antd';
import moment from 'moment';
import Select from '../common/Select';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import DropDownSelect from '../common/dropdownSelect';
import DatePicker from '../common/datePicker';
import { contract as contractConfig } from '../../config';

import styles from './baseInfoEdit.less';

const { TextArea } = Input;

// 子类型列表
const childTypeList = contractConfig.subType;
// const EMPTY_OBJECT = {};
// const EMPTY_ARRAY = [];
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
export default class BaseInfoEdit extends PureComponent {
  static propTypes = {
    childType: PropTypes.string.isRequired,
    client: PropTypes.string.isRequired,
    contractStarDate: PropTypes.string.isRequired,
    contractPalidity: PropTypes.string,
    contractEndDate: PropTypes.string,
    remark: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onSearchClient: PropTypes.func.isRequired,
    custList: PropTypes.array.isRequired,
    operationType: PropTypes.string.isRequired,
  }

  static defaultProps = {
    contractPalidity: '',
    contractEndDate: '',
    remark: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      childType: '',
      client: '',
      contractStarDate: '',
      contractPalidity: '',
      contractEndDate: '',
      remark: '',
    };
  }

  componentWillMount() {
    const {
      childType,
      client,
      contractStarDate,
      contractPalidity,
      contractEndDate,
      remark,
    } = this.props;
    this.setState({
      childType,
      client,
      contractStarDate,
      contractPalidity,
      contractEndDate,
      remark,
    });
  }

  @autobind
  handleSelectChange(key, value) {
    console.log({ [key]: value });
    this.setState({
      ...this.state,
      [key]: value,
    }, () => {
      this.props.onChange(this.state);
    });
  }

  @autobind
  handleSelectClient(value) {
    console.log('selectClient', value);
    this.setState({
      ...this.state,
      client: value,
    }, () => {
      this.props.onChange(this.state);
    });
  }

  @autobind
  handleSearchClient(v) {
    console.log('searchClient', v);
    this.props.onSearchClient(v);
  }

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
    const {
      custList,
      operationType,
    } = this.props;
    return (
      <div className={styles.editWrapper}>
        <InfoTitle head="基本信息" />
        <InfoItem label="操作类型" value={operationType} />;
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
              value={this.state.client}
              searchList={custList}
              emitSelectItem={this.handleSelectClient}
              emitToSearch={this.handleSearchClient}
              boxStyle={dropDownSelectBoxStyle}
            />
          </div>
        </div>
        <div className={styles.lineInputWrap}>
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
        </div>
        <div className={styles.lineInputWrap}>
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
        </div>
        <div className={styles.lineInputWrap}>
          <div className={styles.label}>
              合约终止日期<span className={styles.colon}>:</span>
          </div>
          <div className={`${styles.componentBox}`}>
            <DatePicker
              name="contractEndDate"
              value={
                this.state.contractEndDate ?
                moment(this.state.contractEndDate, 'YYYY-MM-DD')
                :
                ''
              }
              onChange={this.handleChangeDate}
              boxStyle={datePickerBoxStyle}
            />
          </div>
        </div>
        <div className={styles.lineInputWrap}>
          <div className={styles.label}>
              备注<span className={styles.colon}>:</span>
          </div>
          <div className={`${styles.componentBox} ${styles.textAreaBox}`}>
            <TextArea
              value={this.state.remark}
              onChange={this.handleChangeRemark}
            />
          </div>
        </div>
      </div>
    );
  }

}

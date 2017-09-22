/*
* @Description: 合作合约修改 -基本信息
* @Author: XuWenKang
* @Date:   2017-09-20 13:47:07
* @Last Modified by:   XuWenKang
* @Last Modified time: 2017-09-22 14:38:54
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import { Input } from 'antd';
import moment from 'moment';
import Select from '../common/Select';
import InfoTitle from '../common/InfoTitle';
import DropDownSelect from '../common/dropdownSelect';
import DatePicker from '../common/datePicker';

import styles from './baseInfoEdit.less';

const { TextArea } = Input;

// const EMPTY_OBJECT = {};
// const EMPTY_ARRAY = [];
const dropDownSelectBoxStyle = {
  width: 220,
  height: 32,
  border: '1px solid #d9d9d9',
};
const datePickerBoxStyle = {
  width: 220,
  height: 32,
};
export default class BaseInfoEdit extends PureComponent {
  static propTypes = {
    childType: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    contractStarDate: PropTypes.string.isRequired,
    contractPalidity: PropTypes.string,
    contractEndDate: PropTypes.string,
    remark: PropTypes.string,
    onChange: PropTypes.func.isRequired,
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
      childType: { value: childType },
      client: { value: client },
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
  handleChangeChildType(key, value) {
    console.log({ [key]: value });
    this.setState({
      ...this.state,
      childType: value,
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
      childType,
      client,
    } = this.props;
    return (
      <div className={styles.editWrapper}>
        <InfoTitle head="基本信息" />
        <div className={styles.lineInputWrap}>
          <div className={styles.label}>
            <i className={styles.required}>*</i>
              子类型<span className={styles.colon}>:</span>
          </div>
          <div className={`${styles.componentBox} ${styles.selectBox}`}>
            <Select
              name="childType"
              data={childType.list}
              value={this.state.childType}
              onChange={this.handleChangeChildType}
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
              showObjKey="name"
              objId="value"
              value={this.state.client}
              searchList={client.list}
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

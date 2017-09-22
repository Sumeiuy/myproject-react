/*
* @Description: 合作合约修改 -基本信息
* @Author: XuWenKang
* @Date:   2017-09-20 13:47:07
* @Last Modified by:   XuWenKang
* @Last Modified time: 2017-09-21 15:27:43
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import { Input } from 'antd';
import moment from 'moment';
import InputTextComponent from '../common/inputtextcomponent';
import Select from '../common/Select';
import InfoTitle from '../common/InfoTitle';
import DropDownSelect from '../common/dropdownSelect';
import DatePicker from '../common/datePicker';

import styles from './baseinfoedit.less';

const { TextArea } = Input;

export default class BaseInfoEdit extends PureComponent {
  static propTypes = {
    contractName: PropTypes.string.isRequired,
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
      contractName: '',
    };
  }

  componentWillMount() {
    const {
      contractName,
      childType,
      client,
      contractStarDate,
      contractPalidity,
      contractEndDate,
      remark,
    } = this.props;
    this.setState({
      contractName,
      childType,
      client,
      contractStarDate,
      contractPalidity,
      contractEndDate,
      remark,
    });
  }

  @autobind
  changeContractName(v) {
    console.log('eee', v);
    this.setState({
      ...this.state,
      contractName: v,
    }, () => {
      this.props.onChange(this.state);
    });
  }

  @autobind
  changeChildType(key, value) {
    console.log({ [key]: value });
    this.setState({
      ...this.state,
      childType: {
        ...this.state.childType,
        value,
      },
    }, () => {
      this.props.onChange(this.state);
    });
  }

  @autobind
  selectClient(value) {
    console.log('selectClient', value);
    this.setState({
      ...this.state,
      client: {
        ...this.state.client,
        value,
      },
    }, () => {
      this.props.onChange(this.state);
    });
  }

  @autobind
  searchClient(v) {
    console.log('searchClient', v);
  }

  @autobind
  changeDate(obj) {
    console.log(obj);
    this.setState({
      ...this.state,
      [obj.name]: obj.value,
    }, () => {
      this.props.onChange(this.state);
    });
  }

  @autobind
  changeRemark(e) {
    console.log(e.target.value);
    this.setState({
      ...this.state,
      remark: e.target.value,
    }, () => {
      this.props.onChange(this.state);
    });
  }

  render() {
    return (
      <div className={styles.editWrapper}>
        <InfoTitle head="基本信息" />
        <div className={styles.lineInputWrap}>
          <div className={styles.label}>
            <i className={styles.required}>*</i>
              合约名称<span className={styles.colon}>:</span>
          </div>
          <div className={`${styles.componentBox} ${styles.inputBox}`}>
            <InputTextComponent
              value={this.state.contractName}
              onEmitEvent={this.changeContractName}
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
              data={this.state.childType.list}
              value={this.state.childType.value}
              onChange={this.changeChildType}
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
              value={this.state.client.value}
              searchList={this.state.client.list}
              emitSelectItem={this.selectClient}
              emitToSearch={this.searchClient}
              boxStyle={{ width: 220, height: 32, border: '1px solid #d9d9d9' }}
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
              value={moment(this.state.contractStarDate, 'YYYY-MM-DD')}
              onChange={this.changeDate}
              boxStyle={{ width: 220, height: 32 }}
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
              value={moment(this.state.contractPalidity, 'YYYY-MM-DD')}
              onChange={this.changeDate}
              boxStyle={{ width: 220, height: 32 }}
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
              value={moment(this.state.contractEndDate, 'YYYY-MM-DD')}
              onChange={this.changeDate}
              boxStyle={{ width: 220, height: 32 }}
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
              onChange={this.changeRemark}
            />
          </div>
        </div>
      </div>
    );
  }

}

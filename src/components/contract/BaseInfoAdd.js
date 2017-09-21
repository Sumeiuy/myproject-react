/*
* @Description: 合作合约新建 -基本信息
* @Author: XuWenKang
* @Date:   2017-09-21 15:27:31
* @Last Modified by:   XuWenKang
* @Last Modified time: 2017-09-21 17:51:11
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

import styles from './baseInfoAdd.less';

const { TextArea } = Input;

export default class BaseInfoEdit extends PureComponent {
  static propTypes = {
    childType: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    contractStarDate: PropTypes.string.isRequired,
    contractPalidity: PropTypes.string,
    remark: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    contractPalidity: '',
    remark: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      operation: {
        list: [{
          show: true,
          label: '订购',
          value: '1',
        }, {
          show: true,
          label: '退订',
          value: '2',
        }],
        value: '1',
      },
      contractNum: {
        list: [{
          show: true,
          label: '合约编号1',
          value: '1',
        }, {
          show: true,
          label: '合约编号1',
          value: '2',
        }],
        value: '1',
      },
    };
  }

  componentWillMount() {
    const {
      childType,
      client,
      contractStarDate,
      contractPalidity,
      remark,
    } = this.props;
    this.setState({
      childType,
      client,
      contractStarDate,
      contractPalidity,
      remark,
    });
  }

  @autobind
  selectChange(key, value) {
    console.log({ [key]: value });
    this.setState({
      ...this.state,
      [key]: {
        ...this.state[key],
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
    console.log('awdawd', moment(''));
    const { operation: { value: operationType } } = this.state;
    const contractNum = operationType === '1' ?
      (<div className={styles.lineInputWrap}>
        <div className={styles.label}>
          <i className={styles.required}>*</i>
            合约编号<span className={styles.colon}>:</span>
        </div>
        <div className={`${styles.componentBox} ${styles.selectBox}`}>
          <Select
            name="contractNum"
            data={this.state.contractNum.list}
            value={this.state.contractNum.value}
            onChange={this.selectChange}
          />
        </div>
      </div>)
      :
      null;
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
              data={this.state.operation.list}
              value={this.state.operation.value}
              onChange={this.selectChange}
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
              onChange={this.selectChange}
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
        {contractNum}
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


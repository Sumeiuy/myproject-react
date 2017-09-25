/*
* @Description: 合作合约新建 -基本信息
* @Author: XuWenKang
* @Date:   2017-09-21 15:27:31
* @Last Modified by:   XuWenKang
* @Last Modified time: 2017-09-22 17:24:29
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

import styles from './baseInfoAdd.less';

const { TextArea } = Input;

const operationList = [{
  show: true,
  label: '订购',
  value: '1',
}, {
  show: true,
  label: '退订',
  value: '2',
}];
const contractNumList = [{
  show: true,
  label: '合约编号1',
  value: '1',
}, {
  show: true,
  label: '合约编号2',
  value: '2',
}];
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
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {
      operation: '1',
      contractNum: '1',
      childType: '',
      client: '',
      contractStarDate: '',
      contractPalidity: '',
      remark: '',
    };
  }

  componentWillMount() {
    // const {
    //   childType: { value:childType },
    //   client: { value:client },
    //   contractStarDate,
    //   contractPalidity,
    //   remark,
    // } = this.props;
    // this.setState({
    //   childType,
    //   client,
    //   contractStarDate,
    //   contractPalidity,
    //   remark,
    // });
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
    const { operation } = this.state;
    const contractNumComponent = operation === '1' ?
      (<div className={styles.lineInputWrap}>
        <div className={styles.label}>
          <i className={styles.required}>*</i>
            合约编号<span className={styles.colon}>:</span>
        </div>
        <div className={`${styles.componentBox} ${styles.selectBox}`}>
          <Select
            name="contractNum"
            data={contractNumList}
            value={this.state.contractNum}
            onChange={this.handleSelectChange}
          />
        </div>
      </div>)
      :
      null;
    const contractStarDateComponent = operation === '1' ?
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
      <InfoItem label="合约开始日期" value="2017/08/31" />;
    const contractPalidityComponent = operation === '1' ?
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
      <InfoItem label="合约有效期" value="2017/08/31" />;
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
              data={childType.list}
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
        {contractNumComponent}
        {contractStarDateComponent}
        {contractPalidityComponent}
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


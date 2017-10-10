/*
* @Description: 合作合约修改 -基本信息
* @Author: XuWenKang
* @Date:   2017-09-20 13:47:07
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-10 14:39:38
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
import InfoForm from '../common/infoForm';
import DropDownSelect from '../common/dropdownSelect';
import DatePicker from '../common/datePicker';
import { seibelConfig } from '../../config';

import styles from './baseInfoEdit.less';

const { TextArea } = Input;
// 子类型列表
const childTypeList = _.filter(seibelConfig.contract.subType, v => v.label !== '全部');
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
// 操作类型MAP
const operationMap = {
  1: '订购',
  2: '退订',
};
export default class BaseInfoEdit extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    // 查询客户
    onSearchClient: PropTypes.func.isRequired,
    // 客户列表
    custList: PropTypes.array.isRequired,
    // 操作类型
    operationType: PropTypes.string.isRequired,
    // 合约详情
    contractDetail: PropTypes.object.isRequired,
  }

  static defaultProps = {

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
      id: '',
    };
  }

  componentWillMount() {
    // console.log('awdadadawd',this.props.contractDetail)
  }

  // componentWillReceiveProps(nextProps) {
  //   const { contractDetail = EMPTY_OBJECT } = this.props;
  //   const newcontractDetail = nextProps.contractDetail;
  //   // 判断新的合约详情和旧的合约详情是否一样，不一样则更新
  //   if (contractDetail.id !== newcontractDetail.id) {
  //     const {
  //     subType: childType = '',
  //     custId: client = '',
  //     startDt: contractStarDate = '',
  //     vailDt: contractPalidity = '',
  //     endDt: contractEndDate = '',
  //     description: remark = '',
  //     id: id = '',
  //   } = newcontractDetail;
  //     this.setState({
  //       childType,
  //       client,
  //       contractStarDate,
  //       contractPalidity,
  //       contractEndDate,
  //       remark,
  //       id,
  //     });
  //   }
  // }

  // 通用Select Change方法
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

  // 选择客户
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

  // 根据关键词查询客户
  @autobind
  handleSearchClient(v) {
    console.log('searchClient', v);
    this.props.onSearchClient(v);
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

  // 更改备注
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
    console.log('props', this.props);
    return (
      <div className={styles.editWrapper}>
        <InfoTitle head="基本信息" />
        <InfoItem label="操作类型" value={operationMap[operationType]} />
        <InfoForm label="子类型" required>
          <Select
            name="childType"
            data={childTypeList}
            value={this.state.childType}
            onChange={this.handleSelectChange}
          />
        </InfoForm>
        <InfoForm label="客户" required>
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
        </InfoForm>
        <InfoForm label="合约开始日期" required>
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
        </InfoForm>
        <InfoForm label="合约开始日期">
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
        </InfoForm>
        <InfoForm label="合约有效期">
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
        </InfoForm>
        <InfoForm label="合约终止日期">
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
        </InfoForm>
        <InfoForm label="备注">
          <TextArea
            value={this.state.remark}
            onChange={this.handleChangeRemark}
          />
        </InfoForm>
      </div>
    );
  }

}

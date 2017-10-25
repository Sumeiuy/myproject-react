/*
* @Description: 合作合约修改 -基本信息
* @Author: XuWenKang
* @Date:   2017-09-20 13:47:07
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-24 21:33:15
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Input } from 'antd';
import moment from 'moment';

import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import InfoForm from '../common/infoForm';
import DatePicker from '../common/datePicker';
import { seibelConfig } from '../../config';
import { dateFormat } from '../../utils/helper';

import styles from './baseInfoEdit.less';

// 操作类型列表
const { contract: { operationList } } = seibelConfig;
const { TextArea } = Input;
const EMPTY_PARAM = '暂无';
// 子类型列表
const childTypeList = _.filter(seibelConfig.contract.subType, v => v.label !== '全部');
console.warn('childtypelist', childTypeList);
// const EMPTY_OBJECT = {};
// const EMPTY_ARRAY = [];
// 时间选择组件样式
const datePickerBoxStyle = {
  width: 220,
  height: 32,
};
export default class BaseInfoEdit extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    // 合约详情
    contractDetail: PropTypes.object.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    const { contractDetail: { baseInfo } } = props;
    console.warn('baseinfo', baseInfo);
    // econNum
    this.state = {
      childType: _.filter(childTypeList, v => v.value === '0301')[0].label,
      contractStarDate: dateFormat(baseInfo.startDt),
      contractPalidity: dateFormat(baseInfo.vailDt),
      remark: baseInfo.description,
      id: '',
      oldData: {
        ...baseInfo,
      },
    };
  }

  // 根据code返回操作类型name
  @autobind
  getOperationType(type) {
    if (type) {
      return _.filter(operationList, v => v.value === type)[0].label;
    }
    return EMPTY_PARAM;
  }

  // 通用Select Change方法
  @autobind
  handleSelectChange(key, value) {
    this.setState({
      ...this.state,
      [key]: value,
    }, this.transferDataToHome);
  }

  // 通用 Date组件更新方法
  @autobind
  handleChangeDate(obj) {
    this.setState({
      ...this.state,
      [obj.name]: obj.value,
    }, this.transferDataToHome);
  }

  // 更改备注
  @autobind
  handleChangeRemark(e) {
    this.setState({
      ...this.state,
      remark: e.target.value,
    }, this.transferDataToHome);
  }

  // 向外传递数据
  @autobind
  transferDataToHome() {
    const data = this.state;
    const oldData = data.oldData;
    const obj = {
      // 操作类型--必填
      workflowname: data.operation || oldData.workflowname,
      // 子类型--必填
      subType: data.subType || oldData.subType,
      // 客户名称--必填
      custName: oldData.custName,
      // 客户 ID--必填
      custId: oldData.custId,
      // 客户类型--必填
      custType: oldData.custType,
      // 合约开始日期--订购状态下必填，退订不可编辑
      startDt: data.contractStarDate || oldData.startDt,
      // 合约有效期
      vailDt: data.contractPalidity || oldData.vailDt,
      // 备注
      description: data.remark || oldData.description,
    };
    this.props.onChange(obj);
  }

  render() {
    const {
      contractDetail: { baseInfo },
    } = this.props;
    const { oldData } = this.state;
    return (
      <div className={styles.editWrapper}>
        <InfoTitle head="基本信息" />
        <InfoItem label="操作类型" value={this.getOperationType(baseInfo.workflowName)} />
        <InfoItem label="子类型" value={this.state.childType} />
        <InfoItem label="客户" value={`${oldData.custName} ${oldData.econNum}`} />
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

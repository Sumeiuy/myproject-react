import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import style from './baseinfomodify.less';
import InfoTitle from '../common/InfoTitle';
import TextareaComponent from '../common/textareacomponent';
import DropdownSelect from '../common/dropdownSelect';
import Select from '../common/Select';
import { seibelConfig } from '../../config';

const { permission: { subType } } = seibelConfig;

export default class BaseInfoModify extends PureComponent {
  static propTypes = {
    head: PropTypes.string.isRequired,
    canApplyCustList: PropTypes.array.isRequired,
    subTypeTxt: PropTypes.string.isRequired,
    customer: PropTypes.string.isRequired,
    remark: PropTypes.string.isRequired,
    onEmitEvent: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  static contextTypes = {
    getCanApplyCustList: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      subTypeTxt: props.subTypeTxt,
    };
  }

  @autobind
  changeRemarks(value) {
    // 更改备注信息
    this.props.onEmitEvent('remark', value);
  }

  @autobind
  searchChildTypeList(value) {
    // 按 关键字 查询 子类型 列表
    this.context.getChildTypeList(value);
  }

  @autobind
  selectChildType(value) {
    // 选择子类型
    console.log('#####handleOk######', value);
  }

  @autobind
  selectCustomer(item) {
    // 选中客户
    this.props.onEmitEvent('customer', { custName: item.custName, custNumber: item.cusId });
  }

  @autobind
  searchCanApplyCustList(value) {
    // 按照 关键字 查询 客户 列表
    this.context.getCanApplyCustList(value);
  }

  @autobind
  updateSubTypeValue(name, value) {
    const result = subType.filter(item => (item.value === value))[0].label;
    this.setState({ subTypeTxt: result });
    this.props.onEmitEvent(name, value);
  }

  render() {
    return (
      <div className={style.baseInfo}>
        <p>{this.context.str}</p>
        <InfoTitle head={this.props.head} />

        <div className={style.inputComponent}>
          <span className={style.inputComponentTitle}>
            <i className={style.isRequired}>*</i>子类型：
          </span>
          <div className={style.inputComponentContent}>
            <div className={style.boxBorder}>
              <Select
                data={subType}
                name="subType"
                onChange={this.updateSubTypeValue}
                value={this.state.subTypeTxt}
              />
            </div>
          </div>
        </div>

        <div className={style.inputComponent}>
          <span className={style.inputComponentTitle}>
            <i className={style.isRequired}>*</i>客户：
          </span>
          <div className={style.inputComponentContent}>
            <DropdownSelect
              value={this.props.customer}
              placeholder="经济客户号/客户名称"
              searchList={this.props.canApplyCustList}
              showObjKey="custName"
              objId="cusId"
              emitSelectItem={this.selectCustomer}
              emitToSearch={this.searchCanApplyCustList}
              boxStyle={{ border: '1px solid #d9d9d9' }}
            />
          </div>
        </div>
        <TextareaComponent
          title="备注"
          value={this.props.remark}
          onEmitEvent={this.changeRemarks}
          placeholder="请输入您的备注信息"
        />
      </div>
    );
  }
}

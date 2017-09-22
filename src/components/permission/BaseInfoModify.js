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
    baseInfo: PropTypes.array,
    customerList: PropTypes.array.isRequired,
  }

  static defaultProps = {
    baseInfo: [],
  }

  static contextTypes = {
    getCustomerList: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.state = {
      // 标题
      // 备注
      remarks: '此处省略一万个字...',
      // 客户类型
      customer: '',
      // 子类型
      subType: '全部',
      // 客户列表
      customerList: [],
    };
  }

  @autobind
  changeRemarks(value) {
    // 更改备注信息
    this.setState({ remarks: value });
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
    console.log('向上传递选中的对象', item);
  }

  @autobind
  searchCustomerList(value) {
    // 按照 关键字 查询 客户 列表
    this.context.getCustomerList(value);
  }

  @autobind
  updateSubTypeValue(name, value) {
    const result = subType.filter(item => (item.value === value))[0].label;
    this.setState({ [name]: result });
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
                value={this.state.subType}
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
              value="全部"
              placeholder="经济客户号/客户名称"
              searchList={this.props.customerList}
              showObjKey="custName"
              objId="cusId"
              emitSelectItem={this.selectCustomer}
              emitToSearch={this.searchCustomerList}
              boxStyle={{ border: '1px solid #d9d9d9' }}
            />
          </div>
        </div>
        <TextareaComponent
          title="备注"
          value={this.state.remarks}
          onEmitEvent={this.changeRemarks}
          placeholder="请输入您的备注信息"
        />
      </div>
    );
  }
}

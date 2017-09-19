import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import style from './baseinfomodify.less';
import InfoTitle from '../common/InfoTitle';
import InputTextComponent from '../common/inputtextcomponent';
import TextareaComponent from '../common/textareacomponent';
import SearchModal from '../common/biz/SearchModal';
import DropdownSelect from '../common/dropdownSelect';
import columns from './PermissionColumns';
import Icon from '../common/Icon';
import PubSub from '../../utils/pubsub';

export default class BaseInfoModify extends PureComponent {
  static propTypes = {
    head: PropTypes.string.isRequired,
    baseInfo: PropTypes.array,
  }

  static defaultProps = {
    baseInfo: [],
  }

  constructor() {
    super();
    this.state = {
      // 标题
      title: '标题是什么',
      // 备注
      remarks: '此处省略一万个字...',
      // 客户类型
      customer: '',
      // 子类型
      childType: '',
      // 子类型列表
      childTypeList: [],
      // 客户列表
      customerList: [],
    };
  }

  componentDidMount() {
    // 子类型触发
    PubSub.childTypeList.add(this.updateChildTypeListValue);
    // 客户列表触发
    PubSub.customerList.add(this.updateCustomerListValue);
  }

  componentWillUnmount() {
    PubSub.childTypeList.remove(this.updateChildTypeListValue);
    PubSub.customerList.remove(this.updateCustomerListValue);
  }

  @autobind
  updateCustomerListValue(data) {
    this.setState({ customerList: data });
  }

  @autobind
  updateChildTypeListValue(data) {
    this.setState({ childTypeList: data });
  }

  @autobind
  updateTitle(value) {
    // 更改标题信息
    this.setState({ title: value });
  }

  @autobind
  changeRemarks(value) {
    // 更改备注信息
    this.setState({ remarks: value });
  }

  @autobind
  searchChildTypeList(value) {
    // 按 关键字 查询 子类型 列表
    PubSub.dispatchChildTypeList.dispatch(value);
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
    PubSub.dispatchCustomerList.dispatch(value);
  }

  @autobind
  renderSelectedElem(selected, removeFunc) {
    return (
      <div className={style.result}>
        <div className={style.nameLabel}>{selected.ptyMngName}</div>
        <div className={style.custIdLabel}>{selected.ptyMngId}</div>
        <div className={style.iconDiv}>
          <Icon
            type="close"
            className={style.closeIcon}
            onClick={removeFunc}
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={style.baseInfo}>
        <InfoTitle head={this.props.head} />
        <div className={style.inputComponent}>
          <span className={style.inputComponentTitle}>
            <i className={style.isRequired}>*</i>标题：
          </span>
          <div className={style.inputComponentContent}>
            <InputTextComponent
              value={this.state.title}
              placeholder="请输入标题"
              onEmitEvent={this.updateTitle}
            />
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
              searchList={this.state.customerList}
              showObjKey="custName"
              objId="cusId"
              emitSelectItem={this.selectCustomer}
              emitToSearch={this.searchCustomerList}
              boxStyle={{ border: '1px solid #d9d9d9' }}
            />
          </div>
        </div>
        <div className={style.inputComponent}>
          <span className={style.inputComponentTitle}>
            <i className={style.isRequired}>*</i>子类型：
          </span>
          <div className={style.inputComponentContent}>
            <SearchModal
              onOk={this.selectChildType}
              columns={columns}
              title="选择下一审批人员"
              dataSource={this.state.childTypeList}
              placeholder=""
              onSearch={this.searchChildTypeList}
              renderSelected={this.renderSelectedElem}
              rowKey="ptyMngId"
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

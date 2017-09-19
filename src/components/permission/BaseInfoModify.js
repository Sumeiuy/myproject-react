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

export default class BaseInfoModify extends PureComponent {
  static propTypes = {
    head: PropTypes.string.isRequired,
    // 暂时定义的对象
    serverInfo: PropTypes.array,
    baseInfo: PropTypes.array,
  }

  static defaultProps = {
    serverInfo: [],
    baseInfo: [],
  }

  constructor() {
    super();
    this.state = {
      title: '标题是什么',
      remarks: '此处省略一万个字...',
    };
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
    console.log(value);
  }

  @autobind
  selectCustomer(item) {
    // 选中客户
    console.log('向上传递选中的对象', item);
  }

  @autobind
  searchCustomerList(value) {
    // 按照 关键字 查询 客户 列表
    console.log('暴露的查询方法，向上传递value', value);
  }

  @autobind
  selectChildType(value) {
    // 选择子类型
    console.log('#####handleOk######', value);
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
              emitEvent={this.updateTitle}
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
              searchList={this.state.list}
              showObjKey="custName"
              objId="custNumber"
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
              dataSource={this.props.serverInfo}
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
          emitEvent={this.changeRemarks}
          placeholder="请输入您的备注信息"
        />
      </div>
    );
  }
}

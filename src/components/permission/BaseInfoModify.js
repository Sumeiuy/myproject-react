import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import style from './baseinfomodify.less';
import InfoTitle from '../common/InfoTitle';
import InputTextComponent from '../common/inputtextcomponent';
import TextareaComponent from '../common/textareacomponent';
import SearchModal from '../common/biz/SearchModal';
import DrapDownSelect from '../common/drapdownselect';
import columns from './PermissionColumns';

export default class BaseInfoModify extends PureComponent {
  static propTypes = {
    head: PropTypes.string.isRequired,
    serverInfo: PropTypes.array,
    // baseInfo: PropTypes.array,
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
  updateTitle(value) { // 更改标题信息
    this.setState({ title: value });
  }

  @autobind
  changeRemarks(value) { // 更改备注信息
    this.setState({ remarks: value });
  }
  @autobind
  searchInfo(value) {
    console.log(value);
  }

  @autobind
  selectItem(item) {
    // 选中下拉对象中对应的某个对象
    console.log('向上传递选中的对象', item);
  }

  @autobind
  toSearchInfo(value) {
    console.log('暴露的查询方法，向上传递value', value);
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
            <DrapDownSelect
              value="全部"
              placeholder="请输入姓名或工号"
              showObjKey="custName"
              emitSelectItem={this.selectItem}
              emitToSearch={this.toSearchInfo}
            />
          </div>
        </div>
        <div className={style.inputComponent}>
          <span className={style.inputComponentTitle}>
            <i className={style.isRequired}>*</i>子类型：
          </span>
          <div className={style.inputComponentContent}>
            <SearchModal
              dataSource={this.props.serverInfo}
              placeholder=""
              columns={columns}
              title="选择下一审批人员"
              onSearch={this.searchInfo}
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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Modal } from 'antd';
import { autobind } from 'core-decorators';
import InfoTitle from '../common/InfoTitle';
import TextareaComponent from '../common/textareacomponent';
import DropdownSelect from '../common/dropdownSelect';
import { emp } from '../../helper';
import style from './baseInfoModify.less';

export default class BaseInfoModify extends PureComponent {
  static propTypes = {
    head: PropTypes.string.isRequired,
    createCustList: PropTypes.array.isRequired,
    getCreateCustList: PropTypes.func.isRequired,
    customer: PropTypes.string.isRequired,
    remark: PropTypes.string.isRequired,
    onChangeBaseInfoState: PropTypes.func.isRequired,
    // 可申请开发关系认定的客户是否可用
    isValidCust: PropTypes.object.isRequired,
    getIsValidCust: PropTypes.func.isRequired,
    // 清空数据
    clearPropsData: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  // 更改备注信息
  @autobind
  handleChangeRemarks(value) {
    this.props.onChangeBaseInfoState('remark', value);
  }

  @autobind
  clearSelectValue() {
    if (this.selectCustComponent) {
      this.selectCustComponent.clearValue();
      this.props.clearPropsData();
    }
  }

  @autobind
  selectCustomer(item) {
    const { onChangeBaseInfoState, getIsValidCust } = this.props;
    onChangeBaseInfoState('customer', item);
    getIsValidCust({ brokerNumber: item.brokerNumber }).then(
      () => {
        const { isValidCust } = this.props;
        if (!_.isEmpty(isValidCust) && isValidCust.isSLMonth !== 'N') {
          Modal.info({
            title: '提示',
            content: '该客户为同城转销户且转销户时间小于一个月（30天），不能进行开发关系认定,请重新选择客户',
            okText: '确定',
            onOk: this.clearSelectValue,
          });
        }
        if (!_.isEmpty(isValidCust) && isValidCust.isYxry !== 'N') {
          Modal.info({
            title: '提示',
            content: '该客户的原开发团队中有营销人员，不能进行开发关系认定,请重新选择客户',
            okText: '确定',
            onOk: this.clearSelectValue,
          });
        }
      },
    );
  }

  @autobind
  searchCanApplyCustList(value) {
    // 按照 关键字 查询 客户 列表
    // 登录人orgId
    const orgId = emp.getOrgId();
    this.props.getCreateCustList({
      keyword: value,
      type: '06', // 06为开发关系认定的type代号
      orgId,
    });
  }

  render() {
    return (
      <div className={style.baseInfo}>
        <p>{this.context.str}</p>
        <InfoTitle head={this.props.head} />
        <div className={style.inputComponent}>
          <span className={style.inputComponentTitle}>
            <i className={style.isRequired}>*</i>客户：
          </span>
          <div className={style.inputComponentContent}>
            <DropdownSelect
              value={this.props.customer}
              placeholder="经纪客户号/客户名称"
              searchList={this.props.createCustList}
              showObjKey="custName"
              objId="cusId"
              emitSelectItem={this.selectCustomer}
              emitToSearch={this.searchCanApplyCustList}
              boxStyle={{ border: '1px solid #d9d9d9' }}
              ref={selectCustComponent => this.selectCustComponent = selectCustComponent}
            />
          </div>
        </div>
        <TextareaComponent
          title="备注"
          value={this.props.remark}
          onEmitEvent={this.handleChangeRemarks}
          placeholder="请输入您的备注信息"
        />
      </div>
    );
  }
}

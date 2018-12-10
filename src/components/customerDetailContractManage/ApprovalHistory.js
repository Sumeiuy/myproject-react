/**
 * @Description: 合约详情-审理历史
 * @Author: Liujianshu-K0240007
 * @Date: 2018-12-05 10:18:21
 * @Last Modified by: Liujianshu-K0240007
 * @Last Modified time: 2018-12-05 10:38:26
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Radio } from 'antd';

import IfTableWrap from '../common/IfTableWrap';
import { logCommon } from '../../decorators/logable';
import ApproveList from '../common/approveList';
import {
  APPROVAL_HISTORY_TYPE,
} from './config';
import styles from './approvalHistory.less';

const EMPTY_PARAM = '暂无';
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const DEFAULT_TYPE = APPROVAL_HISTORY_TYPE[0].key;

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default class ApprovalHistory extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    queryList: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const type = DEFAULT_TYPE;
    this.queryHistoryList(type);
  }

  @autobind
  handleTypeChange(e) {
    const type = e.target.value;
    this.queryHistoryList(type);
    const logText = _.filter(APPROVAL_HISTORY_TYPE, o => o.key === type);
    logCommon({
      type: 'ButtonClick',
      payload: {
        name: `审批历史${logText[0].name || ''}`,
      },
    });
  }

  @autobind
  queryHistoryList(type) {
    const {
      id,
      queryList,
    } = this.props;
    queryList({
      id,
      type,
    });
  }

  @autobind
  renderBtnGroup() {
    return (_.map(APPROVAL_HISTORY_TYPE, item => (
      <RadioButton value={item.key}>{item.name}</RadioButton>
    )));
  }

  render() {
    const {
      data = EMPTY_OBJECT,
    } = this.props;
    const {
      list = EMPTY_LIST,
      currentStep = EMPTY_OBJECT,
    } = data;
    const { handleName, handleId } = currentStep;
    const approverName = handleName ? `${handleName} (${handleId})` : EMPTY_PARAM;
    const nowStep = {
      ...currentStep,
      handleName: approverName,
    };

    const isRender = !_.isEmpty(data);
    return (
      <div>
        <div className={styles.radioGroup}>
          <RadioGroup onChange={this.handleTypeChange} defaultValue={DEFAULT_TYPE}>
            {this.renderBtnGroup()}
          </RadioGroup>
        </div>
        <IfTableWrap isRender={isRender} text="暂无审批历史信息">
          <ApproveList data={list} nowStep={nowStep} />
        </IfTableWrap>
      </div>
    );
  }
}

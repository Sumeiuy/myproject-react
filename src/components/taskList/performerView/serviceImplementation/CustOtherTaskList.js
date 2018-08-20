/**
 * @Author: XuWenKang
 * @Description: 客户名下其他代办任务
 * @Date: 2018-08-15 14:11:02
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-08-20 10:27:23
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import CommonTable from '../../../common/biz/CommonTable';
import TextCollapse from './TextCollapse';
import styles from './custOtherTaskList.less';
import {
  INTRO_SECOND_SEEP_IDNAME2,
  titleList,
} from './config';

const EMPTY_OBJECT = {};
// 展开收起按钮的样式
const buttonStyle = {
  bottom: '5px',
};
const { custOtherTaskList } = titleList;
// 任务名称的key
const KEY_TASK_NAME = 'eventName';
// 服务策略的key
const KEY_SERVICE_STRATEGY = 'contents';
// 任务提示的key
const KEY_TASK_HINT = 'hint';
// 两行显示最大字数
const MAX_LENGTH = 42;

export default class CustOtherTaskList extends PureComponent {
  static propTypes = {
    // 客户名下其他代办任务
    otherTaskList: PropTypes.array.isRequired,
    // 展开收起button的id
    foldButtonId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }

  @autobind
  getSlicedText(text) {
    return (text || '').length > MAX_LENGTH ? `${(text || '').slice(0, MAX_LENGTH)}...` : (text || '');
  }

  // 生成表格标题
  @autobind
  getColumnsCustTitleList() {
    const tempTitleList = [...custOtherTaskList];
    // 任务名称
    const nameColumn = _.find(tempTitleList, o => o.key === KEY_TASK_NAME);
    nameColumn.render = (text, record) => (
      <div className={styles.nameColumn}>
        <p className={styles.textOverflow} title={record.eventName}>{record.eventName}</p>
        <span className={styles.endTime}>{`${record.processTime}截止`}</span>
      </div>
    );
    // 服务策略
    const strategyColumn = _.find(tempTitleList, o => o.key === KEY_SERVICE_STRATEGY);
    strategyColumn.render = text => (<div title={text}>{this.getSlicedText(text)}</div>);
    // 任务提示
    const hintColumn = _.find(tempTitleList, o => o.key === KEY_TASK_HINT);
    hintColumn.render = text => (<div title={text}>{this.getSlicedText(text)}</div>);
    return tempTitleList;
  }

  render() {
    const {
      otherTaskList,
      foldButtonId,
      title,
    } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <h5 className={styles.title} id={INTRO_SECOND_SEEP_IDNAME2}>{title}</h5>
          <TextCollapse
            minHeight="0px"
            buttonStyle={buttonStyle}
            buttonId={foldButtonId}
            key={(otherTaskList[0] || EMPTY_OBJECT).flowId}
          >
            <div className={styles.content}>
              <CommonTable
                titleList={this.getColumnsCustTitleList()}
                data={otherTaskList}
                align="left"
                rowKey="flowId"
              />
            </div>
          </TextCollapse>
        </div>
      </div>
    );
  }
}

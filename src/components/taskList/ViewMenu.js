/**
 * @Author: xuxiaoqin
 * @Date: 2018-04-13 11:57:34
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-05-24 14:15:52
 * @description 视图切换组件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import { autobind } from 'core-decorators';

import logable from '../../decorators/logable';
import Button from '../common/Button';
import { getViewInfo } from '../../routes/taskList/helper';

import styles from './viewMenu.less';

const EMPTY_LIST = [];
const NOOP = _.noop;

export default class ViewMenu extends PureComponent {
  static propTypes = {
    // 当前视图列表
    chooseMissionViewOptions: PropTypes.array,
    // 视图发生改变触发事件
    onViewChange: PropTypes.func,
    location: PropTypes.object.isRequired,
    // 自建任务按钮事件
    creatSeibelModal: PropTypes.func,
  };

  static defaultProps = {
    chooseMissionViewOptions: EMPTY_LIST,
    onViewChange: NOOP,
    creatSeibelModal: NOOP,
  };

  /**
   * 选择视图的事件，触发请求
   * @param {*string} viewType 当前选择的视图类型
   */
  @autobind
  handleClick(viewType) {
    const { onViewChange } = this.props;
    onViewChange({
      name: 'switchView',
      missionViewType: viewType,
    });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '打开自建任务' } })
  handleCreateTask() {
    this.props.creatSeibelModal();
  }

  render() {
    const {
      chooseMissionViewOptions,
      location: {
        query: {
          missionViewType,
        },
      },
    } = this.props;

    // 默认取url中的missionViewType，否则从helper的getViewInfo方法中取
    const missionViewTypeValue = !_.isEmpty(missionViewType) ?
      missionViewType : getViewInfo().currentViewType;

    return (
      <div className={styles.content}>
        <div className={styles.menuSection}>
          {
            _.map(chooseMissionViewOptions, item =>
              <div
                className={
                  classnames({
                    [styles.item]: true,
                    // 激活的样式
                    [styles.active]: missionViewTypeValue === item.value,
                  })
                }
                onClick={() => this.handleClick(item.value)}
              >
                {item.label}
              </div>,
            )
          }
        </div>
        <div className={styles.btnSection}>
          <Button
            type="primary"
            icon="plus"
            size="small"
            onClick={this.handleCreateTask}
          >
            新建
          </Button>
        </div>
      </div>
    );
  }
}

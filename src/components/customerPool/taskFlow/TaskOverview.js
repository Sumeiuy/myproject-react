/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-10 10:29:33
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-10-11 14:44:22
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { autobind } from 'core-decorators';
// import classnames from 'classnames';
// import _ from 'lodash';
import styles from './taskOverview.less';

// const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

export default class TaskOverview extends PureComponent {
  static propTypes = {
    taskData: PropTypes.object,
  };

  static defaultProps = {
    taskData: EMPTY_OBJECT,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleTabChange(key) {
    console.log(key);
  }

  render() {
    return (
      <div className={styles.taskOverViewContainer}>
        <div className={styles.basicInfoSection}>
          <div className={styles.title}>基本任务信息</div>
          <div className={styles.divider} />
          <div className={styles.infoDescription}>
            <div className={styles.descriptionOrNameSection}>
              <div>任务名称：</div>
              <div>wewqewqewqewqewqewqewqewq</div>
            </div>
            <div className={styles.descriptionOrNameSection}>
              <div>任务描述：</div>
              <div>123213213213213委屈二无群二无群二无群二无群二其味无穷二无群额外企鹅我去服务器服务器让我去让我去</div>
            </div>
            <div className={styles.taskSection}>
              <div>
                <div>任务类型：</div>
                <div>wewqewqewqewqewqewqewqewq</div>
              </div>
              <div>
                <div>执行方式：</div>
                <div>wewqewqewqewqewqewqewqewq</div>
              </div>
            </div>
            <div className={styles.taskSection}>
              <div>
                <div>触发时间：</div>
                <div>2017/08/07（一）</div>
              </div>
              <div>
                <div>截止时间：</div>
                <div>2017/08/07（一）</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.basicInfoSection}>
          <div className={styles.title}>实施策略和提示</div>
          <div className={styles.divider} />
          <div className={styles.infoDescription}>
            <div className={styles.descriptionOrNameSection}>
              <div>服务策略：</div>
              <div>wewqewqewqewqewqewqewqewq</div>
            </div>
            <div className={styles.descriptionOrNameSection}>
              <div>任务提示：</div>
              <div>123213213213213委屈二无群二无群二无群二无群二其味无穷二无群额外企鹅我去服务器服务器让我去让我去</div>
            </div>
          </div>
        </div>

        <div className={styles.basicInfoSection}>
          <div className={styles.title}>目标客户</div>
          <div className={styles.divider} />
          <div className={styles.infoDescription}>
            <div className={styles.descriptionOrNameSection}>
              <div>客户来源：</div>
              <div>标签圈人</div>
            </div>
            <div className={styles.descriptionOrNameSection}>
              <div>客户数量：</div>
              <div>12321123户</div>
            </div>
            <div className={styles.descriptionOrNameSection}>
              <div>标签说明：</div>
              <div>123213213213213委屈二无群二无群二无群二无群二其味无穷二无群额外企鹅我去服务器服务器让我去让我去</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

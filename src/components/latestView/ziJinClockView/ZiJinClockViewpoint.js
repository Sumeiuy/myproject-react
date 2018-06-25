/**
 * @Author: XuWenKang
 * @Description: 最新观点首页-紫金时钟观点
 * @Date: 2018-06-22 09:50:10
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-06-22 15:49:19
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import Icon from '../../common/Icon';
import ViewpointListItem from './ViewpointListItem';
import styles from './ziJinClockViewpoint.less';

const EMPTY_LIST = [];

export default class ZiJinClockViewpoint extends PureComponent {
  static propTypes = {
    // 首页紫金时钟当前周期数据
    data: PropTypes.object.isRequired,
    // 首页紫金时钟列表
    list: PropTypes.array.isRequired,
  }

  @autobind
  getCycleList() {
    const { data } = this.props;
    const { list = EMPTY_LIST } = data;
    return list.map(item => (
      <div key={item.id} className={classnames(styles.chartItem, { [styles.active]: item.active })}>
        {
          item.active ?
            <a className={styles.cycleText} onClick={this.showModal}>{item.name}</a>
            :
            <span className={styles.cycleText}>{item.name}</span>
        }
      </div>
    ));
  }

  @autobind
  getViewpointList() {
    const { list } = this.props;
    return list.map((item, index) => {
      const key = `key-${index}`;
      const color = index % 2 === 0 ? '#fafcff' : '#fff';
      return (
        <ViewpointListItem
          key={key}
          backgroundColor={color}
          data={item}
        />
      );
    });
  }

  @autobind
  showModal() {
    console.log('当前周期');
  }

  @autobind
  toListPage() {
    console.log('toListPage');
  }

  render() {
    return (
      <div className={styles.ziJinBox}>
        <div className={`${styles.headerBox} clearfix`}>
          <Icon type="zijinshizhongguandian" />
          <span>紫金时钟观点</span>
          <a onClick={this.toListPage}>更多</a>
        </div>
        <div className={styles.chartBox}>
          <div className={styles.chartContent}>
            {
              this.getCycleList()
            }
          </div>
        </div>
        <div className={styles.listBox}>
          {
            this.getViewpointList()
          }
        </div>
      </div>
    );
  }
}

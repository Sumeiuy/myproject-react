/**
 * @Author: XuWenKang
 * @Description: 最新观点首页-紫金时钟观点
 * @Date: 2018-06-22 09:50:10
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-27 11:00:55
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';

import Icon from '../../common/Icon';
import logable from '../../../decorators/logable';
import { openRctTab } from '../../../utils';
import ViewpointListItem from './ViewpointListItem';
import ZijinClockDetailModal from './ZijinClockDetailModal';
import styles from './ziJinClockViewpoint.less';

const EMPTY_LIST = [];
const DETAIL_MODAL_VISIBLE = 'detailModalVisible';
export default class ZiJinClockViewpoint extends PureComponent {
  static propTypes = {
    // 首页紫金时钟当前周期数据
    data: PropTypes.object.isRequired,
    // 首页紫金时钟列表
    list: PropTypes.array.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      [DETAIL_MODAL_VISIBLE]: false,
    };
  }

  @autobind
  getCycleList() {
    const { data } = this.props;
    const { list = EMPTY_LIST } = data;
    return list.map(item => (
      <div key={item.id} className={classnames(styles.chartItem, { [styles.active]: item.active })}>
        {
          item.active ?
            <a className={styles.cycleText} onClick={this.openModal}>{item.name}</a>
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

  // 打开弹窗
  @autobind
  @logable({ type: 'Click', payload: { name: '打开弹窗' } })
  openModal() {
    this.setState({
      [DETAIL_MODAL_VISIBLE]: true,
    });
  }

  // 关闭弹窗
  @autobind
  closeModal(modalKey) {
    this.setState({
      [modalKey]: false,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '紫金时钟观点-更多' } })
  toListPage() {
    const { push } = this.context;
    const param = {
      id: 'RTC_TAB_ZIJIN_CLOCK_VIEWPOINT_LIST',
      title: '行业/主题调整',
    };
    const url = '/strategyCenter/latestView/industryThemeList';
    openRctTab({
      routerAction: push,
      url,
      param,
      pathname: url,
    });
  }

  render() {
    const { activeCycle = {} } = this.props.data;
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
        <ZijinClockDetailModal
          modalKey={DETAIL_MODAL_VISIBLE}
          visible={this.state[DETAIL_MODAL_VISIBLE]}
          closeModal={this.closeModal}
          data={activeCycle}
        />
      </div>
    );
  }
}

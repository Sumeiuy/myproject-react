/**
 * @Author: XuWenKang
 * @Description: 首页紫金时钟观点列表 Item
 * @Date: 2018-06-22 13:55:34
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-30 10:45:36
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import Icon from '../../common/Icon';
import { openRctTab } from '../../../utils';
import { url as urlHelper, time } from '../../../helper';
import logable from '../../../decorators/logable';
import config from '../config';
import styles from './viewpointListItem.less';

const EMPTY_LIST = [];
const MAX_HEIGHT = 21;
export default class ViewpointListItem extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    // 背景色
    backgroundColor: PropTypes.string.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      showToggleButton: false,
      toggle: false,
    };
  }

  componentDidMount() {
    this.showToggleButton();
  }

  componentDidUpdate() {
    this.showToggleButton();
  }

  @autobind
  getStockList() {
    const { data: { commend = EMPTY_LIST } } = this.props;
    return commend.map((item, index) => (
      <span className={styles.stockItem} key={item.code}>
        <a onClick={() => this.openStockPage(item)}>{`${item.name}(${item.code})`}</a>
        {
          index === commend.length - 1 ?
          null
          :
          <em>、</em>
        }
      </span>
    ));
  }

  @autobind
  showToggleButton() {
    if (this.stockContent.clientHeight > MAX_HEIGHT && !this.state.showToggleButton) {
      this.setState({
        showToggleButton: true,
      });
    }
  }

  @autobind
  @logable({ type: 'Click', payload: { name: 'name' ? 'shouqi2' : 'zhankai1' } })
  toggle() {
    this.setState({
      toggle: !this.state.toggle,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '$args[0].name', type: '紫金时钟观点' } })
  openStockPage(obj) {
    const { code } = obj;
    const { push } = this.context;
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id: 'FSP_STOCK_INFO',
      title: '个股资讯',
    };
    const query = {
      keyword: code,
    };
    const pathname = '/strategyCenter/stock';
    const url = `/strategyCenter/stock?${urlHelper.stringify(query)}`;
    openRctTab({
      routerAction: push,
      url,
      param,
      pathname,
      query,
    });
  }

  render() {
    const { showToggleButton, toggle } = this.state;
    const { backgroundColor, data } = this.props;
    return (
      <div className={styles.itemBox} style={{ backgroundColor }}>
        <div className={`${styles.top} clearfix`}>
          <h4 title={data.title}>{data.title}</h4>
          <span className={styles.time}>{time.format(data.time, config.dateFormatStr)}</span>
        </div>
        <div className={styles.middle}>
          <span className={styles.label}>推荐理由：</span>
          <span className={styles.reason} title={data.reason}>{data.reason}</span>
        </div>
        <div className={`${styles.bottom} clearfix`}>
          <span className={styles.label}>推荐个股：</span>
          <div
            className={styles.stockBox}
            style={{ height: toggle ? 'auto' : `${MAX_HEIGHT}px` }}
          >
            {
              showToggleButton ?
                <div className={styles.toggleBox}>
                  <a onClick={this.toggle}><Icon type={toggle ? 'shouqi2' : 'zhankai1'} /></a>
                </div>
                :
                null
            }
            <div
              className={styles.stockCon}
              ref={ref => this.stockContent = ref}
            >
              {
                this.getStockList()
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

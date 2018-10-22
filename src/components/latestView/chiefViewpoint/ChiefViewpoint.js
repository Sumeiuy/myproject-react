/**
 * @Author: XuWenKang
 * @Description: 最新观点-首页首席观点
 * @Date: 2018-06-21 16:50:10
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-12 21:08:35
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { openRctTab } from '../../../utils';
import { url as urlHelper, time } from '../../../helper';
import config from '../config';
import Icon from '../../common/Icon';
import logable from '../../../decorators/logable';
import styles from './chiefViewpoint.less';

// 内容最大长度
const MAX_LENGTH = 100;
export default class ChiefViewpoint extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '更多' } })
  toListPage() {
    const {
      type,
    } = this.props;
    const { push } = this.context;
    const param = {
      id: 'RTC_TAB_VIEWPOINT',
      title: '资讯列表',
    };
    const query = {
      type,
    };
    const url = `/latestView/viewpointList?${urlHelper.stringify(query)}`;
    openRctTab({
      routerAction: push,
      url,
      param,
      query,
      pathname: '/latestView/viewpointList',
    });
  }

  // 当前页跳转到详情页
  @autobind
  @logable({ type: 'Click', payload: { name: '详情' } })
  toDetailPage() {
    const { type, data: { id }, location: { query } } = this.props;
    const { push } = this.context;
    const param = {
      id: 'RTC_TAB_VIEWPOINT',
      title: '资讯',
    };
    const url = '/latestView/viewpointDetail';
    const newQuery = { ...query, type, id, sourceUrl: '/latestView' };
    openRctTab({
      routerAction: push,
      url: `${url}?${urlHelper.stringify(newQuery)}`,
      param,
      pathname: url,
      query: newQuery,
      name: '资讯详情',
    });
  }

  render() {
    const { data, title } = this.props;
    const { content = '' } = data;
    // 去除内容所有html标签
    const newContent = (content || '暂无内容').replace(/<[^>]*>/g, '');
    const slicedContent = newContent.length > MAX_LENGTH ?
      `${newContent.slice(0, MAX_LENGTH)}...` : newContent;
    return (
      <div className={styles.chiefViewpointBox}>
        <div className={`${styles.headerBox} clearfix`}>
          <Icon type="meizhoushouxiguandian" />
          <span>{title}</span>
          <a onClick={this.toListPage}>更多</a>
        </div>
        <div>
          <h4 className={styles.title} title={data.title}>{data.title}</h4>
        </div>
        <p className={styles.time}>{time.format(data.time, config.dateFormatStr)}</p>
        <p className={styles.content}>
          {slicedContent}
        </p>
        <div className={`${styles.footer} clearfix`}>
          <a onClick={this.toDetailPage}>[详情]</a>
        </div>
      </div>
    );
  }
}

/**
 * @Author: XuWenKang
 * @Description: 最新观点-首页首席观点
 * @Date: 2018-06-21 16:50:10
 * @Last Modified by:   XuWenKang
 * @Last Modified time: 2018-06-21 16:50:10
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { linkTo, openRctTab } from '../../../utils';
import { url as urlHelper } from '../../../helper';
import Icon from '../../common/Icon';
import styles from './chiefViewpoint.less';

// 内容最大长度
const MAX_LENGTH = 123;
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
  toListPage() {
    const {
      type,
    } = this.props;
    const { push } = this.context;
    const param = {
      id: 'RTC_TAB_VIEWPOINT',
      title: '资讯',
    };
    const query = {
      type,
    };
    const url = `/latestView/viewpointList?${urlHelper.stringify(query)}`;
    openRctTab({
      routerAction: push,
      url,
      param,
      pathname: url,
    });
  }

  // 当前页跳转到详情页
  @autobind
  toDetailPage() {
    const { data: { id }, location: { query } } = this.props;
    const { push } = this.context;
    const param = {
      id: 'RTC_TAB_VIEWPOINT',
      title: '资讯',
    };
    const url = '/latestView/viewpointDetail';
    const newQuery = { ...query, id, sourceUrl: '/latestView' };
    linkTo({
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
    const slicedContent = content.length > MAX_LENGTH ?
      `${content.slice(0, MAX_LENGTH)}...` : content;
    return (
      <div className={styles.chiefViewpointBox}>
        <div className={`${styles.headerBox} clearfix`}>
          <Icon type="meizhoushouxiguandian" />
          <span>{title}</span>
          <a onClick={this.toListPage}>更多</a>
        </div>
        <h4 className={styles.title}>{data.title}</h4>
        <p className={styles.time}>{data.time}</p>
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

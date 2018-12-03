/**
 * @Description: 大类资产配置分析豆腐块
 * @Author: Liujianshu
 * @Date: 2018-06-20 14:02:12
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-30 10:52:46
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';

import { time as timeHelper } from '../../../helper';
import { logPV } from '../../../decorators/logable';
import config from '../config';
import styles from './item.less';

const { dateFormatStr } = config;

export default class Item extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    modalKey: PropTypes.string.isRequired,
    openModal: PropTypes.func.isRequired,
    getDetail: PropTypes.func.isRequired,
    isEven: PropTypes.bool,
  }

  static defaultProps = {
    isEven: true,
  }

  @autobind
  @logPV({ pathname: '/modal/detailClickLog', title: '大类资产配置分析详情弹框' })
  handleDetailClick() {
    const {
      data: { id = '' }, openModal, modalKey, getDetail
    } = this.props;
    getDetail({ id }).then(() => {
      openModal(modalKey);
    });
  }

  render() {
    const { data, isEven } = this.props;
    const {
      title, categoryName, time, gradeName, content
    } = data;
    const wrapperClassName = classnames({
      [styles.itemWrapper]: true,
      [styles.even]: isEven,
    });
    return (
      <div className={wrapperClassName}>
        <div className={styles.title}>
          <div>{title}</div>
          <div>{categoryName}</div>
        </div>
        <h3>
          {/* 如果没有评级，则不显示该标签 */}
          {
            gradeName ? <span>{gradeName}</span> : null
          }
          {timeHelper.format(time, dateFormatStr)}
        </h3>
        <p>{content}</p>
        <div className={styles.link}><a onClick={this.handleDetailClick}>[详情]</a></div>
      </div>
    );
  }
}

/*
 * @Author: zhangjun
 * @Descripter: 活动栏目跑马灯
 * @Date: 2018-11-06 13:53:39
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-09 19:35:48
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import Carousel from '../../../common/carousel';
import { data } from '../../../../helper';
import { defaultMenu } from '../../../../config/tabMenu';
import { parseURL, filterData } from './helper';
import { logPV } from '../../../../decorators/logable';
import styles from './activityColumnCarousel.less';

export default class ActivityColumnCarousel extends Component {
  static propsTypes = {
    activityColumnList: PropTypes.array.isRequired,
  }

  static contextTypes = {
    push: PropTypes.func.isRequired,
  }

  @autobind
  @logPV({
    type: 'Click',
    payload: {
      name: '活动栏目',
    },
  })
  handleClick(url) {
    // 获取url的信息
    const urlInfo = parseURL(url);
    console.warn('urlInfo', urlInfo);
    const { hash } = urlInfo;
    console.warn('hash', hash);
    const defaultMenuPathList = filterData(defaultMenu, 'path');
    // 判断是否是内部网址
    const isInnerPath = _.find(defaultMenuPathList, item => item === hash);
    if (!_.isEmpty(isInnerPath)) {
      const { push } = this.context;
      push(hash);
    } else {
      // window.open(url);
    }
  }

  render() {
    const { activityColumnList } = this.props;
    const activityColumnListData = _.map(activityColumnList, (item) => {
      const { attaches, link, description, url } = item;
      const { name } = attaches[0];
      return (
        <div className={styles.itemSlide} onClick={() => this.handleClick(link)} key={data.uuid()}>
          <img src={url} alt={name} title={description} />
        </div>
      );
    });
    return (
      <div className={styles.activityColumnCarousel}>
        <Carousel autoplay>
            {activityColumnListData}
        </Carousel>
      </div>
    );
  }
}

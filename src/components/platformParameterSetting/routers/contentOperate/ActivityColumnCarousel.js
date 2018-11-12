/*
 * @Author: zhangjun
 * @Descripter: 活动栏目跑马灯
 * @Date: 2018-11-06 13:53:39
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-12 16:09:07
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import url from 'url';
import { autobind } from 'core-decorators';
import Carousel from '../../../common/carousel';
import { data } from '../../../../helper';
import { defaultMenu } from '../../../../config/tabMenu';
import { filterData } from './helper';
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
  handleClick(columnUrl) {
    // 获取url的信息
    const urlInfo = url.parse(columnUrl);
    const { hash } = urlInfo;
    const defaultMenuPathList = filterData(defaultMenu, 'path');
    // 判断是否是内部网址
    const isInnerPath = _.find(defaultMenuPathList, item => _.includes(hash, item));
    if (!_.isEmpty(isInnerPath)) {
      // hash返回的数据是'#/***', path需要去掉字符串前面的#
      const path = hash.slice(1);
      this.context.push(path);
    } else {
      window.open(columnUrl);
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
        <Carousel
          autoplay
          autoplaySpeed={3000}
          dots={false}
        >
            {activityColumnListData}
        </Carousel>
      </div>
    );
  }
}

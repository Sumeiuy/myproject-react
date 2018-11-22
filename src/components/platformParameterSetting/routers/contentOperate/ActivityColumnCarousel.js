/*
 * @Author: zhangjun
 * @Descripter: 活动栏目跑马灯
 * @Date: 2018-11-06 13:53:39
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-16 13:48:50
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import url from 'url';
import { autobind } from 'core-decorators';
import Carousel from '../../../common/carousel';
import Tooltip from '../../../common/Tooltip';
import { data } from '../../../../helper';
import { defaultMenu, newOpenTabConfig } from '../../../../config/tabMenu';
import { filterData } from './helper';
import { urlRegExp } from './config';
import { logPV } from '../../../../decorators/logable';
import styles from './activityColumnCarousel.less';

const columnOverlayStyle = {
  whiteSpace: 'pre',
};

export default class ActivityColumnCarousel extends Component {
  static propsTypes = {
    activityColumnList: PropTypes.array.isRequired,
  }

  static contextTypes = {
    push: PropTypes.func.isRequired,
  }

  // 判断URL，把www开头的URL转换成http开头
  @autobind
  replaceUrl(text) {
    return text.replace(urlRegExp, (match) => {
      const isWWW = /^www\./.test(match);
      return isWWW ? `http://${match}` : match;
    });
  }

  @autobind
  @logPV({ pathname: '/modal/ActivityColumnCarouselModal', title: '首页-活动栏目' })
  handleClick(columnUrl) {
    const finalUrl = this.replaceUrl(columnUrl);
    // 获取url的信息
    const urlInfo = url.parse(finalUrl);
    const { hash } = urlInfo;
    // 检测是否在新开tab中
    if (!_.isEmpty(hash)) {
      const isInNewOpenTabResult = this.isInNewOpenTab(hash);
      const isInDefaultMenuResult = this.isInDefaultMenu(hash);
      if (!_.isEmpty(isInNewOpenTabResult) || !_.isEmpty(isInDefaultMenuResult)) {
        // hash返回的数据是'#/***', path需要去掉字符串前面的#
        const path = hash.slice(1);
        this.context.push(path);
      } else {
        window.open(finalUrl);
      }
    } else {
      window.open(finalUrl);
    }
  }

  // 检测是否在新开tab中
  @autobind
  isInNewOpenTab(hash) {
    const path = hash.slice(1);
    const newOpenTabPathList = filterData(newOpenTabConfig, 'path');
    return _.find(newOpenTabPathList, item => _.includes(path, item));
  }

  // 检测是否在defaultMenu中,如果是/fsp开头的话，需要去掉/fsp去匹配defaultMenu,否则直接匹配defaultMenu
  @autobind
  isInDefaultMenu(hash) {
    const path = hash.slice(1);
    // 已fsp开头的路径
    const isStartOfFsp = /^\/fsp\./.test(path);
    const defaultMenuPathList = filterData(defaultMenu, 'path');
    if (isStartOfFsp) {
      const finalPath = path.slice(3);
      return _.find(defaultMenuPathList, item => _.includes(finalPath, item));
    } else {
      return _.find(defaultMenuPathList, item => _.includes(path, item));
    }
  }

  render() {
    const { activityColumnList } = this.props;
    const activityColumnListData = _.map(activityColumnList, (item) => {
      const { attaches, link, description, url } = item;
      const { name } = attaches[0];
      return (
        <div className={styles.itemSlide} onClick={() => this.handleClick(link)} key={data.uuid()}>
          <Tooltip
            overlayStyle={columnOverlayStyle}
            title={description}
          >
            <img src={url} alt={name} />
          </Tooltip>
        </div>
      );
    });
    return (
      <div className={styles.activityColumnCarousel}>
        {
          _.isEmpty(activityColumnListData)
            ? null
            : (
              <Carousel
                autoplay
                autoplaySpeed={3000}
              >
                {activityColumnListData}
              </Carousel>
            )
        }
      </div>
    );
  }
}

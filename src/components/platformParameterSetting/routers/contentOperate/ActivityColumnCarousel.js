/*
 * @Author: zhangjun
 * @Descripter: 活动栏目跑马灯
 * @Date: 2018-11-06 13:53:39
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-08 09:59:55
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import Carousel from '../../../common/carousel';
import { data } from '../../../../helper';
import logable from '../../../../decorators/logable';
import styles from './activityColumnCarousel.less';

export default class ActivityColumnCarousel extends PureComponent {
  static propsTypes = {
    activityColumnList: PropTypes.array.isRequired,
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '活动栏目',
    },
  })
  handleClick(url) {
    window.open(url);
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

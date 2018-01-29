/**
 * @fileOverview components/customerPool/InfoArea.js
 * @author zhangjunli
 * @description 执行者视图右侧详情的基本信息
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import LabelInfo from '../common/LabelInfo';
import styles from './infoArea.less';

export default class InfoArea extends PureComponent {

  static propTypes = {
    data: PropTypes.array,
    headLine: PropTypes.string,
  }

  static defaultProps = {
    data: [],
    headLine: '--',
  }

  render() {
    const {
      data,
      headLine,
    } = this.props;

    return (
      <div className={styles.basicInfo}>
        <LabelInfo value={headLine} />
        <div className={styles.basicInfoContent}>
          {
            _.map(
              data,
              item => (
                <div className={styles.coloumn}>
                  <div
                    className={classnames(
                      styles.infoKey,
                      { [styles.keyNone]: _.isEmpty(item.key) },
                    )}
                  >{item.key}</div>
                  <div className={styles.infoValue}>{item.value}</div>
                </div>
              ),
            )
          }
        </div>
      </div>
    );
  }
}

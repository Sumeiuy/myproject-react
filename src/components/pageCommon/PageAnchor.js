/**
 * @file pageCommon/PageAnchor.js
 * @description 经营业绩看板页内导航
 * @author hongguangqing
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { Anchor } from 'antd';
import _ from 'lodash';
import { reportAnchorOptions } from '../../config';
import styles from './pageAnchor.less';

const { Link } = Anchor;
export default class PageAnchor extends PureComponent {

  static propTypes = {
    chartInfo: PropTypes.array.isRequired,
  }

  /**
   * key和value显示转换
  */
  @autobind
  changeDisplay(st, options) {
    if (st) {
      const nowStatus = _.find(options, o => o.key === st);
      return nowStatus.value;
    }
    return '其他';
  }

  /**
   * 点击锚点滚动到对应的位置
  */
  @autobind
  anchorScrollFunc(e) {
    e.preventDefault();
  }

  render() {
    const { chartInfo } = this.props;
    const charInfoLength = chartInfo.length;
    return (
      <div>
        {
          charInfoLength >= 3 ?
            <Anchor className={styles.pageAnchor} offsetTop={65} >
              {
              chartInfo.map((item) => {
                const { key } = item;
                const href = `#${key}`;
                return (
                  <Link
                    key={key}
                    href={href}
                    title={this.changeDisplay(key, reportAnchorOptions)}
                  />
                );
              })
            }
            </Anchor>
          :
            <div />
        }
      </div>
    );
  }
}

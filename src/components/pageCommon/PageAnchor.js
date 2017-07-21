/**
 * @file pageCommon/PageAnchor.js
 * @description 经营业绩看板页内导航
 * @author hongguangqing
 */
import React, { PureComponent, PropTypes } from 'react';
import { BackTop } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import Icon from '../common/Icon';

import Anchor from '../../components/common/anchor';
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
      if (nowStatus) {
        return nowStatus.value;
      }
    }
    return '其他';
  }

  /**
   * 点击返回顶部图标滚动顶部
  */
  @autobind
  handleGotoTop() {
    const fsp = document.querySelector('#workspace-content>.wrapper');
    if (fsp) {
      fsp.scrollTop = 0;
    } else {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { chartInfo } = this.props;
    const charInfoLength = chartInfo.length;
    return (
      <div>
        {
          charInfoLength >= 3 ?
            <Anchor className={styles.pageAnchor} offsetTop={80} >
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
              <Link><BackTop visibilityHeight={0}><div><Icon type="fanhuidingbu" /></div></BackTop></Link>
            </Anchor>
          :
            <div />
        }
      </div>
    );
  }
}

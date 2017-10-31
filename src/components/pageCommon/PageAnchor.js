/**
 * @file pageCommon/PageAnchor.js
 * @description 经营业绩看板页内导航
 * @author hongguangqing
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import Icon from '../common/Icon';

import Anchor from '../../components/common/anchor';
import { fspContainer, reportAnchorOptions } from '../../config';
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
    const fsp = document.querySelector(fspContainer.container);
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
            <Anchor className={styles.pageAnchor} offsetTop={130} >
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
              <Link><div className={styles.gotoTop} onClick={this.handleGotoTop}><Icon type="fanhuidingbu" /></div></Link>
            </Anchor>
          :
            <div />
        }
      </div>
    );
  }
}

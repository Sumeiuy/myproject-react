/**
 * @fileOverview components/pageCommon/PageHeader.js
 * @author sunweibin
 * @description 用于业绩页面头部区域模块
 */

import React, { PropTypes, PureComponent } from 'react';
import { Row } from 'antd';

import CustRange from './CustRange2';
import BoardSelect from './BoardSelect';
import DurationSelect from './DurationSelect';
// 选择项字典
import styles from './PageHeader.less';

export default class PageHeader extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    custRange: PropTypes.array,
    visibleBoards: PropTypes.array,
  }

  static defaultProps = {
    custRange: [],
    visibleBoards: [],
  }

  render() {
    const { replace, push, custRange, location, visibleBoards } = this.props;

    return (
      <div className="reportHeader">
        <Row type="flex" justify="start" align="middle">
          <div className="reportName">
            {/* 需要针对预览页面做调整 */}
            <BoardSelect
              location={location}
              push={push}
              replace={replace}
              visibleBoards={visibleBoards}
            />
          </div>
          <div className={styles.reportHeaderRight}>
            <DurationSelect
              location={location}
              replace={replace}
            />
            <div className={styles.vSplit} />
            {/* 营业地址选择项 */}
            <CustRange
              custRange={custRange}
              location={location}
              replace={replace}
            />
          </div>
        </Row>
      </div>
    );
  }
}

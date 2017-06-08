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
    selectDefault: PropTypes.string.isRequired,
    custRange: PropTypes.array,
  }

  static defaultProps = {
    custRange: [],
  }

  render() {
    const { replace, custRange, location, selectDefault } = this.props;

    return (
      <div className="reportHeader">
        <Row type="flex" justify="start" align="middle">
          <div className="reportName">
            <BoardSelect
              location={location}
              selectDefault={selectDefault}
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

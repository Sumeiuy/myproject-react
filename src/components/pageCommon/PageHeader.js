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
    updateQueryState: PropTypes.func.isRequired,
    collectBoardSelect: PropTypes.func.isRequired,
    collectCustRange: PropTypes.func.isRequired,
    collectDurationSelect: PropTypes.func.isRequired,
    custRange: PropTypes.array,
    visibleBoards: PropTypes.array,
    preView: PropTypes.bool,
    reportName: PropTypes.string,
    orgId: PropTypes.string,
  }

  static defaultProps = {
    custRange: [],
    visibleBoards: [],
    preView: false,
    reportName: '',
    orgId: '',
  }

  render() {
    const {
      preView,
      reportName,
      replace,
      push,
      custRange,
      location,
      visibleBoards,
      updateQueryState,
      orgId,
      collectBoardSelect,
      collectCustRange,
      collectDurationSelect,
    } = this.props;

    return (
      <div className="reportHeader">
        <Row type="flex" justify="start" align="middle">
          <div className="reportName">
            {/* 需要针对预览页面做调整 */}
            {
              preView
              ?
              (
                <div className="preView">
                  {reportName}
                </div>
              )
              :
              (
                <BoardSelect
                  location={location}
                  push={push}
                  replace={replace}
                  visibleBoards={visibleBoards}
                  collectData={collectBoardSelect}
                />
              )
            }
          </div>
          <div className={styles.reportHeaderRight}>
            <DurationSelect
              location={location}
              replace={replace}
              updateQueryState={updateQueryState}
              collectData={collectDurationSelect}
            />
            <div className={styles.vSplit} />
            {/* 营业地址选择项 */}
            <CustRange
              custRange={custRange}
              location={location}
              replace={replace}
              updateQueryState={updateQueryState}
              orgId={orgId}
              collectData={collectCustRange}
            />
          </div>
        </Row>
      </div>
    );
  }
}

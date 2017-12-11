/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 17:12:08
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-12-11 14:46:55
 * 任务实施简报
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Row, Col } from 'antd';
import LabelInfo from '../common/LabelInfo';
import MissionProgress from './MissionProgress';
import CustFeedback from './CustFeedback';
import TabsExtra from '../../customerPool/home/TabsExtra';
import styles from './missionImplementation.less';
import emptyImg from '../../../../static/images/empty.png';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const EMPTY_CONTENT = '本机构无服务客户';
const MAIN_MAGEGER_ID = 'msm';

export default class MissionImplementation extends PureComponent {

  static propTypes = {
    // 任务实施进度
    missionImplementationProgress: PropTypes.object,
    // 客户反馈结果
    custFeedback: PropTypes.array,
    isFold: PropTypes.bool,
    // 预览客户明细
    onPreviewCustDetail: PropTypes.func.isRequired,
    collectCustRange: PropTypes.func.isRequired,
    cycle: PropTypes.array,
  }

  static defaultProps = {
    missionImplementationProgress: EMPTY_OBJECT,
    custFeedback: EMPTY_LIST,
    isFold: false,
    cycle: EMPTY_LIST,
    collectCustRange: () => { },
  }

  constructor(props) {
    super(props);
    this.state = {
      expandAll: false,
      cycleSelect: '',
      createCustRange: [],
      isDown: true,
    };
  }

  @autobind
  handlePreview() {
    const { onPreviewCustDetail } = this.props;
    onPreviewCustDetail();
  }

  @autobind
  renderTabsExtra() {
    const {
      // collectCustRange,
      cycle,
      // location = {},
    } = this.props;
    const {
      expandAll,
      // cycleSelect,
      collectCustRange,
      createCustRange,
      isDown,
    } = this.state;
    // const { query: {
    //   // orgId,
    //   cycleSelect,
    // } } = location;
    // curOrgId   客户范围回填
    // 当url中由 orgId 则使用orgId
    // 有权限时默认取所在岗位的orgId
    // 无权限取 MAIN_MAGEGER_ID
    // const curOrgId = MAIN_MAGEGER_ID;
    // curCycleSelect  时间周期，先从url中取值，url中没有值时，取时间周期第一个
    const curCycleSelect = (cycle[0] || {}).key;
    // if (orgId) {
    //   curOrgId = orgId;
    // } else if (!this.isHasAuthorize) {
    //   curOrgId = MAIN_MAGEGER_ID;
    // }
    const extraProps = {
      custRange: createCustRange,
      // replace,
      updateQueryState: this.updateQueryState,
      collectCustRange,
      cycle,
      expandAll,
      selectValue: curCycleSelect,
      location,
      orgId: MAIN_MAGEGER_ID,
      isDown,
    };
    return (<TabsExtra {...extraProps} />);
  }

  render() {
    const {
      missionImplementationProgress = EMPTY_OBJECT,
      isFold,
      custFeedback = EMPTY_LIST,
    } = this.props;

    const colSpanValue = isFold ? 12 : 24;

    return (
      <div className={styles.missionImplementationSection}>
        <div className={styles.title}>
          <div className={styles.leftSection}>
            <LabelInfo value={'任务实施简报'} />
          </div>
          <div className={styles.rightSection}>
            <div>
              {this.renderTabsExtra()}
            </div>
          </div>
        </div>
        {
          _.isEmpty(missionImplementationProgress) && _.isEmpty(custFeedback) ?
            <div className={styles.emptyContent}>
              <img src={emptyImg} alt={EMPTY_CONTENT} />
              <div className={styles.tip}>{EMPTY_CONTENT}</div>
            </div> :
            <div className={styles.content}>
              <Row>
                <Col span={colSpanValue}>
                  <MissionProgress
                    missionImplementationProgress={missionImplementationProgress}
                    onPreviewCustDetail={this.handlePreview}
                  />
                </Col>
                <Col span={colSpanValue}>
                  <CustFeedback
                    custFeedback={custFeedback}
                  />
                </Col>
              </Row>
            </div>
        }
      </div>
    );
  }
}

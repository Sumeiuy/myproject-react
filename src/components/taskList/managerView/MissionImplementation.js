/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 17:12:08
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-12-08 17:37:27
 * 任务实施简报
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import _ from 'lodash';
import { Row, Col } from 'antd';
import LabelInfo from '../common/LabelInfo';
import MissionProgress from './MissionProgress';
import CustFeedback from './CustFeedback';
import styles from './missionImplementation.less';
import emptyImg from '../../../../static/images/empty.png';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const EMPTY_CONTENT = '本机构无服务客户';

export default class MissionImplementation extends PureComponent {

  static propTypes = {
    // 任务实施进度
    missionImplementationProgress: PropTypes.object,
    // 客户反馈结果
    custFeedback: PropTypes.array,
    isFold: PropTypes.bool,
    // 预览客户明细
    onPreviewCustDetail: PropTypes.func.isRequired,
  }

  static defaultProps = {
    missionImplementationProgress: EMPTY_OBJECT,
    custFeedback: EMPTY_LIST,
    isFold: false,
  }

  @autobind
  handlePreview() {
    const { onPreviewCustDetail } = this.props;
    onPreviewCustDetail();
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
            下拉框
          </div>
        </div>
        {
          true ?
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

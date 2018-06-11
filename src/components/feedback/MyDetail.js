/*
 * @Description:  我的反馈详情
 * @Author: 张俊丽
 * @Date: 2018-06-5 14:49:16
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Button } from 'antd';
import moment from 'moment';
import _ from 'lodash';

import LabelInfo from '../taskList/common/LabelInfo';
import Field from './Field';
import RemarkList from './RemarkList';
import Icon from '../common/Icon';
import styles from './myDetail.less';

// 不能写成无状态组件，因为容器组件要求能访问ref
export default class MyDetail extends PureComponent {
  static propTypes = {
    processList: PropTypes.array.isRequired,
    feedbackDetail: PropTypes.object.isRequired,
    showQuestionModal: PropTypes.func.isRequired,
    resolveQuestion: PropTypes.func.isRequired,
    handleScreenshot: PropTypes.func.isRequired,
  }

  @autobind
  renderScreenshot(imgUrl) {
    const { handleScreenshot } = this.props;
    return (
      <div
        className={styles.screenshot}
        onClick={() => { handleScreenshot(imgUrl); }}
      >
        <a><Icon type={'pic'} /> 查看</a>
      </div>
    );
  }

  render() {
    const {
      processList,
      feedbackDetail,
      resolveQuestion,
      showQuestionModal,
    } = this.props;
    const {
      status = '',
      feedId = '--',
      createTime = '--',
      description = '--',
      feedbackFileUrls = [],
    } = feedbackDetail || {};

    const isStatusEmpty = _.isEmpty(status);
    const statusInfo = status === 'PROCESSING' ? '解决中' : '关闭';
    const imageUrl = _.head(feedbackFileUrls) || '';
    const date = moment(createTime).format('YYYY-MM-DD hh:mm');

    let detailInfo = [{
      id: 'status',
      key: '状态 :',
      value: isStatusEmpty ? '--' : statusInfo,
    }, {
      id: 'feedbackTime',
      key: '反馈时间 :',
      value: date,
    }, {
      id: 'feedbackDesc',
      key: '反馈详情 :',
      value: description,
    }];
    if (!_.isEmpty(imageUrl)) {
      detailInfo = [
        ...detailInfo,
        {
          id: 'screenshot',
          key: '截图 :',
          value: this.renderScreenshot(imageUrl),
        },
      ];
    }

    return (
      <div className={styles.detailContainer}>
        <div className={styles.innerContainer}>
          <div className={styles.headLine}>{`问题编号${feedId}`}</div>
          <LabelInfo value="问题详情" wrapperClass={styles.infoTitle} />
          <Field
            data={detailInfo}
            columnClass={styles.columnContainer}
            contentClass={styles.contentContainer}
          />
          <LabelInfo value="问题答复" wrapperClass={styles.infoTitle} />
          <RemarkList
            category="user"
            className={styles.remarkQuestion}
            remarkList={processList}
          />
          {
            status === 'CLOSED' ? null : (
              <div className={styles.footer}>
                <Button
                  className={styles.btn}
                  onClick={showQuestionModal}
                >继续追问</Button>
                <Button
                  type="primary"
                  className={styles.btn}
                  onClick={resolveQuestion}
                >已解决</Button>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

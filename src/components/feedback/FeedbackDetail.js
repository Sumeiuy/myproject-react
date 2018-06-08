/*
 * @Description: 非“HTSC CRM系统需求审核员” 反馈详情 页面
 * @Author: 张俊丽
 * @Date: 2018-06-5 14:49:16
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import moment from 'moment';
import _ from 'lodash';

import LabelInfo from '../taskList/common/LabelInfo';
import InfoArea from './FlexibleInfoArea';
import RemarkList from './RemarkList';
import Icon from '../common/Icon';
import styles from './feedbackDetail.less';

function FeedbackDetail(props) {
  const {
    processList,
    feedbackDetail,
    resolveQuestion,
    handleScreenshot,
    showQuestionModal,
  } = props;
  const {
    status = '',
    feedId = '--',
    createTime = '--',
    description = '--',
    feedbackFileUrls = [],
  } = feedbackDetail || {};

  function renderScreenshot(imgUrl) {
    return (
      <div
        className={styles.screenshot}
        onClick={() => { handleScreenshot(imgUrl); }}
      >
        <a><Icon type={'kehu1'} /> 查看</a>
      </div>
    );
  }

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
        value: renderScreenshot(imageUrl),
      },
    ];
  }

  return (
    <div className={styles.detailContainer}>
      <div className={styles.headLine}>{`问题编号${feedId}`}</div>
      <LabelInfo value={'问题详情'} wrapperClass={styles.infoTitle} />
      <InfoArea
        data={detailInfo}
        columnWrapperClass={styles.columnContainer}
        contentWrapperClass={styles.contentContainer}
      />
      <LabelInfo value={'问题答复'} wrapperClass={styles.infoTitle} />
      <RemarkList
        category={'user'}
        wrapperClass={'remarkQuestion'}
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
              type={'primary'}
              className={styles.btn}
              onClick={resolveQuestion}
            >已解决</Button>
          </div>
        )
      }
    </div>
  );
}

FeedbackDetail.propTypes = {
  processList: PropTypes.array.isRequired,
  feedbackDetail: PropTypes.object.isRequired,
  showQuestionModal: PropTypes.func.isRequired,
  resolveQuestion: PropTypes.func.isRequired,
  handleScreenshot: PropTypes.func.isRequired,
};

export default FeedbackDetail;

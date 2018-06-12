/*
 * @Description:  我的反馈详情
 * @Author: 张俊丽
 * @Date: 2018-06-5 14:49:16
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { Button } from 'antd';
import moment from 'moment';
import _ from 'lodash';

import Field from './Field';
import PreviewImg from './PreviewImg';
import LabelInfo from '../taskList/common/LabelInfo';
import { request } from '../../config';
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
  }

  @autobind
  renderColumn(data) {
    const { attachModelList = [] } = data;
    const hasAttachment = !_.isEmpty(attachModelList);
    // 当前行记录
    return (
      <div
        className={styles.item}
        key={data.id}
      >
        <div className={styles.info}>
          <span>{data.title}</span>
        </div>
        <pre className={styles.txt}>
          {data.description}
        </pre>
        {
          hasAttachment ? (
            <div className={styles.attachContainer}>
              {this.renderAttachmentList(attachModelList)}
            </div>
          ) : null
        }
      </div>
    );
  }

  renderAttachmentList(list) {
    return (
      _.map(
        list,
        item => (
          <div
            className={styles.attachItem}
            key={item.attachUrl}
          >
            <a href={`${request.prefix}/file/${item.attachUrl}`}>
              <Icon type={'fujian2'} />{`${item.attachName}`}
            </a>
          </div>
        ),
      )
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
    const date = _.isEmpty(createTime) ? '--' : moment(createTime).format('YYYY-MM-DD hh:mm');

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
          value: <PreviewImg icon="pic" previewUrl={`/file/${imageUrl}`} />,
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
            renderColumn={this.renderColumn}
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
                  className={classnames(styles.btn, styles.btnPrimary)}
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

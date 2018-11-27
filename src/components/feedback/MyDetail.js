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

import { emp } from '../../helper';
import { feedbackOptions } from '../../config';
import Field from './Field';
import PreviewImg from './PreviewImg';
import LabelInfo from '../taskList/common/LabelInfo';
import { request } from '../../config';
import RemarkList from './RemarkList';
import Icon from '../common/Icon';
import styles from './myDetail.less';

// 用户评价满意度字典
const USER_COMMENT_LIST = feedbackOptions.userDegreeOfSatisfaction;
// 不能写成无状态组件，因为容器组件要求能访问ref
export default class MyDetail extends PureComponent {
  static propTypes = {
    processList: PropTypes.array.isRequired,
    feedbackDetail: PropTypes.object.isRequired,
    showQuestionModal: PropTypes.func.isRequired,
    resolveQuestion: PropTypes.func.isRequired,
    addFeedbackEvaluation: PropTypes.func.isRequired,
  }
  
  constructor(props) {
    super(props);
    this.state = {
      evaluationStatus: props.feedbackDetail.evaluation,
      preFeedbackDetail: props.feedbackDetail,
    };
  }

  // 点击每一个反馈都会更新里面的值
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.feedbackDetail !== prevState.preFeedbackDetail) {
      return {
        evaluationStatus: nextProps.feedbackDetail.evaluation,
        preFeedbackDetail: nextProps.feedbackDetail,
      };
    }
    return null;
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

  // 选择满意度按钮点击事件
  @autobind
  handleFeedbackChange(evaluation) {
    const empId = emp.getId();
    const {
      addFeedbackEvaluation,
      feedbackDetail: {
        id
      },
    } = this.props;
    const payload = {
      empId,
      id,
      evaluation,
    };
    // 根据事件去改变用户满意度
    addFeedbackEvaluation(payload).then(() => {
      this.setState({
        evaluationStatus: evaluation,
      });
    });
  }

  renderAttachmentList(list) {
    // recordId 不是唯一的，所以加上index
    return (
      _.map(
        list,
        (item, index) => (
          <div
            className={styles.attachItem}
            key={`${index}_${item.recordId}`}
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
      createTime = '',
      description = '--',
      feedbackFileUrls = [],
    } = feedbackDetail || {};

    const { evaluationStatus } = this.state;
    const isStatusEmpty = _.isEmpty(status);
    const statusInfo = status === 'PROCESSING' ? '解决中' : '关闭';
    const imageUrl = _.head(feedbackFileUrls) || '';
    const date = _.isEmpty(createTime) ? '--' : moment(createTime).format('YYYY-MM-DD HH:mm');
    // 根据后台返回的字段来显示对应的满意度
    const userCommentLabelList = USER_COMMENT_LIST.filter(item => item.value === evaluationStatus);

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
          value: <PreviewImg
            icon="pic"
            label="点击查看"
            previewUrl={`/file/${imageUrl}`}
          />,
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
          }{
            // 如果反馈关闭了就显示满意度调查
            status === 'CLOSED' ?
              (
                <div className={styles.myFeedBackEvaluation}>满意度调查
               {
                    // 如果评价了就显示评价 没评价就显示满意度评价按钮
                    evaluationStatus ?
                        <div className={styles.feedbackInfo}>
                          我对本次答复的评价:
                          <span>
                            {`${userCommentLabelList[0].label}`}
                          </span>
                        </div>
                      :
                        <div className={styles.feedbackBox}>
                          <div className={styles.feedbackTitle}>您对本次反馈的答复是否满意?</div>
                          <Button type="primary" size="large"
                            onClick={() => this.handleFeedbackChange('SATISFIED')}
                          >
                            满意
                          </Button>
                          <Button size="large"
                            onClick={() => this.handleFeedbackChange('COMMON')}
                          >
                            一般
                          </Button>
                          <Button size="large"
                            onClick={() => this.handleFeedbackChange('DISCONTENT')}
                          >
                            不满意
                          </Button>
                        </div>
                  }
                </div>
              )
              : null
          }
        </div>
      </div>
    );
  }
}

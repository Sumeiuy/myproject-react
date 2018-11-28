/*
 * @Author: zhufeiyang
 * @Date: 2018-11-19 11:11:19
 * @Last Modified by: zhufeiyang
 * @Last Modified time: 2018-11-22 16:14:50
 * @description 新版360服务记录-服务内容-服务记录条目
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { Tooltip } from 'antd';
import { autobind } from 'core-decorators';
import styles from './serviceRecordItem.less';
import { request } from '../../config';
import Icon from '../common/Icon';
import { emp, getIconType } from '../../helper';
import logable from '../../decorators/logable';
import ForgeryRichText from '../common/ForgeryRichText';
import IfWrap from '../common/biz/IfWrap';

const EMPTY_OBJECT = {};
const NO_EMAIL_HREF = 'javascript:void(0);'; // eslint-disable-line

/**
 * 判断是否是空或者字符串null
 * @param {*string} content 内容
 */
function isNullOrNullString(content) {
  return _.isEmpty(content) || content === 'null';
}

export default class ServiceRecordItem extends PureComponent {
  static propTypes = {
    content: PropTypes.string,
    title: PropTypes.string,
    executeTypes: PropTypes.array,
    isHaveFileList: PropTypes.bool,
    filesList: PropTypes.array,
    isNeedTooltip: PropTypes.bool,
    feedbackStatus: PropTypes.node,
  }

  static defaultProps = {
    content: '--',
    title: '--',
    executeTypes: [],
    isHaveFileList: false,
    isNeedTooltip: false,
    filesList: [],
    feedbackStatus: null,
  }

  getShouldRenderItem(content) {
    const { isHaveFileList, filesList, feedbackStatus } = this.props;
    // 如果传了feedbackStatus
    if (!_.isEmpty(feedbackStatus)) {
      return true;
    }
    // 附件
    if (isHaveFileList) {
      return !_.isEmpty(filesList);
    }
    return !isNullOrNullString(content);
  }

  // 空方法，用于日志上传
  @logable({ type: 'Click', payload: { name: '下载' } })
  handleDownloadClick() {}

  renderIcon(value) {
    const renderSpan = _.map(value, (item, index) => {
      const type = getIconType(item.name);
      return (
        <span title={item.name}  key={index}>
          <Icon
            type={type}
            className={classnames({
              [styles[type]]: true,
            })}
          />
          <a
            className={styles.seeCust}
            ref={ref => this.sendEmail = ref}
            onClick={this.handleDownloadClick}
            href={_.isEmpty(item.attachId) && _.isEmpty(item.name) ? NO_EMAIL_HREF :
              `${request.prefix}/file/ceFileDownload2?attachId=${item.attachId}&empId=${emp.getId()}&filename=${item.name}`}
          >{item.name}</a>
        </span>
      );
    });
    return renderSpan;
  }

  @autobind
  renderZLContent(feedbackStatus) {
    let statusKey = feedbackStatus;
    if (_.isNull(feedbackStatus)) {
      statusKey = 'NULL';
    }
    const { content } = this.props;
    const feedbackMap = {
      UNREAD: '客户未阅',
      READED: '已阅未反馈',
      FEEDBACK: content,
      NULL: '',
    };
    return feedbackMap[statusKey];
  }

  /**
   * 渲染字符串
   * @param {*string} content 内容
   */
  renderContentString(content) {
    const { feedbackStatus, title } = this.props;
    if (title === '客户反馈') {
      if (!_.isEmpty(feedbackStatus)) {
        // 如果是feedbackStatus不为空，则表示是涨乐财富通服务方式，
        // 因为只有涨乐财富通才有feedbackStatus
        return this.renderZLContent(feedbackStatus);
      }
    }
    // 显示的时间格式进行转换
    // 2018/07/16-2018/11/16  => 2018-07-16 ~ 2018-11-16
    if(title === '处理期限') {
      let newContent = content.replace('-', '~').replace(/\//g, '-').split('~');
      return `${newContent[0]} ~ ${newContent[1]}`;
    }

    if(title === '反馈时间') {
      return content.replace(/\//g, '-');
    }
    return content;
  }

  renderContent(content) {
    const { isNeedTooltip } = this.props;
    const newContent = this.renderContentString(content || '');
    if (!isNeedTooltip) {
      return (
        <span title={newContent}>
          {newContent}
        </span>
      );
    }

    const title = () => (
      <div>
        <ForgeryRichText text={newContent} />
      </div>
    );

    return (
      <Tooltip
        title={title}
        overlayClassName={classnames({
          [styles.globalTips]: true,
        })}
      >
        <span>{newContent}</span>
      </Tooltip>
    );
  }

  render() {
    const {
      title,
      content,
      executeTypes,
      isHaveFileList,
      filesList,
    } = this.props;

    let newContent = content;
    if (!_.isEmpty(executeTypes)) {
      // 当前为执行方式
      // [{key: "Chance", value: "选做"},
      // {key: "Mission", value: "必做"}]
      newContent = _.find(executeTypes, item => item.key === content) || EMPTY_OBJECT;
      newContent = newContent.value;
    }

    // 是否可以渲染该item
    const isShouleRender = this.getShouldRenderItem(newContent);

    return (
      <IfWrap isRender={isShouleRender}>
        <div className={styles.serviceItem}>
          <span className={styles.serviceTitle}>
            {title}<span className={styles.serviceDivide}>:</span>
          </span>
          {
            isHaveFileList ?
              <div className={styles.iconsWords}>{this.renderIcon(filesList)}</div>
              :
              this.renderContent(newContent)
          }
        </div>
      </IfWrap>
    );
  }
}

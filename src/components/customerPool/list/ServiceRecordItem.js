import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { Tooltip } from 'antd';
import { autobind } from 'core-decorators';
import Icon from '../../common/Icon';
import styles from './createCollapse.less';
import { request } from '../../../config';
import { emp, getIconType } from '../../../helper';
import logable from '../../../decorators/logable';
import ForgeryRichText from '../../common/ForgeryRichText';

const EMPTY_OBJECT = {};
const NO_EMAIL_HREF = 'javascript:void(0);'; // eslint-disable-line

export default class ServiceRecordItem extends PureComponent {
  static propTypes = {
    content: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    executeTypes: PropTypes.array,
    isShowChild: PropTypes.bool,
    filesList: PropTypes.array,
    panelContent: PropTypes.bool,
    feedbackStatus: PropTypes.node,
  }
  static defaultProps = {
    content: '--',
    title: '--',
    type: 'left',
    executeTypes: [],
    isShowChild: false,
    panelContent: false,
    filesList: [],
    feedbackStatus: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      filesListData: [],
    };
  }

  // 空方法，用于日志上传
  @logable({ type: 'Click', payload: { name: '下载' } })
  handleDownloadClick() { }

  /**
   * 判断是否是空或者字符串null
   * @param {*string} content 内容
   */
  isNullOrNullString(content) {
    return _.isEmpty(content) || content === 'null';
  }

  renderIcon(value) {
    const renderSpan = _.map(value, (item, index) => {
      const type = getIconType(item.name);
      return (
        <span title={item.name} className={styles.iconsWords} key={index}>
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
    const { feedbackStatus } = this.props;
    if (!_.isEmpty(feedbackStatus)) {
      // 如果是feedbackStatus不为空，则表示是涨乐财富通服务方式，
      // 因为只有涨乐财富通才有feedbackStatus
      return this.renderZLContent(feedbackStatus);
    }
    if (this.isNullOrNullString(content)) {
      return '--';
    }
    return content;
  }

  renderContent(content) {
    const { panelContent } = this.props;
    const newContent = this.renderContentString(content);
    if (!panelContent) {
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
    const { title, type, content, executeTypes, isShowChild, filesList } = this.props;
    let newContent = content;
    if (!_.isEmpty(executeTypes)) {
      // 当前为执行方式
      // [{key: "Chance", value: "选做"},
      // {key: "Mission", value: "必做"}]
      newContent = _.find(executeTypes, item => item.key === content) || EMPTY_OBJECT;
      newContent = newContent.value;
    }
    return (
      <div
        className={classnames({
          [styles.leftModule]: type === 'left',
          [styles.rightModule]: type === 'right',
        })}
      >
        <span>{title || '--'}</span>
        {
          isShowChild ?
            <div className={styles.iconsWords}>{this.renderIcon(filesList)}</div>
            :
            this.renderContent(newContent)
        }

      </div>
    );
  }
}

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import Icon from '../../common/Icon';
import styles from './createCollapse.less';
import { request } from '../../../config';
import { emp } from '../../../helper';

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
  }
  static defaultProps = {
    content: '--',
    title: '--',
    type: 'left',
    executeTypes: [],
    isShowChild: false,
    filesList: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      filesListData: [],
    };
  }

  renderIconType(name) {
    const fullName = name.split('.');
    const suffix = fullName[fullName.length - 1];
    let iconType = '';

    switch (true) {
      case /jpg|jpeg|png/.test(suffix):
        iconType = 'tupian-';
        break;
      case /docx?/.test(suffix):
        iconType = 'word';
        break;
      case /xlsx?/.test(suffix):
        iconType = 'excel2';
        break;
      case /pptx?/.test(suffix):
        iconType = 'ppt';
        break;
      case /mp3|wav/.test(suffix):
        iconType = 'yinpinwenjian';
        break;
      case /mov|mp4|avi|3gp|wmv/.test(suffix):
        iconType = 'shipinwenjian';
        break;
      case /txt/.test(suffix):
        iconType = 'txt';
        break;
      case /csv/.test(suffix):
        iconType = 'CSV';
        break;
      default:
        iconType = 'qitawenjian';
    }
    return iconType;
  }


  renderIcon(value) {
    const renderSpan = _.map(value, (item, index) => {
      const type = this.renderIconType(item.name);
      return (
        <span title={item.name} className={styles.iconsWords} key={index}>
          <Icon
            type={this.renderIconType(item.name)}
            className={classnames({
              [styles[type]]: true,
            })}
          />
          <a
            className={styles.seeCust}
            ref={ref => this.sendEmail = ref}
            href={_.isEmpty(item.attachId) && _.isEmpty(item.name) ? NO_EMAIL_HREF :
              `${request.prefix}/file/ceFileDownload?attachId=${item.attachId}&empId=${emp.getId()}&filename=${item.name}`}
          >{item.name}</a>
        </span>
      );
    });
    return renderSpan;
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
            <span title={newContent}>{newContent || '--'}</span>
        }

      </div>
    );
  }
}

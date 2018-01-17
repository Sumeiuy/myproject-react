import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import Icon from '../../common/Icon';
import styles from './createCollapse.less';
import { request } from '../../../config';
import { emp, getIconType } from '../../../helper';

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

import React, { PropTypes } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import styles from './createCollapse.less';

const EMPTY_OBJECT = {};

export default function ServiceRecordItem(props) {
  const { title, type, content, executeTypes } = props;
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
      <span>{newContent || '--'}</span>
    </div>
  );
}

ServiceRecordItem.propTypes = {
  content: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
  executeTypes: PropTypes.array,
};

ServiceRecordItem.defaultProps = {
  content: '--',
  title: '--',
  type: 'left',
  executeTypes: [],
};

import React, { PropTypes } from 'react';
import classnames from 'classnames';

export default function ServiceRecordItem(props) {
  const { content, styles, title, type } = props;
  return (
    <div
      className={classnames({
        [styles.leftModule]: type === 'left',
        [styles.rightModule]: type === 'right',
      })}
    >
      <span>{title}</span>
      <span>{content}</span>
    </div>
  );
}

ServiceRecordItem.propTypes = {
  content: PropTypes.string,
  styles: PropTypes.object,
  title: PropTypes.string,
  type: PropTypes.string,
};

ServiceRecordItem.defaultProps = {
  content: '--',
  styles: {},
  title: '--',
  type: 'left',
};

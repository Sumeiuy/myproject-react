/**
 * @author zhangjunli
 * @description 信息展示区域
 */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import LabelInfo from '../taskList/common/LabelInfo';
import styles from './field.less';

function Field(props) {
  const {
    data,
    headLine,
    columnClass,
    contentClass,
  } = props;

  function renderItem(list) {
    return (
      _.map(
        list,
        item => (
          <div
            className={classnames(
              styles.column,
              { [columnClass]: !!columnClass },
            )}
            key={item.id}
          >
            <div
              className={classnames(
                styles.infoKey,
                { [styles.keyNone]: _.isEmpty(item.key) },
              )}
            >
              {/* 可以不显示 key */}
              {item.key}
            </div>
            <div className={styles.infoValue}>
              {/* 可以时任意类型，如 element */}
              {item.value}
            </div>
          </div>
        ),
      )
    );
  }

  /* 可以不显示 区域的标题 */
  if (_.isEmpty(headLine)) {
    return (
      <div
        className={classnames(
          styles.basicInfoContent,
          { [contentClass]: !!contentClass },
        )}
      >
        {renderItem(data)}
      </div>
    );
  }

  return (
    <div className={styles.basicInfo}>
      <LabelInfo value={headLine} />
      <div className={styles.basicInfoContent}>
        {renderItem(data)}
      </div>
    </div>
  );
}

Field.defaultProps = {
  headLine: '',
  columnClass: '',
  contentClass: '',
};

Field.propTypes = {
  headLine: PropTypes.string,
  data: PropTypes.array.isRequired,
  contentClass: PropTypes.string,
  columnClass: PropTypes.string,
};

export default Field;

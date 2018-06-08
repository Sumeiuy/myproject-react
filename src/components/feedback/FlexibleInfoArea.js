/**
 * @author zhangjunli
 * @description 灵活的信息区域
 */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import LabelInfo from '../taskList/common/LabelInfo';
import styles from './flexibleInfoArea.less';

function FlexibleInfoArea(props) {
  const {
    data,
    headLine,
    columnWrapperClass,
    contentWrapperClass,
  } = props;

  function renderItem(list) {
    return (
      _.map(
        list,
        item => (
          <div
            className={classnames(
              styles.coloumn,
              { [columnWrapperClass]: !!columnWrapperClass },
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
          { [contentWrapperClass]: !!contentWrapperClass },
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

FlexibleInfoArea.defaultProps = {
  headLine: '',
  columnWrapperClass: '',
  contentWrapperClass: '',
};

FlexibleInfoArea.propTypes = {
  headLine: PropTypes.string,
  data: PropTypes.array.isRequired,
  contentWrapperClass: PropTypes.string,
  columnWrapperClass: PropTypes.string,
};

export default FlexibleInfoArea;

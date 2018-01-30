/**
 * @fileOverview components/customerPool/InfoArea.js
 * @author zhangjunli
 * @description 执行者视图右侧详情的基本信息
 */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import LabelInfo from '../common/LabelInfo';
import styles from './infoArea.less';

function InfoArea(props) {
  const { data, headLine } = props;

  return (
    <div className={styles.basicInfo}>
      <LabelInfo value={headLine} />
      <div className={styles.basicInfoContent}>
        {
          _.map(
            data,
            item => (
              <div className={styles.coloumn} key={item.id}>
                <div
                  className={classnames(
                    styles.infoKey,
                    { [styles.keyNone]: _.isEmpty(item.key) },
                  )}
                >{item.key}</div>
                <div className={styles.infoValue}>{item.value}</div>
              </div>
            ),
          )
        }
      </div>
    </div>
  );
}

InfoArea.propTypes = {
  data: PropTypes.array.isRequired,
  headLine: PropTypes.string.isRequired,
};

export default InfoArea;

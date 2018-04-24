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
            (item) => {
              const isPoliceOrTip = item.id === 'policy' || item.id === 'tip';
              return (
                <div
                  className={styles.coloumn}
                  key={item.id}
                  style={isPoliceOrTip ? { width: '100%' } : {}}
                >
                  <div
                    className={classnames(
                      styles.infoKey,
                      { [styles.keyNone]: _.isEmpty(item.key) },
                    )}
                  >{item.key}</div>
                  <div className={styles.infoValue}>
                    {
                      // policy or tip 是 服务策略 和 任务提示项设置的ID
                      isPoliceOrTip ?
                        <div
                          style={{ width: '100%' }}
                          dangerouslySetInnerHTML={{ __html: item.value || '--' }}
                        /> :
                        item.value
                    }
                  </div>
                </div>
              );
            },
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

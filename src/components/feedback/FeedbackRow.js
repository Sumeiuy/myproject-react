/*
 * @Description: 非“HTSC CRM系统需求审核员” 反馈列表 页面
 * @Author: 张俊丽
 * @Date: 2018-06-5 14:49:16
 */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classnames from 'classnames';
import _ from 'lodash';

import Icon from '../common/Icon';
import styles from './feedbackRow.less';

function FeedbackRow(props) {
  const {
    data,
    index,
    active,
    onClick,
    iconType,
  } = props;
  const {
    description = '--',
    createTime = '--',
    status = '',
    feedId = '--',
  } = data || {};

  const date = moment(createTime).format('YYYY-MM-DD');
  const isStatusEmpty = _.isEmpty(status);
  const statusInfo = status === 'PROCESSING' ? '解决中' : '关闭';
  const activeClass = { [styles.active]: active };

  function handleClick() {
    return onClick(data, index);
  }

  return (
    <div className={classnames(styles.container, activeClass)} onClick={handleClick}>
      <div className={classnames(styles.topContainer, activeClass)}>
        <div className={styles.leftContiner}>
          <div className={styles.icon}>
            <Icon type={iconType} />
          </div>
          <div className={styles.id}>
            {`编号${feedId}`}
          </div>
        </div>
        <div
          className={classnames(
            styles.status,
            {
              [styles.none]: isStatusEmpty,
              [styles.close]: status === 'CLOSED',
            },
          )}
        >
          {statusInfo}
        </div>
      </div>
      <div className={classnames(styles.bottomContainer, activeClass)}>
        <div className={styles.desc}>{description}</div>
        <div className={styles.time}>{date}</div>
      </div>
    </div>
  );
}

FeedbackRow.propTypes = {
  data: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  iconType: PropTypes.string.isRequired,
};

export default FeedbackRow;

/**
 * @Description: 首页导航
 * @Author: Liujianshu-K0240007
 * @Date: 2018-09-20 13:45:27
 * @Last Modified by: Liujianshu-K0240007
 * @Last Modified time: 2018-11-01 14:57:57
 */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Tooltip from '../common/Tooltip';
import { getFilter } from '../customerPool/helper';
import { openRctTab } from '../../utils';
import { url as urlHelper, number } from '../../helper';
import { logCommon } from '../../decorators/logable';
import styles from './nav.less';

export default function Nav(props) {
  const { data, list, location: { query } } = props;
  const renderList = list.map(item => {
    const { name, key, url, id, title } = item;
    let payload = {};
    const iconClass = classnames({
      [styles.icon]: true,
      [styles[key]]: true,
    });
    switch (key) {
      // 待处理任务
      case 'todayToDoNumbers':
        payload = {
          data: {
            missionViewType: 'executor',
          },
        };
        break;
      // 潜在目标客户
      case 'businessNumbers':
        const data = {
          source: 'business',
          bizFlag: 'biz',
        };
        const filters = getFilter(data);
        payload = {
          data: {
            ...data,
            filters,
          },
          state: {
            ...query,
            filters,
          },
        };
        break;
      default:
        break;
    }
    payload = {
      ...payload,
      url,
      id,
      title,
      name,
    };
    const value = number.formatToUnit({
      num: data[key],
      isThousandFormat: true,
      isRound: false,
    });
    return (
      <dl key={key} onClick={() => handleOpenTab(payload)}>
        <dt className={iconClass}></dt>
        <dd className={styles.value}>
          <Tooltip placement="bottom" title={data[key] || 0}>
            {value}
          </Tooltip>
        </dd>
        <dd className={styles.name}>{name}</dd>
      </dl>
    );
  });

  // 发送日志
  const sendLog = (data) => {
    const { title = '', name = '' } = data;
    logCommon({
      type: '$pageview',
      payload: {
        title: `打开${title}页面`,
        name,
      },
    });
  };

  // 打开弹窗事件
  const handleOpenTab = (payload) => {
    const { push, location: { query } } = props;
    const {
      url,
      id,
      name,
      title,
      data = {},
      state = {...query},
    } = payload;
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id,
      title,
    };
    openRctTab({
      routerAction: push,
      url: `${url}?${urlHelper.stringify(data)}`,
      pathname: url,
      query: data,
      param,
      state,
    });
    sendLog({title, name});
  };

  return (
    <div className={styles.navWrapper}>
      {renderList}
    </div>
  );
}

Nav.propTypes = {
  push: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  data: PropTypes.object,
  list: PropTypes.array,
};

Nav.defaultProps = {
  data: {},
  list: [],
};

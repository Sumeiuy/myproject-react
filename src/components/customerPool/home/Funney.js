/**
 * @file components/customerPool/home/Funney.js
 * @author zhangjunli
 */
import React, { PropTypes } from 'react';
import _ from 'lodash';

import IECharts from '../../IECharts';
import styles from './funney.less';
import { fspGlobal } from '../../../utils';
import Clickable from '../../../components/common/Clickable';

// 服务客户数的 key
const SERVICE_CUST_NUM = 'custNum';

function getDataConfig(data) {
  return data.map(item => ({
    value: item.value,
    name: item.name,
    itemStyle: {
      normal: {
        color: item.bgColor,
      },
    },
  }));
}

function linkToList(data) {
  if (data.key !== SERVICE_CUST_NUM) {
    return;
  }
  fspGlobal.openFspTab({
    url: '/customer/manage/showCustManageTabWin',
    param: {
      id: 'FSP_CUST_TAB_CENTER_MANAGE',
      title: '客户管理',
      forceRefresh: true,
    },
  });
}

function renderIntro(data) {
  return _.map(
    data,
    (item, index) => (
      <div className={styles.row} key={`row${index}`}>
        <Clickable
          onClick={() => linkToList(item)}
          eventName="/click/fuuney"
          payload={{ test: 'linkToList' }}
        >
          <div className={`${item.key === SERVICE_CUST_NUM ? styles.canClick : ''} ${styles.count1}`}>
            {item.value}
          </div>
        </Clickable>
        <div className={styles.count2}>{`/${item.property}`}</div>
      </div>
    ),
  );
}

function Funney({ dataSource }) {
  const { data, color, propertyUnit } = dataSource;
  const funnelOption = {
    series: [
      {
        name: '漏斗图',
        type: 'funnel',
        left: 0,
        top: 0,
        bottom: 0,
        width: '100%',
        min: _.last(data).value,
        max: _.head(data).value,
        minSize: '20%',
        maxSize: '100%',
        sort: 'none',
        label: {
          normal: {
            show: true,
            position: 'inside',
            fontSize: 12,
            color,
          },
        },
        itemStyle: {
          normal: {
            borderWidth: 0,
          },
        },
        data: getDataConfig(data),
      },
    ],
  };

  const onReady = (instance) => {
    instance.on('click', (arg) => {
      if (arg.componentType !== 'series') {
        return;
      }
      // 点击'服务客户数'时，跳转到 客户中心 > 客户管理 页面
      if (arg.name === '服务客户数') {
        fspGlobal.openFspTab({
          url: '/customer/manage/showCustManageTabWin',
          param: {
            id: 'FSP_CUST_TAB_CENTER_MANAGE',
            title: '客户管理',
            forceRefresh: true,
          },
        });
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.uintRow}>{`户数/资产(${propertyUnit})`}</div>
      <div className={styles.content}>
        <div className={styles.left}>
          <IECharts
            onReady={onReady}
            option={funnelOption}
            resizable
            style={{
              height: '102px',
            }}
          />
        </div>
        <div className={styles.right}>
          {renderIntro(data)}
        </div>
      </div>
    </div>
  );
}

Funney.propTypes = {
  dataSource: PropTypes.object.isRequired,
};

export default Funney;

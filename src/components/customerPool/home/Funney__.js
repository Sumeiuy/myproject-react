/**
 * @file components/customerPool/home/Funney.js
 * @author zhangjunli
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Popover } from 'antd';


import { linkTo } from './homeIndicators_';
import { homeModelType } from '../config';
import IECharts from '../../IECharts';
import { logCommon } from '../../../decorators/logable';
import antdStyles from '../../../css/antd.less';
import styles from './funney.less';
// 客户与资产模块的source
const SOURCE_CUST_ASSETS = 'custAssets';

function getDataConfig(data) {
  return data.map(item => ({
    value: item.value,
    name: item.name,
    key: item.key,
    itemStyle: {
      normal: {
        color: item.bgColor,
      },
    },
  }));
}


function Funney({ dataSource, push, cycle, location }, { empInfo }) {
  const { data, color } = dataSource;
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
      const { data: { key = '', name = '' } } = arg;
      const modalTypeList = homeModelType[SOURCE_CUST_ASSETS];
      const { key: modalType } = _.find(modalTypeList, item => item.id === key) || {};
      let params = {
        source: SOURCE_CUST_ASSETS,
        type: modalType,
        push,
        cycle,
        location,
      };
      // 如果是服务经理模块，则下钻客户列表后服务经理默认为当前登录客户
      const { empNum, empName } = empInfo.empInfo;
      if (!modalType) {
        params = {
          ...params,
          ptyMngId: empNum,
          ptyMngName: empName,
        };
      }
      linkTo(params);
      // 手动上传日志
      logCommon({
        type: 'DrillDown',
        payload: {
          name: '客户及资产',
          subtype: name,
          value: '',
        },
      });
    });
  };

  function handleIntroClick(item) {
    const { key, name } = item;
    const modalTypeList = homeModelType[SOURCE_CUST_ASSETS];
    const { key: modalType } = _.find(modalTypeList, item => item.id === key) || {};
    let params = {
      source: SOURCE_CUST_ASSETS,
      type: modalType,
      push,
      cycle,
      location,
    };
    // 如果是服务经理模块，则下钻客户列表后服务经理默认为当前登录客户
    const { empNum, empName } = empInfo.empInfo;
    if (!modalType) {
      params = {
        ...params,
        ptyMngId: empNum,
        ptyMngName: empName,
      };
    }
    linkTo(params);
    // 手动上传日志 客户及资产
    logCommon({
      type: 'DrillDown',
      payload: {
        name: '客户及资产',
        subtype: name,
        value: item.value,
      },
    });
  }

  function renderIntro(data) {
    return _.map(
      data,
      (item, index) => (
        <div
          className={styles.row}
          key={`row${index}`}
          onClick={() => handleIntroClick(item)}
        >
          <div className={styles.count1}>
            <Popover
              title={`${item.value}`}
              content={item.description}
              placement="bottom"
              mouseEnterDelay={0.2}
              overlayStyle={{ maxWidth: '320px' }}
              overlayClassName={antdStyles.popoverClass}
            >
              {item.value}
            </Popover>
          </div>
          <div className={styles.count2}>
            <Popover
              title={`${item.property}${item.unit}`}
              content={item.propertyDesc}
              placement="bottom"
              mouseEnterDelay={0.2}
              overlayStyle={{ maxWidth: '320px' }}
              overlayClassName={antdStyles.popoverClass}
            >
              <span className={styles.properyValue}>{`/ ${item.property}`}</span>
              <span className={styles.unit}>{item.unit}</span>
            </Popover>
          </div>
        </div>
      ),
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.uintRow}>
        <div />
        <div>{'户数/资产'}</div>
      </div>
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
          {renderIntro(data, push)}
        </div>
      </div>
    </div>
  );
}

Funney.propTypes = {
  dataSource: PropTypes.object.isRequired,
  push: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  cycle: PropTypes.array.isRequired,
};

Funney.contextTypes = {
  empInfo: PropTypes.object,
};
export default Funney;

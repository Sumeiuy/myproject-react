import React from 'react';
import { Breadcrumb, Button } from 'antd';
import _ from 'lodash';
import { sessionStore } from '../../config';
import { logCommon } from '../../decorators/logable';
import { linkTo } from '../../utils';
import styles from './breadcrumb.less';

function setJspTabCache(param) {
  const originTabs = window.$('#UTB').data('tabs') || [];
  let newTabs = originTabs;
  // 是否已经打开
  const isAlreadyOpen = _.find(originTabs, tab => tab.id === param.id);
  if (isAlreadyOpen) {
    newTabs = _.map(originTabs, (tab) => {
      if (tab.id === param.id) {
        return {
          ...tab,
          ...param,
        };
      }
      return tab;
    });
  } else { // 如果没有新打开，则加入tab缓存
    newTabs = [
      ...newTabs,
      { ...param },
    ];
  }
  window.$('#UTB').data('tabs', newTabs);
}

export default function CustDetailBreadcrumb(props) {
  // 本地缓存state
  const state = _.isEmpty(props.state) ? sessionStore.get('jspState') : props.state;
  if (state && state.url) {
    sessionStore.set('jspState', state);
  }
  const url = (state && state.backPath) || '/customerPool/list?source=leftMenu';
  // 点击面包屑回到客户列表
  function handleItemClick() {
    logCommon({
      type: 'NavClick',
      payload: {
        name: '面包屑',
        value: url,
      },
    });
    props.push(url);
  }
  // 点击按钮切换到老板
  function handleBtnClick() {
    // 处理jsp页面的tab缓存问题
    setJspTabCache(state.param || {});
    props.push({
      pathname: '/fsp/customerPool/list/customerDetail',
      state: {
        param: state.param,
        url: state.url,
        query: state.query,
      },
    });
    logCommon({
      type: 'NavClick',
      payload: {
        name: '客户360切换回旧版',
        value: state.url,
      },
    });
  }

  return (
    <div className={styles.breadcrumbContiner}>
      <Breadcrumb className={styles.breadcrumb}>
        <Breadcrumb.Item>
          <span className={styles.link} onClick={handleItemClick}>客户管理</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item><span className={styles.text}>客户360</span></Breadcrumb.Item>
      </Breadcrumb>
      <div className={styles.actionBtn}>
        <Button ghost type="primary" onClick={handleBtnClick}>
          切回旧版
        </Button>
      </div>
    </div>
  );
}

/**
 * @Description: 首席观点和组合推荐
 * @Author: Liujianshu
 * @Date: 2018-09-11 15:47:01
 * @Last Modified by: Liujianshu-K0240007
 * @Last Modified time: 2018-09-21 15:05:47
 */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Tabs } from 'antd';
import _ from 'lodash';

import CommonCell from './CommonCell';
import { openRctTab } from '../../utils';
import { url as urlHelper } from '../../helper';
import styles from './viewAndCombination.less';

const TabPane = Tabs.TabPane;
export default function ViewAndCombination(props) {
  const { data } = props;

  // 切换标签
  const callback = (key) => {
    console.warn(key);
  };

  const openNewTab = (url, query, editPane) => {
    const param = { id: 'RTC_TAB_VIEWPOINT', title: '资讯' };
    const { push } = props;
    openRctTab({
      routerAction: push,
      url: `${url}?${urlHelper.stringify(query)}`,
      param,
      pathname: url,
      query,
      editPane,
    });
  };

  // @autobind
  // @logable({ type: 'Click', payload: { name: '详情' } })
  const handleDetailClick = (id) => {
    // 跳转到资讯详情界面
    openNewTab(
      '/latestView/viewpointDetail',
      { id },
      {
        name: '资讯详情',
        path: '/latestView/viewpointDetail',
      }
    );
  };

  if (_.isEmpty(data)) {
    return null;
  }
  const { view, combination = [], onValueClick } = data;

  const { infoVOList = [] } = view;
  // 展示第一个新闻
  const {
    texttitle = '',
    abstract = '',
    idlist: firstNewsId,
  } = _.head(infoVOList) || {};
  // : 为中文符号，英文的：不匹配
  const titleArray = _.split(texttitle, '：');
  const newTitle = _.last(titleArray) || '暂无标题';
  // 分割成段，展示，过滤掉非p标签，因为自带样式不符合需求
  const isEmptyText = _.isEmpty(abstract);
  const newFormateAbstract = isEmptyText
  ? ('<p>暂无内容</p>')
  : (
      abstract.replace(
        /<(\/?)([^\s>]+)[^>]*?>/g,
        (all, isEnd, tagName) => {
          if (_.includes(['p', 'pre'], tagName)) {
            return _.isEmpty(isEnd) ? '<p>' : '</p>';
          }
          return '';
        },
      )
    );
  // ↵ 是个符号，可以直接写，过滤掉。写 \n 过滤不掉 ↵ 符号
  const formateAbstract = newFormateAbstract.replace('↵', '');
  const linkClass = classnames({
    [styles.link]: true,
    [styles.displayNone]: isEmptyText,
  });

  const handlePercentChange = (value) => {
    let newValue = value;
    if (value > 0) {
      newValue = `+${newValue}`;
    }
    return newValue;
  };

  const newData = !_.isEmpty(combination) && combination.map(item => ({
    ...item,
    value: handlePercentChange(Number(item.value).toFixed(2)),
  }));
  // 推荐组合 props
  const combinationProps = {
    isNeedTitle: false,
    data: newData,
    onValueClick,
  };

  return (
    <div className={styles.viewAndCombination}>
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="首席观点" key="1">
          <div className={styles.view}>
            <h2 className={styles.title} title={newTitle}>{newTitle}</h2>
            <div
              className={styles.text}
              dangerouslySetInnerHTML={{ __html: formateAbstract }}
            />
            <a className={linkClass} onClick={() => handleDetailClick(firstNewsId)}>[详情]</a>
          </div>
        </TabPane>
        <TabPane tab="组合推荐" key="2">
          <h2 className={styles.combinationTitle}><span>近30天收益率</span>组合名称</h2>
          <CommonCell {...combinationProps} />
        </TabPane>
      </Tabs>
    </div>
  );
}

ViewAndCombination.propTypes = {
  push: PropTypes.func.isRequired,
  data: PropTypes.object,
};

ViewAndCombination.defaultProps = {
  data: {},
};

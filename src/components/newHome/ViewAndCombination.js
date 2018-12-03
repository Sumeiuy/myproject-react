/**
 * @Description: 首席观点和组合推荐
 * @Author: Liujianshu
 * @Date: 2018-09-11 15:47:01
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-10-30 19:58:23
 */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import CommonCell from './CommonCell';
import { logCommon } from '../../decorators/logable';
import { openRctTab } from '../../utils';
import { url as urlHelper } from '../../helper';
import styles from './viewAndCombination.less';

// 首页执行者视图首次引导提示第七步的dom的id名称(组合推荐)
const NEW_HOME_INTRO_SEVENTH_SEEP_IDNAME = 'homePageIntroSeventhStep';

export default function ViewAndCombination(props, context) {
  const { data } = props;
  const { replace } = context;

  // 标签列表
  const tabArray = [
    {
      name: '首席观点',
      key: 'sxgd',
    },
    {
      name: '组合推荐',
      key: 'zhtj',
    },
  ];

  const openNewTab = (url, query, editPane) => {
    const param = {
      id: 'RTC_TAB_VIEWPOINT',
      title: '资讯'
    };
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

  const handleDetailClick = (id) => {
    logCommon({
      type: 'ViewItem',
      payload: {
        title: '资讯详情页面',
        name: '首席观点详情',
        value: id
      },
    });
    // 跳转到资讯详情界面
    openNewTab(
      '/strategyCenter/latestView/viewpointDetail',
      { id },
      {
        name: '资讯详情',
        path: '/strategyCenter/latestView/viewpointDetail',
      }
    );
  };

  if (_.isEmpty(data)) {
    return null;
  }
  const { view, combination = [], onClick } = data;

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
    ? `<div class=${styles.noData}>暂无内容</div>`
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
    onClick,
    valueStyle: { color: '#e33c39' },
    unit: '%',
  };

  // tab 点击事件
  const handleTabClick = (item) => {
    const { location: { query } } = props;
    replace({
      query: {
        ...query,
        activeTab: item.key,
      }
    });
    logCommon({
      type: 'ButtonClick',
      payload: {
        name: '首席观点/组合推荐切换',
        value: item.name,
      },
    });
  };

  // 渲染 tab 标签
  const renderTab = () => {
    const { location: { query: { activeTab = tabArray[0].key } } } = props;
    const navArray = tabArray.map((item) => {
      const linkClass = classnames({
        [styles.active]: item.key === activeTab,
      });
      return (
        <div key={item.key} className={styles.item}>
          <a
            className={linkClass}
            onClick={() => handleTabClick(item)}
            id={item.name === '组合推荐'
              ? NEW_HOME_INTRO_SEVENTH_SEEP_IDNAME
              : null
          }
          >
            {item.name}
          </a>
        </div>
      );
    });
    return (
      <div className={styles.nav}>
        {navArray}
      </div>
    );
  };

  // 渲染 tab 内容
  const renderContent = () => {
    const { location: { query: { activeTab = tabArray[0].key } } } = props;
    let contentElement = null;
    switch (activeTab) {
      case tabArray[0].key:
        contentElement = (
          <div className={styles.view}>
            <h2 className={styles.title} title={newTitle}>{newTitle}</h2>
            <div
              className={styles.text}
              dangerouslySetInnerHTML={{ __html: formateAbstract }}
            />
            <a className={linkClass} onClick={() => handleDetailClick(firstNewsId)}>[详情]</a>
          </div>
        );
        break;
      case tabArray[1].key:
        contentElement = (
          <div className={styles.view}>
            <h2 className={styles.combinationTitle}>
              <span>近30天收益率</span>
组合名称
            </h2>
            <CommonCell {...combinationProps} />
          </div>
        );
        break;
      default:
        break;
    }
    return contentElement;
  };

  return (
    <div className={styles.viewAndCombination}>
      <div className={styles.tab}>
        {renderTab()}
        <div className={styles.content}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

ViewAndCombination.propTypes = {
  location: PropTypes.object.isRequired,
  push: PropTypes.func.isRequired,
  data: PropTypes.object,
};

ViewAndCombination.contextTypes = {
  replace: PropTypes.func.isRequired,
};

ViewAndCombination.defaultProps = {
  data: {},
};

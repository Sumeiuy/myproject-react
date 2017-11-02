/**
 * @file components/customerPool/home/Viewpoint.js
 *  首页投顾观点区域
 * @author zhangjunli
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';

import { fspContainer } from '../../../config';
import { fspGlobal, helper } from '../../../utils';
import styles from './viewpoint.less';

export default class Viewpoint extends PureComponent {
  static propTypes = {
    information: PropTypes.object,
    push: PropTypes.func.isRequired,
  }

  static defaultProps = {
    information: {},
  }

  @autobind
  openNewTab(url, query) {
    const param = { id: 'RTC_TAB_VIEWPOINT', title: '资讯' };
    if (document.querySelector(fspContainer.container)) {
      fspGlobal.openRctTab({ url: `${url}?${helper.queryToString(query)}`, param });
    } else {
      const { push } = this.props;
      push({
        pathname: url,
        query,
      });
    }
  }

  @autobind
  handleMoreClick() {
    // 跳转到资讯列表界面
    this.openNewTab('/customerPool/viewpointList');
  }

  @autobind
  handleDetailClick(index) {
    // 跳转到资讯详情界面
    this.openNewTab('/customerPool/viewpointDetail', { detailIndex: index });
  }

  @autobind
  renderContent(titleArray) {
    return titleArray.map((item, index) => (
      <div
        className={classnames(styles.row, { [styles.none]: (index >= 12) })}
        onClick={() => { this.handleDetailClick(index); }}
        key={item.id}
      >
        <a className={styles.news}>
          {_.isEmpty(item.subtitle) ? '--' : item.subtitle}
        </a>
      </div>
    ));
  }

  render() {
    const { information: { infoVOList = [] } } = this.props;
    // 展示第一个新闻
    const { texttitle = '', abstract = '' } = _.isEmpty(infoVOList) ? {} : infoVOList[0];
    // : 为中文符号，英文的：不匹配
    const titleArray = _.split(texttitle, '：');
    const newTitle = _.last(titleArray);
    const isShowMore = infoVOList.length > 12;
    const isHiddenDetail = _.isEmpty(abstract);
    const newInfoVOList = _.map(infoVOList, (item, index) => ({ ...item, id: `${index}` }));
    return (
      <div className={styles.container}>
        <div className={styles.head}>首席投顾观点</div>
        <div className={styles.up}>
          <div className={styles.title}>{newTitle || '暂无标题'}</div>
          <div className={styles.article}>
            <div className={styles.text}>{abstract || '暂无内容'}</div>
            <div
              className={classnames(
                styles.details,
                { [styles.detailsNone]: isHiddenDetail },
              )}
            >
              <a onClick={() => { this.handleDetailClick(0); }}>详情</a>
            </div>
          </div>
        </div>
        <div className={styles.down}>
          <div className={classnames(styles.title, styles.downTitle)}>资讯列表</div>
          {
            _.isEmpty(newInfoVOList) ? (
              <div className={styles.descri}>暂无数据</div>
            ) : (
              <div className={classnames(styles.descriContainer, { [styles.descri]: !isShowMore })}>
                {this.renderContent(newInfoVOList)}
              </div>
            )
          }
          {
            isShowMore ? (
              <div className={styles.fold} onClick={this.handleMoreClick} >{'更多'}</div>
            ) : (
              null
            )
          }
        </div>
      </div>
    );
  }
}

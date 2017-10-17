/**
 * @file components/customerPool/home/Viewpoint.js
 *  首页投顾观点区域
 * @author zhangjunli
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';

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
  handleMoreClick() {
    const { push } = this.props;
    // 跳转到资讯详情界面
    push({
      pathname: '/customerPool/viewpointList',
      query: { detailIndex: '0' },
    });
  }
  @autobind
  handleDetailClick(index) {
    const { push } = this.props;
    // 跳转到资讯详情界面
    push({
      pathname: '/customerPool/viewpointDetail',
      query: { detailIndex: `${index}` },
    });
  }

  @autobind
  renderContent(titleArray) {
    return titleArray.map((item, index) => (
      <div
        className={classnames(styles.row, { [styles.none]: (index >= 12) })}
        key={item.id}
      >
        <a
          className={styles.news}
          onClick={() => { this.handleDetailClick(index); }}
        >
          {item.texttitle}
        </a>
      </div>
    ));
  }

  render() {
    const { information: { infoVOList = [] } } = this.props;
    const { texttitle, abstract } = infoVOList[0] || {};
    const isShowMore = infoVOList.length > 12;
    const isHiddenDetail = _.isEmpty(abstract);
    const newInfoVOList = _.map(infoVOList, (item, index) => ({ ...item, id: `${index}` }));
    return (
      <div className={styles.container}>
        <div className={styles.head}>首席投顾观点</div>
        <div className={styles.up}>
          <div className={styles.title}>{texttitle || '暂无数据'}</div>
          <div className={styles.article}>
            <div className={styles.text}>{abstract || '暂无数据'}</div>
            <div
              className={classnames(
                styles.details,
                { [styles.detailsNone]: isHiddenDetail },
              )}
            >
              <a onClick={this.handleDetailClick}>详情</a>
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

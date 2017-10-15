/**
 * @file components/customerPool/home/Viewpoint.js
 *  首页投顾观点区域
 * @author zhangjunli
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import classnames from 'classnames';

import styles from './viewpoint.less';

export default class Viewpoint extends PureComponent {
  static propTypes = {
    dataSource: PropTypes.array,
    push: PropTypes.func.isRequired,
  }

  static defaultProps = {
    dataSource: [],
  }

  @autobind
  handleMoreClick() {
    const { push, dataSource } = this.props;
    // 跳转到资讯详情界面
    push({ pathname: '/customerPool/viewpointList', query: { dataSource } });
  }
  @autobind
  handleDetailClick() {
    const { push } = this.props;
    // 跳转到资讯详情界面
    push({ pathname: '/customerPool/viewpointDetail' });
  }

  @autobind
  renderContent() {
    const { dataSource } = this.props;
    return dataSource.map((item, index) => (
      <div
        className={classnames(styles.row, { [styles.none]: (index >= 12) })}
        key={item.id}
      >
        <a className={styles.news} onClick={() => {}}>{item.descri}</a>
      </div>
    ));
  }

  render() {
    const { dataSource } = this.props;
    const isShow = dataSource.length > 12;
    return (
      <div className={styles.container}>
        <div className={styles.head}>首席投顾观点</div>
        <div className={styles.up}>
          <div className={styles.title}>节奏震荡为主，把握轮动</div>
          <div className={styles.article}>
            <div className={styles.text}>
              上周A股市场整体呈现弱势周A股市场整体呈现弱势周A股市场整体呈现
              弱势周A股市场整体呈现弱势周A股市场整体呈现弱势震荡走势，在期货
              市场黑色系及有色品种大跌以及获利盘回吐的双重压力下，资源类周期
              股、锂电池等前期市场主线迎来调整，次新，新能源车、半导体芯片、
              房地产、氢燃料电池、5G等热点多轮轮动......
            </div>
            <div
              className={classnames(
                styles.details,
                { [styles.detailsNone]: true },
              )}
            >
              <a onClick={this.handleDetailClick}>详情</a>
            </div>
          </div>
        </div>
        <div className={styles.down}>
          <div className={classnames(styles.title, styles.downTitle)}>资讯列表</div>
          <div className={classnames(styles.descriContainer, { [styles.descri]: !isShow })}>
            {this.renderContent()}
          </div>
          {
            isShow ? (
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

/**
 * @file routes/customerPool/ViewpointDetail.js
 * 投顾观点详情
 * @author zhangjunli
 */
import React, { PropTypes, PureComponent } from 'react';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import classnames from 'classnames';

import Icon from '../../components/common/Icon';
import { viewpointDetailData } from './MockViewpointData';
import styles from './viewpointDetail.less';

const mapStateToProps = () => ({});
const mapDispatchToProps = {
  push: routerRedux.push,
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class ViewpointDetail extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  }

  @autobind
  handleBackClick() {
    const { push } = this.props;
    push({ pathname: '/customerPool/viewpointList' });
  }

  handleWordClick() {}

  handlePDFClick() {}

  render() {
    return (
      <div className={styles.listContainer}>
        <div className={styles.inner} >
          <div className={styles.content}>
            <div className={styles.head}>
              <div className={styles.titleRow}>
                <div
                  className={classnames(styles.backColumn, styles.upper)}
                  onClick={this.handleBackClick}
                >
                  <div className={styles.iconContainer}>
                    <Icon type="xiangzuo" className={styles.backIcon} />
                  </div>
                  <div className={styles.backTitle}>返回列表</div>
                </div>
                <div className={styles.title}>{viewpointDetailData.title}</div>
              </div>
              <div className={styles.infoRow}>
                <div className={styles.column}>
                  {`机构：${viewpointDetailData.org}`}
                </div>
                <div className={classnames(styles.column, styles.middle)}>
                  {`作者：${viewpointDetailData.author}`}
                </div>
                <div className={styles.column}>
                  {`发布日期：${viewpointDetailData.publicDate}`}
                </div>
              </div>
            </div>
            <div className={styles.body}>{viewpointDetailData.content}</div>
            <div className={styles.footer}>
              <div className={styles.fileColumn} onClick={this.handleWordClick}>
                <div className={styles.fileIconContainer}>
                  <Icon type="xiazai" className={classnames(styles.fileIcon, styles.word)} />
                </div>
                <div className={styles.fileName}>WORD 全文</div>
              </div>
              <div className={styles.fileColumn} onClick={this.handlePDFClick}>
                <div className={styles.fileIconContainer}>
                  <Icon type="xiazai" className={styles.fileIcon} />
                </div>
                <div className={styles.fileName}>PDF 全文</div>
              </div>
              <div
                className={classnames(styles.backColumn, styles.under)}
                onClick={this.handleBackClick}
              >
                <div className={styles.iconContainer}>
                  <Icon type="xiangzuo" className={styles.backIcon} />
                </div>
                <div className={styles.backTitle}>返回列表</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

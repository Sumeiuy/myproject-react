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
import _ from 'lodash';

import Icon from '../../components/common/Icon';
import styles from './viewpointDetail.less';

const mapStateToProps = state => ({
  information: state.customerPool.information, // 首席投顾观点
});
const mapDispatchToProps = {
  push: routerRedux.push,
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class ViewpointDetail extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    information: PropTypes.object,
  }

  static defaultProps = {
    information: {},
  }

  @autobind
  handleBackClick() {
    const { push } = this.props;
    push({ pathname: '/customerPool/viewpointList' });
  }

  handleWordClick() {}

  handlePDFClick() {}

  render() {
    const { location: { query }, information: { infoVOList = [] } } = this.props;
    const { detailIndex = '0' } = query;
    const {
      texttitle = '',
      abstract = '',
      secuabbr = '',
      authors = '',
      pubdata = '',
    } = infoVOList[_.toNumber(detailIndex)];
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
                <div className={styles.title}>{texttitle || '暂无数据'}</div>
              </div>
              <div className={styles.infoRow}>
                <div className={styles.column}>
                  {_.isEmpty(secuabbr) ? '机构：--' : `机构：${secuabbr}`}
                </div>
                <div className={classnames(styles.column, styles.middle)}>
                  {_.isEmpty(authors) ? '作者：--' : `作者：${authors}`}
                </div>
                <div className={styles.column}>
                  {_.isEmpty(pubdata) ? '发布日期：--' : `发布日期：${pubdata}`}
                </div>
              </div>
            </div>
            <div className={styles.body}>{_.isEmpty(abstract) ? '暂无数据' : abstract}</div>
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

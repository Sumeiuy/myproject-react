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
  goBack: routerRedux.goBack,
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class ViewpointDetail extends PureComponent {
  static propTypes = {
    goBack: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    information: PropTypes.object,
  }

  static defaultProps = {
    information: {},
  }

  @autobind
  handleBackClick() {
    const { goBack } = this.props;
    goBack();
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
      annexpathpdf = '',
    } = infoVOList[_.toNumber(detailIndex)] || {};
    // 分割成段，展示
    const formateAbstract = _.isEmpty(abstract) ? (
      '<p>暂无数据</p>'
    ) : (
      _.replace(_.trim(abstract), /\s{2,}/gi, '<br /><span></span>')
    );
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
            <div className={styles.body} dangerouslySetInnerHTML={{ __html: formateAbstract }} />
            <div className={styles.footer}>
              <div className={styles.fileColumn} onClick={this.handleWordClick}>
                <div className={styles.fileIconContainer}>
                  <Icon type="xiazai" className={classnames(styles.fileIcon, styles.word)} />
                </div>
                <div className={styles.fileName}>
                  <a href={annexpathpdf} download={texttitle || 'WORD 全文.word'}>WORD 全文</a>
                </div>
              </div>
              <div className={styles.fileColumn} onClick={this.handlePDFClick}>
                <div className={styles.fileIconContainer}>
                  <Icon type="xiazai" className={styles.fileIcon} />
                </div>
                <div className={styles.fileName}>
                  <a href={annexpathpdf} download={texttitle || 'PDF 全文.pdf'}>PDF 全文</a>
                </div>
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

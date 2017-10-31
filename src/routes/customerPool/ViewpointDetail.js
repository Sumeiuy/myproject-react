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

import wordSrc from '../../../static/images/word.png';
import pdfSrc from '../../../static/images/pdf.png';
import Icon from '../../components/common/Icon';
import styles from './viewpointDetail.less';

const mapStateToProps = state => ({
  information: state.customerPool.information, // 首席投顾观点
});
const mapDispatchToProps = {
  goBack: routerRedux.goBack,
  push: routerRedux.push,
  downloadFile: query => ({
    type: 'viewpointDetail/downloadFile',
    payload: query,
  }),
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class ViewpointDetail extends PureComponent {
  static propTypes = {
    goBack: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    information: PropTypes.object,
    push: PropTypes.func.isRequired,
    downloadFile: PropTypes.func.isRequired,
  }

  static defaultProps = {
    information: {},
  }

  @autobind
  handleBackClick() {
    const { goBack, push, location: { query: { state } } } = this.props;
    if (_.isEmpty(state)) {
      push({ pathname: '/customerPool/viewpointList' });
    } else {
      goBack();
    }
  }

  @autobind
  handleDownloadClick({ format }) {
    const { downloadFile } = this.props;
    downloadFile({ module: 'viewpointDetail', param: `${format}_download` });
  }

  renderDownLoad({ loadUrl, format, fileName }) {
    return (
      <a
        href={loadUrl}
        download={fileName || `${_.toUpper(format)} 全文.${_.toLower(format)}`}
        onClick={() => this.handleDownloadClick({ format })}
      >
        {`${_.toUpper(format)} 全文`}
      </a>
    );
  }

  render() {
    const { location: { query = {} }, information: { infoVOList = [] } } = this.props;
    const { detailIndex = '0' } = query;
    const index = _.toNumber(detailIndex);
    const {
      texttitle = '暂无标题',
      abstract = '暂无内容',
      secuabbr = '',
      authors = '',
      pubdatedetail = '',
      annexpathpdf = '',
      annexpathword = '',
    } = infoVOList[index] || {};
    const dateArray = _.split(pubdatedetail, ' ');
    const date = _.isEmpty(dateArray) ? '' : _.head(dateArray);
    // 分割成段，展示
    const formateAbstract = _.isEmpty(abstract) ? (
      '<p>暂无内容</p>'
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
                    <Icon type="fanhui" className={styles.backIcon} />
                  </div>
                  <div className={styles.backTitle}>资讯列表</div>
                </div>
                <div className={styles.title}>
                  {_.isEmpty(texttitle) ? '暂无标题' : texttitle}
                </div>
              </div>
              <div className={styles.infoRow}>
                <div className={styles.column}>
                  {_.isEmpty(secuabbr) ? '机构：--' : `机构：${secuabbr}`}
                </div>
                <div className={classnames(styles.column, styles.middle)}>
                  {_.isEmpty(authors) ? '作者：--' : `作者：${authors}`}
                </div>
                <div className={styles.column}>
                  {_.isEmpty(date) ? '发布日期：--' : `发布日期：${date}`}
                </div>
              </div>
            </div>
            <div className={styles.body} dangerouslySetInnerHTML={{ __html: formateAbstract }} />
            <div className={styles.footer}>
              <div
                className={classnames(
                  styles.fileColumn,
                  { [styles.downLoadNone]: _.isEmpty(annexpathword) })
                }
              >
                <div className={styles.fileIconContainer}>
                  <img src={wordSrc} alt="WORD 图标" />
                </div>
                <div className={styles.fileName}>
                  {this.renderDownLoad({
                    loadUrl: annexpathword,
                    format: 'WORD',
                    fileName: texttitle,
                  })}
                </div>
              </div>
              <div
                className={classnames(
                  styles.fileColumn,
                  { [styles.downLoadNone]: _.isEmpty(annexpathpdf) })
                }
              >
                <div className={styles.fileIconContainer}>
                  <img src={pdfSrc} alt="PDF 图标" />
                </div>
                <div className={styles.fileName}>
                  {this.renderDownLoad({
                    loadUrl: annexpathpdf,
                    format: 'PDF',
                    fileName: texttitle,
                  })}
                </div>
              </div>
              <div
                className={classnames(styles.backColumn, styles.under)}
                onClick={this.handleBackClick}
              >
                <div className={styles.iconContainer}>
                  <Icon type="fanhui" className={styles.backIcon} />
                </div>
                <div className={styles.backTitle}>资讯列表</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

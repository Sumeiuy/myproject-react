/**
 * @Author: XuWenKang
 * @Description: 首席观点详情
 * @Date: 2018-06-21 16:49:57
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-06-21 16:58:29
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';

import withRouter from '../../decorators/withRouter';
import { linkTo } from '../../utils';
import { url as urlHelper, dva } from '../../helper';
import wordSrc from './img/word.png';
import pdfSrc from './img/pdf.png';
import logable from '../../decorators/logable';
import Icon from '../../components/common/Icon';
import styles from './viewpointDetail.less';

const dispatch = dva.generateEffect;
const EMPTY_OBJECT = {};
const effects = {
  // 获取首席观点详情数据
  queryChiefViewpointDetail: 'latestView/queryChiefViewpointDetail',
};

const mapStateToProps = state => ({
  // 首席观点详情
  viewpointDetail: state.latestView.viewpointDetail,
});
const mapDispatchToProps = {
  queryChiefViewpointDetail: dispatch(effects.queryChiefViewpointDetail,
    { loading: true, forceFull: true }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class ViewpointDetail extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    // 首席观点详情
    queryChiefViewpointDetail: PropTypes.func.isRequired,
    viewpointDetail: PropTypes.object.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const {
      location: {
        query: { id },
      },
      queryChiefViewpointDetail,
      viewpointDetail,
    } = this.props;
    if (_.isEmpty(viewpointDetail[id])) {
      queryChiefViewpointDetail({
        id,
      });
    }
  }

  @autobind
  handleBackClick() {
    const {
      location: {
        query,
        query: { sourceUrl = '/latestView' },
      },
    } = this.props;
    const { push } = this.context;
    const param = {
      id: 'RTC_TAB_VIEWPOINT',
      title: '资讯',
    };
    const url = sourceUrl;
    const newQuery = {
      ...query,
      id: '',
      sourceUrl: '',
    };
    linkTo({
      routerAction: push,
      url: `${url}?${urlHelper.stringify(newQuery)}`,
      param,
      pathname: url,
      query: newQuery,
      name: '资讯详情',
    });
  }

  // 空方法，用于日志上报
  @logable({ type: 'Click', payload: { name: '下载PDF 全文' } })
  handleDownloadClick() {}

  @logable({ type: 'Click', payload: { name: '下载WORD 全文' } })
  handleDownload() {}

  render() {
    const {
      location: {
        query: { id },
      },
      viewpointDetail,
    } = this.props;
    const currentDetail = viewpointDetail[id] || EMPTY_OBJECT;
    const {
      title = '暂无标题',
      content = '暂无内容',
      stockName = '--',
      author = '--',
      time = '--',
      pdfDownloadUrl = '',
      wordDownloadUrl = '',
    } = currentDetail;

    // Д 为替换后端返回数据中的换行符而设置，无实际价值
    const newDetail = content.replace(/\r\n|\n\t|\t\n|\n/g, 'Д');
    const splitArray = newDetail.split('Д');
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
                  <div className={styles.backTitle}>返回列表</div>
                </div>
                <div className={styles.title}>
                  {title}
                </div>
              </div>
              <div className={styles.infoRow}>
                <div className={styles.column}>
                  相关股票：
                  {stockName}
                </div>
                <div className={classnames(styles.column, styles.middle)}>
                  作者：
                  {author}
                </div>
                <div className={styles.column}>
                  发布日期：
                  {time}
                </div>
              </div>
            </div>
            <div
              className={styles.body}
            >
              {
                splitArray.map((item, index) => {
                  const itemKey = `item${index}`;
                  return (<div
                    key={itemKey}
                    className={styles.contentDiv}
                    dangerouslySetInnerHTML={{ __html: _.trim(item) }}
                  />);
                })
              }
            </div>
            <div className={styles.footer}>
              <div
                className={classnames(
                  styles.fileColumn,
                  { [styles.downLoadNone]: _.isEmpty(wordDownloadUrl) })
                }
              >
                <div className={styles.fileIconContainer}>
                  <img src={wordSrc} alt="WORD 图标" />
                </div>
                <div className={styles.fileName}>
                  <a
                    onClick={this.handleDownload}
                    href={wordDownloadUrl}
                    download
                  >
                    WORD 全文
                  </a>
                </div>
              </div>
              <div
                className={classnames(
                  styles.fileColumn,
                  { [styles.downLoadNone]: _.isEmpty(pdfDownloadUrl) })
                }
              >
                <div className={styles.fileIconContainer}>
                  <img src={pdfSrc} alt="PDF 图标" />
                </div>
                <div className={styles.fileName}>
                  <a
                    onClick={this.handleDownloadClick}
                    href={pdfDownloadUrl}
                    download
                  >
                    PDF 全文
                  </a>
                </div>
              </div>
              <div
                className={classnames(styles.backColumn, styles.under)}
                onClick={this.handleBackClick}
              >
                <div className={styles.iconContainer}>
                  <Icon type="fanhui" className={styles.backIcon} />
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

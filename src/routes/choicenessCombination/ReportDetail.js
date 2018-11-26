/**
 * @Description: 历史报告详情页面
 * @Author: Liujianshu
 * @Date: 2018-05-12 14:09:08
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-05-12 17:05:42
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import { Layout } from 'antd';
import _ from 'lodash';

import { closeRctTab } from '../../utils';
import withRouter from '../../decorators/withRouter';
import fspPatch from '../../decorators/fspPatch';
import logable from '../../decorators/logable';
import Icon from '../../components/common/Icon';
import { dva, env } from '../../helper';
import styles from './reportDetail.less';

const { Header, Footer, Content } = Layout;
const EMPTY_PARAM = '暂无';

const dispatch = dva.generateEffect;
const effects = {
  // 历史报告详情
  getReportDetail: 'choicenessCombination/getReportDetail',
};

const mapStateToProps = state => ({
  // 历史报告详情
  reportDetail: state.choicenessCombination.reportDetail,
});
const mapDispatchToProps = {
  getReportDetail: dispatch(effects.getReportDetail, { loading: true }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@fspPatch()
export default class ReportDetail extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    getReportDetail: PropTypes.func.isRequired,
    reportDetail: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const {
      getReportDetail,
      location: {
        query: {
          id,
        },
      },
    } = this.props;
    getReportDetail({ id });
  }


  // 空方法，用于日志上报
  @logable({ type: 'Click',
payload: { name: '下载PDF 全文' } })
  handleDownloadClick() {}

  @logable({ type: 'Click',
payload: { name: '下载WORD 全文' } })
  handleDownload() {}

  @autobind
  @logable({ type: 'Click',
payload: { name: '历史报告详情',
value: '返回上一页' } })
  handleGoBck() {
    closeRctTab({ id: 'FSP_JX_GROUP_REPORT_DETAIL' });
  }
  render() {
    const { reportDetail = {} } = this.props;
    const { title, author, time, detail = '', wordDownloadUrl, pdfDownloadUrl } = reportDetail;

    let newDetail = '';
    let splitArray = [];
    // detail 为空时，返回数据为 null，不能 replace
    if (!_.isEmpty(detail)) {
      // Д 为替换后端返回数据中的换行符而设置，无实际价值
      newDetail = detail.replace(/\r\n|\n\t|\t\n|\n/g, 'Д');
      splitArray = newDetail.split('Д');
    }

    return (
      <Layout className={styles.detailWrapper}>
        <Header className={styles.header}>
          <h2>{title || EMPTY_PARAM}</h2>
          <h3>作者：{author || EMPTY_PARAM}　　　发布日期：{time || EMPTY_PARAM}</h3>
        </Header>
        <Content className={styles.content}>
          {
            detail
            ?
              splitArray.map((item, index) => {
                const itemKey = `item${index}`;
                return (<div
                  key={itemKey}
                  className={styles.contentDiv}
                  dangerouslySetInnerHTML={{ __html: _.trim(item) }}
                />);
              })
            :
              <div>{EMPTY_PARAM}</div>
          }
        </Content>
        <Footer className={styles.footer}>
          <div className={styles.left}>
            {
              pdfDownloadUrl
              ?
                <a
                  onClick={this.handleDownloadClick}
                  href={pdfDownloadUrl}
                  download
                >
                  <Icon type="pdf1" />PDF 全文
                </a>
              :
                null
            }
            {
              wordDownloadUrl
              ?
                <a
                  onClick={this.handleDownload}
                  href={wordDownloadUrl}
                  download
                >
                  <Icon type="word1" />WORD 全文
                </a>
              :
                null
            }
          </div>
          <div className={styles.right}>
            {
              !env.isInReact() ?
                <a onClick={this.handleGoBck}><Icon type="fanhui1" />返回上一页</a> : null
            }
          </div>
        </Footer>
      </Layout>
    );
  }
}

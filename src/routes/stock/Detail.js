/**
 * @Description: 个股详情页面
 * @Author: Liujianshu
 * @Date: 2018-02-28 14:07:50
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-03-09 15:21:26
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Layout } from 'antd';
import _ from 'lodash';

import withRouter from '../../decorators/withRouter';
import setHeight from '../../decorators/setHeight';
import Icon from '../../components/common/Icon';

import config from './config';
import styles from './detail.less';

const { typeList } = config;
const { Header, Footer, Content } = Layout;
const EMPTY_PARAM = '暂无';

const fetchDataFunction = (globalLoading, type, forceFull) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
  forceFull,
});
const mapStateToProps = state => ({
  detail: state.stock.detail,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  push: routerRedux.push,
  // 获取列表
  getStockDetail: fetchDataFunction(true, 'stock/getStockDetail', true),
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@setHeight
export default class StockDetail extends PureComponent {
  static propTypes = {
    replace: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    getStockDetail: PropTypes.func.isRequired,
    detail: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const {
      location: {
        query: {
          id,
        },
      },
      getStockDetail,
      detail,
    } = this.props;
    if (_.isEmpty(detail[id])) {
      getStockDetail({ id });
    }
  }

  @autobind
  hrefHandle(item) {
    const {
      location: {
        query: {
          pageSize = 10,
          pageNum = 1,
          keyword = '',
          type = '',
        },
      },
      push,
    } = this.props;
    push(`/stock?type=${item}&pageSize=${pageSize}&pageNum=${item === type ? pageNum : 1}&keyword=${keyword}`);
  }
  render() {
    const {
      location: {
        query: {
          id,
        },
      },
      detail: dataDetail,
    } = this.props;
    if (_.isEmpty(dataDetail[id])) {
      return null;
    }
    const {
        title,
        author,
        pubdate,
        detail,
        pdfDownloadUrl = '',
        wordDownloadUrl = '',
    } = dataDetail[id];

    // Д 为替换后端返回数据中的换行符而设置，无实际价值
    const newDetail = detail.replace(/\r\n|\n\t|\t\n|\n/g, 'Д');
    const splitArray = newDetail.split('Д');
    return (
      <Layout className={styles.detailWrapper}>
        <Header className={styles.header}>
          <h2>{title}</h2>
          <h3>作者：{author || EMPTY_PARAM}    发布日期：{pubdate || EMPTY_PARAM}</h3>
        </Header>
        <Content className={styles.content}>
          {
            detail
            ?
              splitArray.map(item => ((<div dangerouslySetInnerHTML={{ __html: _.trim(item) }} />)))
            :
              <div>{EMPTY_PARAM}</div>
          }
        </Content>
        <Footer className={styles.footer}>
          <div className={styles.left}>
            {
              pdfDownloadUrl
              ?
                <a href={pdfDownloadUrl} download>
                  <Icon type="pdf1" />PDF 全文
                </a>
              :
                null
            }
            {
              wordDownloadUrl
              ?
                <a href={wordDownloadUrl} download>
                  <Icon type="word1" />WORD 全文
                </a>
              :
                null
            }
            { /*<a><Icon type="chakan" />查看持仓客户</a>*/ }
          </div>
          <div className={styles.right}>
            <Icon type="fanhui1" />
            {
              typeList.map(item => (
                <a onClick={() => this.hrefHandle(item)} key={item}>相关{config[item].name}</a>
              ))
            }
          </div>
        </Footer>
      </Layout>
    );
  }
}

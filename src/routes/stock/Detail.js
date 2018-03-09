/**
 * @Description: 个股详情页面
 * @Author: Liujianshu
 * @Date: 2018-02-28 14:07:50
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-03-09 15:21:26
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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
  render() {
    const {
      location: {
        query: {
          pageSize = 10,
          pageNum = 1,
          keyword = '',
          id,
        },
      },
      detail: dataDetail,
    } = this.props;
    const url = `/#/stock?pageSize=${pageSize}&pageNum=${pageNum}&keyword=${keyword}`;
    if (_.isEmpty(dataDetail[id])) {
      return null;
    }
    const {
        title,
        author,
        pubdate,
        detail,
    } = dataDetail[id];
    return (
      <Layout className={styles.detailWrapper}>
        <Header className={styles.header}>
          <h2>{title}</h2>
          <h3>作者：{author || '暂无'}    发布日期：{pubdate}</h3>
        </Header>
        <Content className={styles.content}>
          <div dangerouslySetInnerHTML={{ __html: detail }} />
        </Content>
        <Footer className={styles.footer}>
          <div className={styles.left}>
            <a><Icon type="chakan" />查看持仓客户</a>
          </div>
          <div className={styles.right}>
            <Icon type="fanhui1" />
            {
              typeList.map(item => (<a href={`${url}&type=${item}`} key={item}>相关{config[item].name}</a>))
            }
          </div>
        </Footer>
      </Layout>
    );
  }
}

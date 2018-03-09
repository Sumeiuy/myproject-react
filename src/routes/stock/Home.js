/**
 * @Description: 个股页面
 * @Author: Liujianshu
 * @Date: 2018-02-26 16:22:05
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-03-09 15:33:00
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Tabs, Table, Input } from 'antd';
import _ from 'lodash';

import withRouter from '../../decorators/withRouter';
import setHeight from '../../decorators/setHeight';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import config from './config';
import styles from './home.less';

const TabPane = Tabs.TabPane;
const { typeList } = config;

const fetchDataFunction = (globalLoading, type, forceFull) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
  forceFull,
});
const mapStateToProps = state => ({
  list: state.stock.list,
  page: state.stock.page,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  push: routerRedux.push,
  // 获取列表
  getStockList: fetchDataFunction(true, 'stock/getStockList', true),
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@setHeight
export default class Stock extends PureComponent {
  static propTypes = {
    replace: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    getStockList: PropTypes.func.isRequired,
    list: PropTypes.array,
    page: PropTypes.object,
  }

  static defaultProps = {
    list: [],
    page: {},
  }

  constructor(props) {
    super(props);
    const {
      location: {
        query: {
          pageSize = 10,
          pageNum = 1,
          type = typeList[0],
          keyword = '',
        },
      },
    } = props;
    this.state = {
      // tab 页类型
      type,
      // 每页条数
      pageSize,
      // 当前页
      pageNum,
      // 总条数
      total: 0,
      // 搜索关键字
      keyword,
    };
  }

  componentDidMount() {
    // 请求所有股票点评
    this.sendRequest({});
  }

  @autobind
  onRowClick(record) {
    const { id } = record;
    const { push } = this.props;
    const { type, pageSize, pageNum, keyword } = this.state;
    push(`/stock/detail?id=${id}&type=${type}&pageSize=${pageSize}&pageNum=${pageNum}&keyword=${keyword}`);
  }

  // tab 切换事件
  @autobind
  tabChangeHandle(key) {
    this.setState({
      type: key,
    }, () => {
      this.sendRequest({
        type: key,
      });
    });
  }

  // 搜索框变化事件
  @autobind
  searchChangeHandle(e) {
    this.setState({
      keyword: e.target.value,
    });
  }

  // 搜索事件
  @autobind
  searchHandle() {
    const { keyword } = this.state;
    this.sendRequest({
      keyword,
      page: 1,
      pageSize: 10,
    });
  }

  // 翻页事件
  @autobind
  pageChangeHandle(page, pageSize) {
    const payload = {
      page,
      pageSize,
    };
    this.setState({
      pageSize,
      pageNum: page,
    }, () => {
      this.sendRequest(payload);
    });
  }

  @autobind
  sendRequest(obj) {
    const {
      location: {
        query: {
          pageSize = 10,
          pageNum = 1,
          keyword = '',
        },
      },
      getStockList,
    } = this.props;
    const { type } = this.state;
    const payload = {
      type,
      page: pageNum,
      pageSize,
      keyword,
      orderBy: '',
      ...obj,
    };
    getStockList(payload).then(() => {
      const { page = {} } = this.props;
      this.setState({
        pageSize: page.pageSize || 10,
        pageNum: page.curPageNum || 1,
        total: page.totalRecordNum || 0,
      });
    });
  }

  @autobind
  wrapperTD(array) {
    const newArray = _.cloneDeep(array);
    if (!_.isEmpty(array)) {
      newArray[0].render = text => <div>{text}</div>;
    }
    return newArray;
  }

  render() {
    const { type, keyword, pageNum, pageSize, total } = this.state;
    const { list } = this.props;

    // 分页
    const paginationOption = {
      pageSize: Number(pageSize),
      current: Number(pageNum),
      total: Number(total),
      onChange: this.pageChangeHandle,
    };

    return (
      <div className={styles.stockWrapper}>
        <div className={styles.search}>
          搜索：
          <Input
            placeholder="股票名称/股票代码/股票简称"
            onPressEnter={this.searchHandle}
            onChange={this.searchChangeHandle}
            style={{ width: '34.7%' }}
            value={keyword}
          />
          <Button
            type="primary"
            size="small"
            onClick={this.searchHandle}
          >
            查询
          </Button>
        </div>
        <Tabs defaultActiveKey={type} onChange={this.tabChangeHandle}>
          {
            typeList.map(item => (<TabPane tab={`个股${config[item].name}`} key={item}>
              <Table
                columns={this.wrapperTD(config[item].titleList)}
                dataSource={list}
                pagination={false}
                onRowClick={this.onRowClick}
              />
              <Pagination {...paginationOption} />
            </TabPane>))
          }
        </Tabs>
      </div>
    );
  }
}

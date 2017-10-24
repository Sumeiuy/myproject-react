/**
 * @file routes/customerPool/ViewpointList.js
 * 投顾观点列表
 * @author zhangjunli
 */
import React, { PropTypes, PureComponent } from 'react';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { Table } from 'antd';
import _ from 'lodash';

import Paganation from '../../components/common/Paganation';
import styles from './viewpointList.less';

const columns = [{
  title: '标题',
  dataIndex: 'texttitle',
  key: 'texttitle',
  width: '36%',
}, {
  title: '类型',
  dataIndex: 'textcategorychinese',
  key: 'textcategorychinese',
  width: '18%',
}, {
  title: '相关股票',
  dataIndex: 'aboutStock',
  key: 'aboutStock',
  width: '15%',
}, {
  title: '行业',
  dataIndex: 'induname',
  key: 'induname',
  width: '12%',
}, {
  title: '报告日期',
  dataIndex: 'pubdata',
  key: 'pubdata',
  width: '12%',
}, {
  title: '作者',
  dataIndex: 'authors',
  key: 'authors',
}];

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  information: state.customerPool.information, // 首席投顾观点
});
const mapDispatchToProps = {
  getInformation: fetchDataFunction(true, 'customerPool/getInformation'),
  push: routerRedux.push,
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class ViewpointList extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    information: PropTypes.object,
    getInformation: PropTypes.func.isRequired,
  }

  static defaultProps = {
    information: {},
  }

  constructor(props) {
    super(props);
    const { information: { infoVOList = [] } } = props;
    this.state = {
      curPageNum: 1, // 记录当前展示的页码
      curPageSize: 18, // 记录当前每页的容量
      pageList: infoVOList, // 当前页码对应的列表数据
    };
  }

  componentWillReceiveProps(nextProps) {
    const { information: { infoVOList = [] } } = nextProps;
    this.setState({ pageList: infoVOList });
  }

  @autobind
  handleRowClick(record, index) {
    const { push } = this.props;
    push({
      pathname: '/customerPool/viewpointDetail',
      query: { detailIndex: `${index}` },
      state: 'formList',
    });
  }

  @autobind
  handlePageClick(page) {
    const { getInformation } = this.props;
    const { curPageSize } = this.state;
    this.setState(
      { curPageNum: page },
      () => getInformation({ curPageNum: page, pageSize: curPageSize }),
    );
  }

  @autobind
  handlePageSizeClick(current, size) {
    const { getInformation } = this.props;
    const { curPageNum } = this.state;
    this.setState(
      { curPageSize: size },
      () => getInformation({ curPageNum, pageSize: size }),
    );
  }

  formatString(str) {
    return _.isEmpty(str) ? '--' : str;
  }

  render() {
    const { information: { totalCount } } = this.props;
    const { curPageNum = 1, pageList = [], curPageSize = 18 } = this.state;
    const newInfoVOList = _.map(
      pageList,
      (item, index) => ({
        texttitle: this.formatString(item.texttitle),
        textcategory: this.formatString(item.textcategory),
        induname: this.formatString(item.induname),
        pubdata: this.formatString(item.pubdata),
        authors: this.formatString(item.authors),
        aboutStock: `${this.formatString(item.secuabbr)} / ${this.formatString(item.tradingcode)}`,
        id: `${index}`,
      }),
    );
    const paganationOption = {
      curPageNum,
      curPageSize,
      totalRecordNum: totalCount,
      onPageChange: this.handlePageClick,
      onSizeChange: this.handlePageSizeClick,
      originPageSizeUnit: 18,
    };
    return (
      <div className={styles.listContainer}>
        <div className={styles.inner}>
          <Table
            rowKey={'id'}
            columns={columns}
            dataSource={newInfoVOList}
            pagination={false}
            onRowClick={this.handleRowClick}
          />
          <Paganation {...paganationOption} />
        </div>
      </div>
    );
  }
}

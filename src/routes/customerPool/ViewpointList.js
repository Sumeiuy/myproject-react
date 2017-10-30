/**
 * @file routes/customerPool/ViewpointList.js
 * 投顾观点列表
 * @author zhangjunli
 */
import React, { PropTypes, PureComponent } from 'react';
import { withRouter, routerRedux } from 'dva/router';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Table } from 'antd';
import _ from 'lodash';

import Paganation from '../../components/common/Paganation';
import styles from './viewpointList.less';

function formatString(str) {
  return _.isEmpty(str) ? '--' : str;
}

const columns = ({ actionClick }) => {
  function handleClick(item) {
    if (_.isFunction(actionClick)) {
      actionClick(item);
    }
  }
  return [{
    title: '标题',
    key: 'texttitle',
    width: '30%',
    render: item => (
      <div
        className={classnames(styles.td, styles.headLine)}
        onClick={() => { handleClick(item); }}
        title={formatString(item.texttitle)}
      >
        <a>{formatString(item.texttitle)}</a>
      </div>
    ),
  }, {
    title: '类型',
    dataIndex: 'textcategorychinese',
    key: 'textcategorychinese',
    width: '14%',
    render: item => (
      <div className={classnames(styles.td, styles.category)}>{formatString(item)}</div>
    ),
  }, {
    title: '相关股票',
    dataIndex: 'aboutStock',
    key: 'aboutStock',
    width: '16%',
    render: item => (
      <div className={classnames(styles.td, styles.stock)}>{formatString(item)}</div>
    ),
  }, {
    title: '行业',
    dataIndex: 'induname',
    key: 'induname',
    width: '13%',
    render: item => (
      <div className={classnames(styles.td, styles.induname)}>{formatString(item)}</div>
    ),
  }, {
    title: '报告日期',
    dataIndex: 'pubdatelist',
    key: 'pubdatelist',
    width: '13%',
    render: (item) => {
      const dateArray = _.split(item, ' ');
      const date = _.isEmpty(dateArray) ? '' : _.head(dateArray);
      return (
        <div className={classnames(styles.td, styles.pubdatelist)}>{formatString(date)}</div>
      );
    },
  }, {
    title: '作者',
    dataIndex: 'authors',
    key: 'authors',
    width: '13%',
    render: item => (
      <div
        className={classnames(styles.td, styles.authors)}
        title={formatString(item)}
      >
        {formatString(item)}
      </div>
    ),
  }];
};

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
  handleTitleClick(item) {
    const { push } = this.props;
    push({
      pathname: '/customerPool/viewpointDetail',
      query: { detailIndex: item.id },
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

  render() {
    const { information: { totalCount } } = this.props;
    const { curPageNum = 1, pageList = [], curPageSize = 18 } = this.state;
    const newInfoVOList = _.map(
      pageList,
      (item, index) => ({
        ...item,
        aboutStock: `${formatString(item.secuabbr)} / ${formatString(item.tradingcode)}`,
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
    const tableColumns = columns({ actionClick: this.handleTitleClick });
    return (
      <div className={styles.listContainer}>
        <div
          className={styles.inner}
        >
          <Table
            rowKey={'id'}
            columns={tableColumns}
            dataSource={newInfoVOList}
            pagination={false}
            scroll={{ x: 1100 }}
          />
          <Paganation {...paganationOption} />
        </div>
      </div>
    );
  }
}

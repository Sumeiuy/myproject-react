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

import Icon from '../../components/common/Icon';
import styles from './viewpointList.less';

const columns = [{
  title: '标题',
  dataIndex: 'texttitle',
  key: 'texttitle',
  width: '36%',
}, {
  title: '类型',
  dataIndex: 'textcategory',
  key: 'textcategory',
  width: '18%',
}, {
  title: '相关股票',
  dataIndex: 'aboutStock',
  key: 'aboutStock',
  width: '15%',
}, {
  title: '行业',
  dataIndex: 'secucategorycodel',
  key: 'secucategorycodel',
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
    const { information: { list = [] } } = props;
    const { curPageNum = 1, infoVOList = [] } = _.head(list) || {};
    this.state = {
      curPageNum, // 记录当前展示的页码
      pageList: infoVOList, // 当前页码对应的列表数据
    };
  }

  componentWillReceiveProps(nextProps) {
    const { information: { list = [] } } = nextProps;
    if (!_.isEmpty(list)) {
      const { curPageNum: nextPageNum, infoVOList: nextPageList } = _.last(list) || {};
      const { curPageNum } = this.state;
      if (curPageNum !== nextPageNum) {
        this.setState({ curPageNum: nextPageNum, pageList: nextPageList });
      }
    }
  }

  @autobind
  handleRowClick(record, index) {
    const { push } = this.props;
    push({
      pathname: '/customerPool/viewpointDetail',
      query: { detailIndex: `${index}` },
    });
  }

  @autobind
  handlePageClick(page) {
    const { getInformation, information: { list = [] } } = this.props;
    const pageList = _.filter(
      list,
      (item) => {
        const { curPageNum = 0 } = item;
        return curPageNum === page;
      },
    );
    const { infoVOList = [] } = _.isEmpty(pageList) ? {} : pageList[0];
    if (_.isEmpty(infoVOList)) {
      getInformation({ curPageNum: page, pageSize: 18 });
    } else {
      this.setState({ curPageNum: page, pageList: infoVOList });
    }
  }

  formatString(str) {
    return _.isEmpty(str) ? '--' : str;
  }

  renderItem(current, type, originalElement) {
    if (type === 'prev') {
      return <a><Icon type="xiangzuo" className={styles.zuoIcon} />上一页</a>;
    } else if (type === 'next') {
      return <a>下一页<Icon type="xiangyou" className={styles.youIcon} /></a>;
    }
    return originalElement;
  }

  render() {
    const { information: { totalCount } } = this.props;
    const { curPageNum = 1, pageList = [] } = this.state;
    const newInfoVOList = _.map(
      pageList,
      (item, index) => ({
        texttitle: this.formatString(item.texttitle),
        textcategory: this.formatString(item.textcategory),
        secucategorycodel: this.formatString(item.secucategorycodel),
        pubdata: this.formatString(item.pubdata),
        authors: this.formatString(item.authors),
        aboutStock: `${this.formatString(item.secuabbr)} / ${this.formatString(item.tradingcode)}`,
        id: `${index}`,
      }),
    );
    const pagination = {
      itemRender: this.renderItem,
      showTotal: () => `共 ${totalCount} 项`,
      defaultPageSize: 18,
      pageSize: 18,
      total: (_.toNumber(totalCount) || 0),
      onChange: this.handlePageClick,
      current: curPageNum,
      defaultCurrent: 1,
    };
    return (
      <div className={styles.listContainer}>
        <div className={styles.inner}>
          <Table
            rowKey={'id'}
            columns={columns}
            dataSource={newInfoVOList}
            pagination={pagination}
            onRowClick={this.handleRowClick}
          />
        </div>
      </div>
    );
  }
}

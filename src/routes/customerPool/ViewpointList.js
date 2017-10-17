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

const mapStateToProps = state => ({
  information: state.customerPool.information, // 首席投顾观点
});
const mapDispatchToProps = {
  push: routerRedux.push,
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class ViewpointList extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    information: PropTypes.object,
  }

  static defaultProps = {
    information: {},
  }

  @autobind
  handleRowClick(record, index) {
    const { push } = this.props;
    push({
      pathname: '/customerPool/viewpointDetail',
      query: { detailIndex: `${index}` },
    });
  }

  totalPage(total) {
    return `共 ${total} 项`;
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
    const { information: { infoVOList = [] } } = this.props;
    const newInfoVOList = _.map(
      infoVOList,
      item => ({ ...item, aboutStock: `${item.secuabbr} / ${item.comcode}` }),
    );
    const pagination = {
      itemRender: this.renderItem,
      showTotal: this.totalPage,
      defaultPageSize: 18,
      pageSize: 18,
      // total: viewpointData.length,
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

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

import Icon from '../../components/common/Icon';
import { columns, viewpointData } from './MockViewpointData';
import styles from './viewpointList.less';

const mapStateToProps = () => ({});
const mapDispatchToProps = {
  push: routerRedux.push,
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class ViewpointList extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  }

  @autobind
  handleRowClick() {
    const { push } = this.props;
    push({ pathname: '/customerPool/viewpointDetail' });
  }

  itemRenderFunc(current, type, originalElement) {
    if (type === 'prev') {
      return <a><Icon type="xiangzuo" className={styles.zuoIcon} />上一页</a>;
    } else if (type === 'next') {
      return <a>下一页<Icon type="xiangyou" className={styles.youIcon} /></a>;
    }
    return originalElement;
  }

  totalPage(total) {
    return `共 ${total} 项`;
  }

  render() {
    const pagination = {
      itemRender: this.itemRenderFunc,
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
            dataSource={viewpointData}
            pagination={pagination}
            onRowClick={this.handleRowClick}
          />
        </div>
      </div>
    );
  }
}

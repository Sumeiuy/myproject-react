/**
 * @Description: 分公司客户分配消息提醒页面
 * @Author: Liujianshu
 * @Date: 2018-05-25 13:55:42
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-05-25 14:47:47
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import _ from 'lodash';

import Pagination from '../../components/common/Pagination';
import CommonTable from '../../components/common/biz/CommonTable';
import Barable from '../../decorators/selfBar';
import fspPatch from '../../decorators/fspPatch';
import withRouter from '../../decorators/withRouter';
import { dva } from '../../helper';
import config from '../../components/custAllot/config';
import styles from './notifies.less';

const dispatch = dva.generateEffect;

// 表格标题
const { positionTypeArray, titleList: { notifiCust } } = config;
const PAGE_SIZE = 20;
const KEY_CUSTNAME = 'custName';
const KEY_POSITIONTYPE = 'positionType';

const effects = {
  // 获取数据
  queryNotifiesList: 'custAllot/queryNotifiesList',
};

const mapStateToProps = state => ({
  // 数据
  notifiesData: state.custAllot.notifiesData,
});

const mapDispatchToProps = {
  // 获取数据
  queryNotifiesList: dispatch(effects.queryNotifiesList, { loading: true, forceFull: true }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
@fspPatch()

export default class CustAllotNotifies extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    notifiesData: PropTypes.object.isRequired,
    queryNotifiesList: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const {
      location: {
        query: {
          appId,
        },
      },
      queryNotifiesList,
    } = this.props;
    const payload = {
      appId,
      pageNum: 1,
      pageSize: PAGE_SIZE,
    };
    queryNotifiesList(payload);
  }
  // 分页
  @autobind
  pageChangeHandle(page, pageSize) {
    const {
      location: {
        query: {
          appId,
        },
      },
      queryNotifiesList,
    } = this.props;
    const payload = {
      appId,
      pageNum: page,
      pageSize,
    };
    queryNotifiesList(payload);
  }

  // 生成表格标题列表
  @autobind
  getColumnsTitle() {
    const newTitleList = [...notifiCust];
    const custNameIndex = _.findIndex(newTitleList, o => o.key === KEY_CUSTNAME);
    const newEmpIndex = _.findIndex(newTitleList, o => o.key === KEY_POSITIONTYPE);
    newTitleList[custNameIndex].render = (text, record) => (
      <div>{text}({record.custId})</div>
    );
    newTitleList[newEmpIndex].render = text => (<div>{positionTypeArray[text].value}</div>);
    return newTitleList;
  }

  render() {
    const { notifiesData } = this.props;
    const { list = [], page = {} } = notifiesData;
    const tableTitleList = this.getColumnsTitle();
    // 分页
    const paginationOption = {
      current: page.curPageNum || 1,
      total: page.totalRecordNum || 0,
      pageSize: PAGE_SIZE,
      onChange: this.pageChangeHandle,
    };
    return (
      <div className={styles.notifiesWrapper}>
        <div className={styles.success}>
          <h2>通知提醒</h2>
          <h3 className={styles.title}>有以下客户划入您名下！</h3>
          <CommonTable
            data={list}
            titleList={tableTitleList}
          />
          <Pagination {...paginationOption} />
        </div>
      </div>
    );
  }
}

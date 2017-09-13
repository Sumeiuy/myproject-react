/**
 * @file premission/Home.js
 *  权限申请
 * @author honggaunqging
 */

import React, { PureComponent, PropTypes } from 'react';
import { Col } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter, routerRedux } from 'dva/router';
import classnames from 'classnames';
import Icon from '../../components/common/Icon';
import { constructPermissionPostBody } from '../../utils/helper';
import SplitPanel from '../../components/common/splitPanel/SplitPanel';
import PageHeader from '../../components/permission/PageHeader';
import PermissionList from '../../components/common/biz/CommonList';
import { permissionOptions } from '../../config';

import styles from './home.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const OMIT_ARRAY = ['currentId', 'isResetPageNum'];
// 状态字典
const STATUS_MAP = permissionOptions.stateOptions;
const mapStateToProps = state => ({
  list: state.permission.list,
});

const getDataFunction = loading => query => ({
  type: 'permission/getPermissionList',
  payload: query || {},
  loading,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  getPermissionList: getDataFunction(true),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Permission extends PureComponent {
  static propTypes = {
    list: PropTypes.object.isRequired,
    getPermissionList: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {
      isEmpty: true,
    };
  }

  componentWillMount() {
    const { getPermissionList, location: { query, query: {
      pageNum,
      pageSize,
     } } } = this.props;
    // 默认筛选条件
    getPermissionList(constructPermissionPostBody(query, pageNum || 1, pageSize || 10));
  }

  componentWillReceiveProps(nextProps) {
    const { location: { query: nextQuery = EMPTY_OBJECT } } = nextProps;
    const { location: { query: prevQuery = EMPTY_OBJECT }, getPermissionList } = this.props;
    const { isResetPageNum = 'N', pageNum, pageSize } = nextQuery;

    // 深比较值是否相等
    // url发生变化，检测是否改变了筛选条件
    if (!_.isEqual(prevQuery, nextQuery)) {
      if (!this.diffObject(prevQuery, nextQuery)) {
        // 只监测筛选条件是否变化
        getPermissionList(constructPermissionPostBody(
          nextQuery,
          isResetPageNum === 'Y' ? 1 : pageNum,
          isResetPageNum === 'Y' ? 10 : pageSize,
        ));
      }
    }
  }

  componentDidUpdate() {
    const { location: { pathname, query, query: { isResetPageNum } }, replace,
      list: { resultData = EMPTY_LIST } } = this.props;
    // 重置pageNum和pageSize
    if (isResetPageNum === 'Y') {
      replace({
        pathname,
        query: {
          ...query,
          isResetPageNum: 'N',
        },
      });
    }

    if (_.isEmpty(resultData)) {
      this.setState({ // eslint-disable-line
        isEmpty: true,
      });
    } else {
      this.setState({ // eslint-disable-line
        isEmpty: false,
      });
    }
  }

    /**
   * 检查部分属性是否相同
   * @param {*} prevQuery 前一次query
   * @param {*} nextQuery 后一次query
   */
  diffObject(prevQuery, nextQuery) {
    const prevQueryData = _.omit(prevQuery, OMIT_ARRAY);
    const nextQueryData = _.omit(nextQuery, OMIT_ARRAY);
    if (!_.isEqual(prevQueryData, nextQueryData)) {
      return false;
    }
    return true;
  }

  /**
   * 构造表格的列数据
   */
  @autobind
  constructTableColumns() {
    const columns = [{
      dataIndex: 'serialNumber.subType.title.empName.empId',
      width: '60%',
      render: (text, record) => (
        <div className="leftSection">
          <div className="id">
            <Icon type="save_blue" />
            <span className="serialNumber">编号{record.serialNumber || '无'}</span>
            <span className="subType">{record.subType || '无'}</span>
          </div>
          <div className="title">{record.title || '无'}</div>
          <div className="address">拟稿人：{record.empName}({record.empId})，{`${record.level2OrgName || ''}${record.level3OrgName || ''}` || '无'}</div>
        </div>
        ),
    }, {
      dataIndex: 'status.createTime.custName.custNumber',
      width: '40%',
      render: (text, record) => {
        // 当前行记录
        let statusClass;
        let statusLabel;
        if (record.status) {
          statusClass = classnames({
            'state-complete': record.status === STATUS_MAP[0].value,
            'state-resolve': record.status === STATUS_MAP[1].value,
            'state-close': record.status === STATUS_MAP[2].value,
          });
          statusLabel = STATUS_MAP.filter(item => item.value === record.status);
        }
        return (
          <div className="rightSection">
            <div className={statusClass}>{(!_.isEmpty(statusLabel) && statusLabel[0].label) || '无'}</div>
            <div className="date">{(record.createTime &&
              record.createTime.slice(0, 10)) || '无'}</div>
            <div className="cust">客户:{record.custName || '无'}({record.custNumber || '无'})</div>
          </div>
        );
      },
    }];

    return columns;
  }

  render() {
    const { list, location, replace } = this.props;
    const { isEmpty } = this.state;
    const columns = this.constructTableColumns();
    const topPanel = (
      <PageHeader
        location={location}
        replace={replace}
      />
    );
    const leftPanel = (
      <PermissionList
        list={list}
        replace={replace}
        location={location}
        columns={columns}
      />
    );

    const rightPanel = (
      <Col span="24" className={styles.rightSection}>
        wfdgfjhk
      </Col>
    );
    return (
      <div className={styles.premissionbox}>
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          leftListClassName="premissionList"
        />
      </div>
    );
  }
}


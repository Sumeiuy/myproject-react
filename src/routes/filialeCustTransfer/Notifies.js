/*
 * @Description: 批量划转的错误提醒页面
 * @Author: LiuJianShu
 * @Date: 2018-02-02 15:37:14
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2018-02-07 10:03:29
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import _ from 'lodash';
import Pagination from '../../components/common/Pagination';
import CommonTable from '../../components/common/biz/CommonTable';
import { request } from '../../config';
import { emp } from '../../helper';
import Barable from '../../decorators/selfBar';
import SetHeight from '../../decorators/setHeight';
import withRouter from '../../decorators/withRouter';
import Icon from '../../components/common/Icon';
import styles from './notifies.less';

const titleList = [
  {
    dataIndex: 'brokerNumber',
    key: 'brokerNumber',
    title: '经纪客户号',
  },
  {
    dataIndex: 'custName',
    key: 'custName',
    title: '客户名称',
  },
  {
    dataIndex: 'orgName',
    key: 'orgName',
    title: '服务营业部',
  },
];
// 通知提醒默认 ID
const DEFAULT_APPID = '20557';

const fetchDataFunction = (globalLoading, type, forceFull) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
  forceFull,
});

const mapStateToProps = state => ({
  // 批量划转的数据
  notifiesInfo: state.filialeCustTransfer.notifiesInfo,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 清空批量划转的数据
  getNotifiesInfo: fetchDataFunction(true, 'filialeCustTransfer/getNotifiesInfo', true),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
@SetHeight
export default class FilialeCustTransferNotifies extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 清空批量划转的数据
    getNotifiesInfo: PropTypes.func,
    notifiesInfo: PropTypes.object,
  }

  static defaultProps = {
    getNotifiesInfo: _.noop,
    notifiesInfo: {},
  }

  componentWillMount() {
    const {
      location: {
        query: {
          appId = DEFAULT_APPID,
        },
      },
      getNotifiesInfo,
    } = this.props;
    getNotifiesInfo({ appId });
  }

  // 分页
  @autobind
  pageChangeHandle(page, pageSize) {
    const {
      location: {
        query: {
          appId = DEFAULT_APPID,
        },
      },
      getNotifiesInfo,
    } = this.props;
    const payload = {
      appId,
      pageNum: page,
      pageSize,
    };
    getNotifiesInfo(payload);
  }

  render() {
    const {
      // 清空批量划转的数据
      notifiesInfo,
      notifiesInfo: { operateTime, successCount, totalCount, list, page },
      location: {
        query: {
          appId = DEFAULT_APPID,
        },
      },
    } = this.props;
    if (_.isEmpty(notifiesInfo)) {
      return null;
    }
    const isSuccess = _.isEmpty(list);
    // 分页
    const paginationOption = {
      current: !_.isEmpty(page) ? page.curPageNum : 0,
      total: !_.isEmpty(page) ? page.totalRecordNum : 0,
      pageSize: !_.isEmpty(page) ? page.pageSize : 0,
      onChange: this.pageChangeHandle,
    };
    return (
      <div className={styles.notifiesInfoWrapper}>
        {
          isSuccess ?
            <div className={styles.error}>
              <p>
                您于 {operateTime} 提交的批量导入客户服务关系调整数据处理失败，
                有 {successCount} 行客户校验通过，
                有 {totalCount - successCount} 行客户校验不通过！
              </p>
              <p>
                <a href={`${request.prefix}/excel/custTransfer/exportExcel?appId=${appId}&empId=${emp.getId()}`}>
                  <Icon type="xiazai1" />点击下载文件，在报错信息列查看报错信息
                </a>
              </p>
            </div>
          :
            <div className={styles.success}>
              <CommonTable
                data={list}
                titleList={titleList}
              />
              <Pagination {...paginationOption} />
            </div>
        }
      </div>
    );
  }
}

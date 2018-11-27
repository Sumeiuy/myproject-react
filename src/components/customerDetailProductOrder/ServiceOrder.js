/*
 * @Author: zhufeiyang
 * @Date: 2018-11-21 09:35:09
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-26 21:29:09
 * @Description: 服务订购
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import moment from 'moment';
import Table from '../common/table';
import { Button, Modal, Tooltip } from 'antd';
import IfTableWrap from '../common/IfTableWrap';
import logable from '../../../src/decorators/logable';
import ascSvg from '../../../static/svg/asc.svg';
import descSvg from '../../../static/svg/desc.svg';
import normalSvg from '../../../static/svg/normal.svg';
import IfWrap from '../common/biz/IfWrap';
import { SERVICE_ORDER_TABLE_COLUMNS, DATE_FORMATE_STR } from './config';
import { emp } from '../../helper';

import styles from './serviceOrder.less';

const NODATA_HINT = '客户暂无服务订购信息';
const warning = Modal.warning;

export default class ServiceOrder extends PureComponent {
  static propsType = {
    location: PropTypes.object.isRequired,
    serviceOrderData: PropTypes.object.isRequired,
    queryCustCanChangeCommission: PropTypes.func.isRequired,
    queryServiceOrderData: PropTypes.func.isRequired,
  }

  static contextTypes = {
    empInfo: PropTypes.object,
    push: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      sortType: 'desc',
      sortValue: 'startDt',
    };
  }

  componentDidMount() {
    this.getServiceOrderData();
  }

  getServiceOrderData(options) {
    const { sortType, sortValue } = this.state;
    const { location: { query: { custId } } } = this.props;
    if (custId) {
      this.props.queryServiceOrderData({
        custId,
        sortType,
        sortValue,
        pageNum: 1,
        pageSize: 5,
        ...options,
      });
    }
  }

  @autobind
  handlePageChange(current) {
    this.getServiceOrderData({
      pageNum: current,
    });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '服务订购排序', value: '$args[0]'},
  })
  handleSortChange(column) {
    const { sortType, sortValue } = this.state;
    if (sortValue === column.dataIndex) {
      this.setState({
        sortType: sortType === 'desc' ? 'asc' : 'desc',
      });
      this.getServiceOrderData({
        sortValue,
        sortType: sortType === 'desc' ? 'asc' : 'desc',
        pageNum: 1,
      });
    } else {
      this.setState({
        sortType: 'desc',
        sortValue: column.dataIndex,
      });
      this.getServiceOrderData({
        sortType: 'desc',
        sortValue: column.dataIndex,
        pageNum: 1,
      });
    }
  }

  @autobind
  @logable({
    type: 'ButtonClick',
    payload: { name: '佣金调整跳转' },
  })
  handleBtnClick() {
    const {
      location: { query: { custId } },
      queryCustCanChangeCommission,
    } = this.props;

    const defaultMessage = '网络错误，请稍后重试';

    queryCustCanChangeCommission({ custId }).then((resData) => {
      if(!resData || resData.flag) {
        warning({
          title: (resData && resData.msg) || defaultMessage,
          cancelText: '取消',
          okText: '确认',
        });
      } else {
        // 跳转到佣金调整页面
        this.context.push({
          pathname: '/commissionAdjustment',
          query: {
            // 佣金调整页面之前哪个sb写的，驼峰都不知道
            custid: custId,
          }
        });
      }
    });
  }

  transformColumnsData() {
    const { sortType, sortValue } = this.state;
    return _.map(SERVICE_ORDER_TABLE_COLUMNS, column => {
      const newColumn = {
        ...column,
      };
      // 日期格式特殊处理
      if (column.dataIndex === 'startDt' ||
        column.dataIndex === 'endDt') {
        // 默认排序图标
        let direImg = normalSvg;
        if (sortValue === column.dataIndex) {
          direImg = sortType === 'desc' ? descSvg : ascSvg;
        }
        newColumn.title = (
          <span
            className={styles.sortContent}
            onClick={() => this.handleSortChange(column)}
          >
            {column.title}
            <img src={direImg} className={styles.sortImg} alt="排序方向" />
          </span>
        );
        newColumn.render = (text) => {
          return text ? moment(text).format(DATE_FORMATE_STR) : '--';
        };
        return newColumn;
      }
      // 服务名称加tooltip处理, 溢出打点处理
      if (column.dataIndex === 'aliasName') {
        newColumn.render = (text) => {
          return text ?
            (
              <Tooltip title={text}>
                <span className={styles.serviceName}>{text}</span>
              </Tooltip>
            ) : '--';
        };
        return newColumn;
      }

      if (column.dataIndex === 'intrRate') {
        newColumn.className = styles.intrRateStyle;
        newColumn.render = (text) => {
          return <span className={styles.intrRateText}>{text || '--'}</span>;
        };
        return newColumn;
      }

      // 其他字段如果没有值，都显示'--'
      newColumn.render = (text) => {
        return text ? text : '--';
      };

      return newColumn;
    });
  }

  render() {
    const {
      serviceOrderData: {
        productList = [],
        page = {},
      },
    } = this.props;

    const {
      pageNum = 1,
      pageSize = 5,
      totalCount = 1,
    } = page;

    const pagination = {
      current: pageNum,
      pageSize,
      total: totalCount,
      onChange: this.handlePageChange,
    };

    // 如果当前的岗位是营业部服务岗，则显示佣金调整按钮
    const currentPstn = emp.getPstnDetail();
    const isShowBtn = currentPstn.postnTypeCD && currentPstn.postnTypeCD.indexOf('服务岗') > -1;
    return (
      <div className={styles.tradeOrderFlowWrap}>
      {/* 只有营业部服务岗才可以显示佣金调整按钮 */}
      <IfWrap isRender={isShowBtn || false}>
        <Button
          type="primary"
          ghost
          className={styles.btn}
          onClick={this.handleBtnClick}
        >
          佣金调整
        </Button>
      </IfWrap>
        <IfTableWrap isRender={!_.isEmpty(productList)} text={NODATA_HINT}>
        <Table
          className={styles.table}
          dataSource={productList}
          rowKey="name"
          pagination={pagination}
          rowClassName={styles.tableRow}
          columns={this.transformColumnsData()}
          indentSize={0}
        />
        </IfTableWrap>
      </div>
    );
  }
}

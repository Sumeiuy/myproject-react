/*
 * @Author: sunweibin
 * @Date: 2018-12-07 17:40:15
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-11 17:04:44
 * @description 交易流水资金变动
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import moment from 'moment';
import _ from 'lodash';
import {
  Table, Radio
} from 'antd';
import DateRangePick from 'lego-react-date/src';
import { SingleFilterWithSearch } from 'lego-react-filter/src';

import { data, number } from '../../../helper';
import logable from '../../../decorators/logable';
import Pagination from '../../common/Pagination';
import IfTableWrap from '../../common/IfTableWrap';
import ToolTip from '../../common/Tooltip';
import { getPage, displayEmpty } from './utils';

import {
  DEFAULT_START_DATE,
  DEFAULT_END_DATE,
  DATE_FORMATE_API,
  CAPITAL_CHANGE_COLUMNS,
  TODAY,
} from './config';
import { COMMON_DROPDOWN_STYLE } from '../config';

import styles from './tradeFlow.less';

const RadioGroup = Radio.Group;

// 六个月的天数
const SIX_MONTH_DAYS = 180;
// 六个月之前的那天日期
const BEFORE_SIX_MONTH_DAYS = moment().subtract(SIX_MONTH_DAYS - 1, 'days');

export default class CapitalChange extends PureComponent {
  static propTypes = {
    // 查询资金变动业务类型的下拉框数据
    queryBusnTypeList: PropTypes.func.isRequired,
    // 资金变动业务类别下拉选项列表
    busnType: PropTypes.object.isRequired,
    // 资金变动的表格数据
    capitalData: PropTypes.object.isRequired,
    // 查询资金变动数据
    queryCapitalTradeFlow: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    const startDate = DEFAULT_START_DATE.format(DATE_FORMATE_API);
    const endDate = DEFAULT_END_DATE.format(DATE_FORMATE_API);

    this.state = {
      // 查询起止时间
      startDate,
      endDate,
      // 账户类型
      accountType: 'normal',
      // 业务类别
      bussinessType: '',
    };
    // 获取资金变动交易流水表格的columns配置
    this.columns = this.getColumns(CAPITAL_CHANGE_COLUMNS);
  }

  componentDidMount() {
    // 初始化的时候，需要优先查一个当前账户类型下(即普通账户)的业务类别
    this.queryBusnTypeList();
    // 初始化查询数据
    this.queryCapitalTradeFlow();
  }

  // 当初始化时，需求要求日期组件需要有初始值
  // 开始值是六个月前，结束值是今天
  // 这是可筛选的最大范围
  @autobind
  getDefaultDate(startDate, endDate) {
    const defaultStartDate = startDate || BEFORE_SIX_MONTH_DAYS;
    const defaultEndDate = endDate || TODAY;
    return [
      defaultStartDate,
      defaultEndDate,
    ];
  }

  // 修改表格Column的配置
  @autobind
  getColumns(columns) {
    return _.map(columns, (column) => {
      const {
        isNumber,
        isAmount,
        dataIndex,
      } = column;
      if (isNumber || isAmount) {
        // 针对数量、数字金额进行特殊处理
        return this.updateMoneyColumn(column);
      }
      if (dataIndex === 'tradeChannel') {
        // 交易渠道
        return this.updateWordColumn(column, 6);
      }
      if (dataIndex === 'serviceIndication') {
        // 业务标志
        return this.updateWordColumn(column, 8);
      }
      return column;
    });
  }

  @autobind
  queryBusnTypeList() {
    const { busnType } = this.props;
    const { accountType } = this.state;
    if (_.isEmpty(busnType[accountType])) {
      // 如果相关账户类型下没有业务列表，再查询
      this.props.queryBusnTypeList({
        accountType,
        queryType: 'moneyChange',
      });
    }
  }

  // 查询资金变动交易流水
  @autobind
  queryCapitalTradeFlow(pageNum = 1) {
    this.props.queryCapitalTradeFlow({
      ...this.state,
      pageSize: 10,
      pageNum,
    });
  }

  // 修改数据金额所在的column
  @autobind
  updateMoneyColumn(column) {
    const { isNumber, isAmount, ...restColumn } = column;
    return {
      ...restColumn,
      render(text, record) {
        if (_.isNull(text) || record.flag) {
          return displayEmpty(text, record);
        }
        // 比如可用数量，不需要保留两位小数
        if (isAmount) {
          return number.thousandFormat(text, false);
        }
        // 数字金额等需要保留2位小数
        if (isNumber) {
          return number.thousandFormat(number.toFixed(text), false);
        }
        return text;
      },
    };
  }

  // 修改纯文本展示，超过length部分...并且悬浮显示全部信息
  @autobind
  updateWordColumn(column, length) {
    return {
      ...column,
      render(text, record) {
        if (_.isNull(text) || record.flag) {
          return displayEmpty(text, record);
        }
        const { isSubstr, value, origin } = data.dotdotdot(text, length);
        if (isSubstr) {
          return (
            <ToolTip title={origin}>{value}</ToolTip>
          );
        }
        return origin;
      },
    };
  }

  // 资金变动选择起止时间
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '查询日期',
      min: '$args[0]',
      max: '$args[1]',
    },
  })
  handleDateChange(date) {
    const [startDate, endDate] = date.value;
    const { capitalStartDate, capitalEndDate } = this.state;
    // 如果时间没有发生改变, 直接return
    if (startDate === capitalStartDate
      && endDate === capitalEndDate) {
      return;
    }
    this.setState({
      startDate,
      endDate,
    }, this.queryCapitalTradeFlow);
  }

  // 资金变动选择帐户类型,因为资金流水的业务类别和帐户类型有联动关系，这里需要再重新获取业务类别数据
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '账户类型',
      value: '$args[0].target.value'
    },
  })
  handleAccountTypeRadioChange(e) {
    const { value } = e.target;
    this.setState({
      accountType: value,
      bussinessType: '',
    }, () => {
      this.queryBusnTypeList();
      this.queryCapitalTradeFlow();
    });
  }

  // 资金变动选择业务类别
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '业务类别',
      value: '$args[0].value',
    },
  })
  handleFilterCapitalBussinessType(current) {
    this.setState({
      bussinessType: current.value,
    }, this.queryCapitalTradeFlow);
  }

  // 切换资金变动页码
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '切换资金变动页码',
      value: '$args[0]'
    },
  })
  handleCapitalPageChange(pageNum) {
    this.queryCapitalTradeFlow(pageNum);
  }

  render() {
    const {
      startDate,
      endDate,
      accountType,
      bussinessType,
    } = this.state;
    const {
      busnType,
      capitalData: {
        list = [],
        page = {},
      },
    } = this.props;
    // 分页器props
    const pageProps = getPage(page);
    const filterDate = this.getDefaultDate(startDate, endDate);
    // 资金变动表格信息 ,没有数据时展示占位图标，有数据但少于十条，用空白行补全；
    const capitalData = data.padEmptyDataForList(list);

    return (
      <div className={styles.tabPaneWrap}>
        <div className={`${styles.header} clearfix`}>
          <div className={styles.filterArea}>
            <DateRangePick
              type="date"
              filterId="filterDate"
              filterName="查询日期"
              filterValue={filterDate}
              onChange={this.handleDateChange}
              disabledRange={SIX_MONTH_DAYS}
            />
          </div>
          <div className={styles.filterArea}>
            <span className={styles.label}>账户类型:</span>
            <RadioGroup
              onChange={this.handleAccountTypeRadioChange}
              value={accountType}
              className={styles.radioGroup}
            >
              <Radio className={styles.accountTypeRadio} value="normal">普通</Radio>
              <Radio className={styles.accountTypeRadio} value="credit">信用</Radio>
              <Radio className={styles.accountTypeRadio} value="option">期权</Radio>
            </RadioGroup>
          </div>
          <div className={styles.filterArea}>
            <SingleFilterWithSearch
              filterName="业务类别"
              filterId="bussinessType"
              value={bussinessType}
              data={busnType[accountType]}
              placeholder="请输入业务类别"
              dropdownStyle={COMMON_DROPDOWN_STYLE}
              onChange={this.handleFilterCapitalBussinessType}
            />
          </div>
        </div>
        <IfTableWrap isRender={!_.isEmpty(list)} text="客户暂无资金变动信息">
          <div className={styles.body}>
            <Table
              pagination={false}
              dataSource={capitalData}
              columns={this.columns}
              className={styles.tradeFlowTable}
            />
          </div>
          <Pagination
            {...pageProps}
            onChange={this.handleCapitalPageChange}
          />
        </IfTableWrap>
      </div>
    );
  }
}

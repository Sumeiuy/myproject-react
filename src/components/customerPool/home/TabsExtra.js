/**
 * @file components/customerPool/home/TabsExtra.js
 *  Tabs的extra组件
 * @author zhangjunli
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import { time } from '../../../helper';
import { optionsMap, request } from '../../../config';
import Icon from '../../common/Icon';
import CustRange from '../common/CustRange';
import styles from './tabsExtra.less';
import logable from '../../../decorators/logable';

const Option = Select.Option;
const noop = _.noop;
const falseValue = false;

export default class TabsExtra extends PureComponent {
  static propTypes = {
    custRange: PropTypes.array,
    replace: PropTypes.func.isRequired,
    updateQueryState: PropTypes.func,
    collectCustRange: PropTypes.func.isRequired,
    cycle: PropTypes.array,
    expandAll: PropTypes.bool,
    selectValue: PropTypes.string,
    location: PropTypes.object.isRequired,
    orgId: PropTypes.string,
    isDown: PropTypes.bool,
    iconType: PropTypes.string,
    exportExcel: PropTypes.func,
    exportOrgId: PropTypes.string,
    isPerformace: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    custRange: [],
    cycle: [],
    expandAll: false,
    selectValue: '',
    orgId: '',
    isDown: false,
    iconType: 'kehu',
    updateQueryState: noop,
    exportExcel: noop,
    exportOrgId: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      begin: '',
      end: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { selectValue: prevSelectValue } = this.props;
    const { selectValue: nextSelectValue, isPerformace } = nextProps;

    if (prevSelectValue !== nextSelectValue) {
      const { begin, end } = this.getBeginAndEndTime(nextSelectValue, isPerformace);
      this.setState({
        begin,
        end,
      });
    }
  }

  @autobind
  getBeginAndEndTime(value, isPerformace) {
    const { historyTime, customerPoolTimeSelect } = optionsMap;
    let nowDuration;
    let currentSelect;
    if (isPerformace) {
      nowDuration = time.getDurationString(value);
    } else {
      currentSelect = _.find(historyTime,
        itemData => itemData.name === _.find(customerPoolTimeSelect,
          item => item.key === value).name) || {};
      nowDuration = time.getDurationString(currentSelect.key);
    }
    const begin = nowDuration.begin;
    const end = nowDuration.end;
    return {
      begin,
      end,
    };
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '时间周期',
      value: '$args[0]',
    },
  })
  handleChange(value) {
    const { updateQueryState, isPerformace } = this.props;
    const { begin, end } = this.getBeginAndEndTime(value, isPerformace);
    const params = isPerformace ? {
      begin,
      end,
      performanceCycleSelect: value,
    } : {
      begin,
      end,
      cycleSelect: value,
    };
    updateQueryState(params);
    // 记录下当前选中的timeSelect
    this.setState({
      begin,
      end,
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '机构树',
      value: '$args[0].orgId',
    },
  })
  handleCustRange(obj) {
    this.props.updateQueryState(obj);
  }

  // 空方法，用于日志上传
  @logable({ type: 'Click', payload: { name: '导出' } })
  handleDownloadClick() {}

  render() {
    const {
      custRange,
      replace,
      collectCustRange,
      cycle = [],
      expandAll,
      selectValue,
      location,
      orgId,
      isDown = false,
      iconType,
      exportExcel,
      isPerformace,
    } = this.props;
    const { begin, end } = this.state;
    const urlParams = exportExcel();
    return (
      <div className={styles.timeBox}>
        <div className={styles.icon}>
          <Icon type={iconType || 'kehu'} />
        </div>
        <div className={styles.custRangeForCust}>
          {
            !_.isEmpty(custRange)
              ? (
                <CustRange
                  defaultFirst
                  orgId={orgId}
                  custRange={custRange}
                  location={location}
                  replace={replace}
                  updateQueryState={this.handleCustRange}
                  beginTime={begin}
                  endTime={end}
                  collectData={collectCustRange}
                  expandAll={expandAll}
                  isDown={isDown}
                />
              )
              : (
                <Select
                  defaultValue="暂无数据"
                >
                  <Option value="暂无数据">暂无数据</Option>
                </Select>
              )
          }
        </div>
        {/**
         * 后台性能问题，暂时隐藏导出按钮
         */}
        {
          falseValue ? <div className={styles.separateLine} /> : null
        }
        {!isDown
          ? (
            <div className={styles.timeCycle}>
              <div className={styles.icon}>
                <Icon type="rili" />
              </div>
              <div className={styles.select}>
                <Select
                  value={selectValue}
                  onChange={this.handleChange}
                >
                  {_.map(cycle,
                    (item) => {
                      const option = !isPerformace
                        ? <Option key={item.key} value={item.key}>{item.value}</Option>
                        : <Option key={item.dateKey} value={item.dateKey}>{item.name}</Option>;
                      return option;
                    })
                  }
                </Select>
              </div>
            </div>
          )
          : (
            <div>
              {
              falseValue
                ? (
                  <div className={styles.downFiles}>
                    <div className={styles.iconDown}>
                      <Icon type="xiazai" />
                    </div>
                    <div className={styles.downLoad}>
                      <a
                        onClick={this.handleDownloadClick}
                        href={`${request.prefix}/excel/custlist/exportExcel?orgId=${urlParams.orgId}&missionName=${urlParams.missionName}&missionId=${urlParams.missionId}&serviceTips=${urlParams.serviceTips}&servicePolicy=${urlParams.servicePolicy}`}
                      >
                      导出
                      </a>
                    </div>
                  </div>
                ) : null
            }
            </div>
          )
        }
      </div>
    );
  }
}

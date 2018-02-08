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
import classnames from 'classnames';

import { time } from '../../../helper';
import { optionsMap, request } from '../../../config';
import Icon from '../../common/Icon';
import CustRange from '../common/CustRange';
import styles from './tabsExtra.less';

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
      isDown: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { selectValue: prevSelectValue } = this.props;
    const { selectValue: nextSelectValue } = nextProps;

    if (prevSelectValue !== nextSelectValue) {
      const { begin, end } = this.getBeginAndEndTime(nextSelectValue);
      this.setState({
        begin,
        end,
      });
    }
  }

  @autobind
  getBeginAndEndTime(value) {
    const { historyTime, customerPoolTimeSelect } = optionsMap;
    const currentSelect = _.find(historyTime, itemData =>
      itemData.name === _.find(customerPoolTimeSelect, item =>
        item.key === value).name) || {};
    const nowDuration = time.getDurationString(currentSelect.key);
    const begin = nowDuration.begin;
    const end = nowDuration.end;
    return {
      begin,
      end,
    };
  }

  @autobind
  handleChange(value) {
    const { begin, end } = this.getBeginAndEndTime(value);
    const { updateQueryState } = this.props;
    updateQueryState({
      cycleSelect: value,
      begin,
      end,
    });
    // 记录下当前选中的timeSelect
    this.setState({
      cycleSelect: value,
      begin,
      end,
    });
  }


  render() {
    const {
      custRange,
      replace,
      updateQueryState,
      collectCustRange,
      cycle = [],
      expandAll,
      selectValue,
      location,
      orgId,
      isDown = false,
      iconType,
      exportExcel,
    } = this.props;
    const { begin, end } = this.state;
    const urlParams = exportExcel();
    return (
      <div className={styles.timeBox}>
        <div className={classnames(styles.icon, styles.kehuIcon)}>
          <Icon type={iconType || 'kehu'} />
        </div>
        <div>
          {
            !_.isEmpty(custRange) ?
              <CustRange
                defaultFirst
                orgId={orgId}
                custRange={custRange}
                location={location}
                replace={replace}
                updateQueryState={updateQueryState}
                beginTime={begin}
                endTime={end}
                collectData={collectCustRange}
                expandAll={expandAll}
                isDown={isDown}
              /> :
              <Select
                defaultValue="暂无数据"
              >
                <Option value="暂无数据">暂无数据</Option>
              </Select>
          }
        </div>
        {/**
         * 后台性能问题，暂时隐藏导出按钮
         */}
        {
          falseValue ? <div className={styles.separateLine} /> : null
        }
        {!isDown ?
          <div>
            <div className={styles.icon}>
              <Icon type="rili" />
            </div>
            <div className={styles.select}>
              <Select
                style={{ width: 60 }}
                value={selectValue}
                onChange={this.handleChange}
              >
                {_.map(cycle, item =>
                  <Option key={item.key} value={item.key}>{item.value}</Option>)}
              </Select>
            </div>
          </div> :
          <div>
            {
              falseValue ?
                <div className={styles.downFiles}>
                  <div className={styles.iconDown}>
                    <Icon type="xiazai" />
                  </div>
                  <div className={styles.downLoad}>
                    <a
                      href={`${request.prefix}/excel/custlist/exportExcel?orgId=${urlParams.orgId}&missionName=${urlParams.missionName}&missionId=${urlParams.missionId}&serviceTips=${urlParams.serviceTips}&servicePolicy=${urlParams.servicePolicy}`}
                    >导出</a>
                  </div>
                </div> : null
            }
          </div>
        }
      </div>
    );
  }
}

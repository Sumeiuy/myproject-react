/**
 * @file components/customerPool/home/TabsExtra.js
 *  Tabs的extra组件
 * @author zhangjunli
 */
import React, { PropTypes, PureComponent } from 'react';
import { Select } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import { getDurationString } from '../../../utils/helper';
import { optionsMap } from '../../../config';
import Icon from '../../common/Icon';
import CustRange from '../common/CustRange';
import styles from './tabsExtra.less';

const Option = Select.Option;
export default class TabsExtra extends PureComponent {
  static propTypes = {
    custRange: PropTypes.array,
    replace: PropTypes.func.isRequired,
    updateQueryState: PropTypes.func.isRequired,
    collectCustRange: PropTypes.func.isRequired,
    cycle: PropTypes.array,
    expandAll: PropTypes.bool,
    selectValue: PropTypes.string,
    location: PropTypes.object.isRequired,
    orgId: PropTypes.string,
  }

  static defaultProps = {
    custRange: [],
    cycle: [],
    expandAll: false,
    selectValue: '',
    orgId: '',
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
    const nowDuration = getDurationString(currentSelect.key);
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
      cycle,
      expandAll,
      selectValue,
      location,
      orgId,
    } = this.props;
    const { begin, end } = this.state;
    return (
      <div className={styles.timeBox}>
        <Icon type="kehu" />
        {
          !_.isEmpty(custRange) ?
            <CustRange
              orgId={orgId}
              custRange={custRange}
              location={location}
              replace={replace}
              updateQueryState={updateQueryState}
              beginTime={begin}
              endTime={end}
              collectData={collectCustRange}
              expandAll={expandAll}
            /> :
            <Select
              defaultValue="暂无数据"
              key="seletTreeNull"
            >
              <Option value="暂无数据">暂无数据</Option>
            </Select>
        }
        <i className={styles.bd} />
        <Icon type="rili" />
        <Select
          style={{ width: 60 }}
          value={selectValue}
          onChange={this.handleChange}
          key="dateSelect"
        >
          {cycle.map(item =>
            <Option key={item.key} value={item.key}>{item.value}</Option>)}
        </Select>
      </div>
    );
  }
}

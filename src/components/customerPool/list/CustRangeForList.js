/**
 * @file invest/CustRangeForList.js
 *  客户范围组件
 * @author wangjunjun
 */

import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Select } from 'antd';

import CustRange from '../common/CustRange';
import Icon from '../../common/Icon';

import styles from './custRangeForList.less';

let KEYCOUNT = 0;

export default class CustRangeForList extends PureComponent {
  static propTypes = {
    source: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    collectCustRange: PropTypes.func,
    updateQueryState: PropTypes.func.isRequired,
    // custRange: PropTypes.array.isRequired,
    createCustRange: PropTypes.array.isRequired,
    expandAll: PropTypes.bool,
    orgId: PropTypes.string,
    cycle: PropTypes.array,
    selectValue: PropTypes.string,
  }

  static defaultProps = {
    expandAll: false,
    orgId: null,
    collectCustRange: () => { },
    selectValue: '',
    cycle: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      key: KEYCOUNT,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { createCustRange: preCustRange } = this.props;
    const { createCustRange: nextCustRange } = nextProps;
    if (!_.isEqual(preCustRange, nextCustRange)) {
      this.setState({
        key: ++KEYCOUNT,
      });
    }
  }

  @autobind
  handleChange(value) {
    const { updateQueryState } = this.props;
    updateQueryState({
      cycleSelect: value,
    });
  }

  render() {
    const {
      source,
      orgId,
      createCustRange,
      location,
      replace,
      updateQueryState,
      collectCustRange,
      expandAll,
      selectValue,
      cycle,
    } = this.props;
    console.log('selectValue>>>', selectValue);
    let custRangeEle = null;
    let timeEle = null;
    const { key } = this.state;
    if (_.includes(['search', 'tag', 'association', 'custIndicator', 'numOfCustOpened'], source)) {
      custRangeEle = (<div className={styles.item}>
        <Icon type="kehu" />
        {
          !_.isEmpty(createCustRange) ?
            <CustRange
              orgId={orgId}
              custRange={createCustRange}
              location={location}
              replace={replace}
              updateQueryState={updateQueryState}
              collectData={collectCustRange}
              expandAll={expandAll}
              key={`selectTree${key}`}
            />
          :
            <Select
              style={{ width: 120, color: '#CCC' }}
              defaultValue="暂无数据"
              key="seletTreeNull"
            >
              <Option value="暂无数据">暂无数据</Option>
            </Select>
        }
      </div>);
    }
    if (_.includes(['custIndicator', 'numOfCustOpened'], source)) {
      timeEle = (
        <div className={styles.item}>
          <i className={styles.bd} />
          <Icon type="rili" />
          <Select
            style={{ width: 60 }}
            value={selectValue}
            onChange={this.handleChange}
            key="dateSelect"
          >
            {cycle.map(item =>
              <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>)}
          </Select>
        </div>
      );
    }
    return (
      <div className="custRange">
        {custRangeEle}
        {timeEle}
      </div>
    );
  }
}

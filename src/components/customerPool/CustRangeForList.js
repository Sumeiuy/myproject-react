/**
 * @file invest/CustRangeForList.js
 *  客户范围组件
 * @author wangjunjun
 */

import React, { PureComponent, PropTypes } from 'react';
import _ from 'lodash';
import { Select } from 'antd';

import CustRange from './CustRange';
import Icon from '../../components/common/Icon';

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
  }

  static defaultProps = {
    expandAll: false,
    orgId: null,
    collectCustRange: () => { },
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
    } = this.props;
    let rtnEle = '';
    const { key } = this.state;
    if (_.includes(['search', 'tag', 'association'], source)) {
      rtnEle = (<div className="custRange">
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
    return rtnEle;
  }
}

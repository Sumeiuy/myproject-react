/**
 * @fileOverview components/pageCommon/PageHeader.js
 * @author sunweibin
 * @description 用于业绩页面头部区域模块
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Row, Radio } from 'antd';

import { getDurationString } from '../../utils/helper';
import CustRange from './CustRange2';
import BoardSelect from './BoardSelect';
// 选择项字典
import { optionsMap } from '../../config';
import styles from './PageHeader.less';


// 需要用到的常量
// RadioButton
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

// 时间筛选条件
const timeOptions = optionsMap.time;
// 渲染3个头部期间Radio
const timeRadios = timeOptions.map((item, index) => {
  const timeIndex = `Timeradio${index}`;
  return React.createElement(RadioButton, { key: timeIndex, value: `${item.key}` }, `${item.name}`);
});


export default class PageHeader extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    selectDefault: PropTypes.string.isRequired,
    custRange: PropTypes.array,
  }

  static defaultProps = {
    custRange: [],
  }

  constructor(props) {
    super(props);
    const { location: { query } } = this.props;
    const value = query.cycleType || 'month';
    const obj = getDurationString(value);
    this.state = {
      ...obj,
    };
  }

   // 期间变化
  @autobind
  handleDurationChange(e) {
    const value = e.target.value;
    const obj = getDurationString(value);
    const { replace, location: { query } } = this.props;
    this.setState({
      ...obj,
    });
    // 需要改变query中的查询变量
    replace({
      pathname: '/invest',
      query: {
        ...query,
        begin: obj.begin,
        end: obj.end,
        cycleType: value,
        page: 1,
      },
    });
  }

  render() {
    const duration = this.state;
    const { replace, custRange, location, selectDefault } = this.props;

    return (
      <div className="reportHeader">
        <Row type="flex" justify="start" align="middle">
          <div className="reportName">
            <BoardSelect
              location={location}
              selectDefault={selectDefault}
            />
          </div>
          <div className={styles.reportHeaderRight}>
            <div className={styles.dateFilter}>{duration.durationStr}</div>
            <RadioGroup
              defaultValue={duration.cycleType || 'month'}
              onChange={this.handleDurationChange}
            >
              {timeRadios}
            </RadioGroup>
            <div className={styles.vSplit} />
            {/* 营业地址选择项 */}
            <CustRange
              custRange={custRange}
              location={location}
              replace={replace}
            />
          </div>
        </Row>
      </div>
    );
  }
}

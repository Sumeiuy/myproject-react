/**
 * @file components/customerPool/common/ProgressList.js
 *  彩色的，长条形进度条列表,row如下图：-----代表进度条
 * xxxxx         50
 * ----------------
 * @author zhangjunli
 */
import React, { PropTypes, PureComponent } from 'react';
import _ from 'lodash';
import { Progress } from 'antd';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import { linkTo } from './homeIndicators_';

import styles from './progressList.less';

// 新增客户传给列表页的参数
const newCustomerLinkIdx = ['817001', '817002', '817003', '817004'];

export default class ProgressList extends PureComponent {

  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    cycle: PropTypes.array,
    push: PropTypes.func,
    location: PropTypes.object,
    empInfo: PropTypes.object,
  }

  static defaultProps = {
    cycle: [],
    location: {},
    push: () => {},
    empInfo: {},
  }

  componentDidMount() {
    this.setProgressColor();
  }

  componentDidUpdate() {
    this.setProgressColor();
  }

  // 为每个progress设置颜色
  @autobind
  setProgressColor() {
    const { dataSource, location } = this.props;
    if (_.isEmpty(dataSource)) {
      return;
    }
    dataSource.forEach(
      (item, index) => {
        // 拿到容纳了progress的div
        const rowElem = this[`row${index}`];
        if (rowElem && !_.isEmpty(location)) {
          // 支持下钻，鼠标为小手形状
          rowElem.style.cursor = 'pointer';
        }
        // progress 组件
        const antProgressElem = rowElem.childNodes[1];
        // antProgressElem内部子节点div, div的内部节点是 outer
        const antProgressOuter = antProgressElem.childNodes[0].childNodes[0];
        // outer 内部子节点 inner
        const antProgressInner = antProgressOuter.childNodes[0];
        // inner 内部子节点 bg
        const antProgressBg = antProgressInner.childNodes[0];
        if (antProgressBg) {
          antProgressBg.style.backgroundColor = item.color;
        }
      },
    );
  }
/*

*/
  @autobind
  handleClick(index, item) {
    const { cycle, push, location, empInfo } = this.props;
    const bname = this.transformName(item.cust);
    const param = {
      source: 'custIndicator',
      type: 'customerType',
      value: newCustomerLinkIdx[index],  // 提供给列表页传给后端的customerType的值
      bname,
      cycle,
      push,
      location,
      empInfo,
    };
    linkTo(param);
  }

  // 根据现有的name返回列表页所需要展示的 name文案
  @autobind
  transformName(name) {
    switch (name) {
      case '净新增有效户':
        return '净新增有效下钻客户';
      case '净新增非零售客户':
        return '净新增非零售下钻客户';
      case '净新增高端产品户':
        return '净新增高端产品下钻客户';
      default:
        return name;
    }
  }

  @autobind
  renderList() {
    // const { cycle, push, location, empInfo } = this.props;
    const { dataSource, location } = this.props;
    // 动态设置progress间距
    const length = dataSource.length;
    const style = { marginTop: `${(172 - (length * 25)) / (length + 1)}px` };

    return dataSource.map(
      (item, index) => {
        const rowId = `row${index}`;
        return (
          <div
            className={styles.row} style={style}
            key={item.id}
            onClick={() => { this.handleClick(index, item); }}
            ref={ref => (this[rowId] = ref)}
          >
            <div className={styles.intro}>
              <div className={styles.title}>{item.cust}</div>
              <div
                className={classnames(
                  styles.count,
                  { [styles.supportClick]: !_.isEmpty(location) },
                )}
              >{item.thousandsCount}</div>
            </div>
            <Progress
              percent={(item.percent < 0 ? 0 : item.percent)}
              strokeWidth={6}
              showInfo={false}
            />
          </div>
        );
      },
    );
  }

  render() {
    return (
      <div className={styles.container}>
        {this.renderList()}
      </div>
    );
  }
}

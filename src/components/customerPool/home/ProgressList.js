/**
 * @file components/customerPool/common/ProgressList.js
 *  彩色的，长条形进度条列表,row如下图：-----代表进度条
 * xxxxx         50
 * ----------------
 * @author zhangjunli
 */
import React, { PropTypes, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Progress } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { linkTo } from './HomeIndicators';

import styles from './progressList.less';

export default class ProgressList extends PureComponent {

  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    cycle: PropTypes.array,
    push: PropTypes.func,
    location: PropTypes.object,
  }

  static defaultProps = {
    cycle: [],
    location: {},
    push: () => {},
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
        // row 组件
        const rowElem = ReactDOM.findDOMNode(this[`row${index}`]);   // eslint-disable-line
        if (rowElem && !_.isEmpty(location)) {
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

  renderList(dataSource) {
    const { cycle, push, location } = this.props;
    // 动态设置progress间距
    const length = dataSource.length;
    const style = { marginTop: `${(172 - (length * 25)) / (length + 1)}px` };

    return dataSource.map(
      (item, index) => {
        const rowId = `row${index}`;
        const param = {
          value: (index + 1),  // 提供给列表页传给后端的customerType的值
          bname: item.cust,
          cycle,
          push,
          location,
        };
        return (
          <div
            className={styles.row} style={style}
            key={item.id}
            onClick={() => { linkTo(param); }}
            ref={ref => (this[rowId] = ref)}
          >
            <div className={styles.intro}>
              <div className={styles.title}>{item.cust}</div>
              <div className={styles.count}>{item.thousandsCount}</div>
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
    const { dataSource } = this.props;
    return (
      <div className={styles.container}>
        {this.renderList(dataSource)}
      </div>
    );
  }
}

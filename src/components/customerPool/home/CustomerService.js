/**
 * @file components/customerPool/CustomerService.js
 *  客户池-客户服务
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import IECharts from '../../IECharts';
import styles from './customerService.less';

export default class CustomerService extends PureComponent {

  static propTypes = {
    data: PropTypes.array,
  }

  static defaultProps = {
    data: [],
  }

  // 创建option
  getOption(item, colors) {
    const dataArray = this.formatterData(item);
    const options = {
      color: colors,
      series: [{
        type: 'pie',
        radius: ['70%', '83%'], // 这里是控制环形内半径和外半径
        avoidLabelOverlap: false,
        hoverAnimation: false, // hover区域是否放大
        data: dataArray,
        label: {
          normal: { show: false, position: 'center' },
        },
      }],
    };
    return options;
  }

  formatterData(item) {
    const { value } = item;
    // 数据是否为空
    const isEmpty = value === null;
    // 是否需要 *100(临时加，因现请求回来的数据为null)
    const isNeed = _.toNumber(value) < 1;
    const finish = isNeed ? _.toNumber(value) * 100 : _.toNumber(value);
    const unfinished = 100 - finish;
    const finishedName = isEmpty ? '' : `${parseFloat(finish).toFixed(0)}%`;
    const unfinishedName = isEmpty ? '暂无数据' : `${parseFloat(unfinished).toFixed(0)}%`;
    const fontSize = isEmpty ? '16' : '20';
    const textStyle = { show: true, fontSize, fontWeight: 'bold', fontFamily: 'Microsoft YaHei' };
    const finishLabel = isEmpty ? {} : {
      label: {
        normal: { ...textStyle, position: 'center' },
        emphasis: { ...textStyle },
      },
    };
    const unfinishLabel = isEmpty ? (
      { label: { normal: { ...textStyle, position: 'center' } } }
    ) : ({
      label: {
        emphasis: {
          ...textStyle,
          backgroundColor: '#fff', // 此处添加背景色，是为了盖着下方的文字
          padding: 6, // 增加背景的宽 高
        },
      },
    });

    return [
      { value: finish, name: finishedName, ...finishLabel },
      { value: unfinished, name: unfinishedName, ...unfinishLabel },
    ];
  }

  render() {
    const { data } = this.props;
    const motOption = this.getOption(_.head(data), ['#33D0E2', '#d6d6d6']);
    const serviceOption = this.getOption(_.last(data), ['#6b87d8', '#d6d6d6']);

    return (
      <div className={styles.row}>
        <div className={classnames(styles.column, styles.firstColumn)}>
          <IECharts
            option={motOption}
            resizable
            style={{
              height: '115px',
            }}
          />
          <div className={styles.text} title={_.head(data).name || ''}>{_.head(data).name || '--'}</div>
        </div>
        <div className={classnames(styles.column, styles.secondColumn)}>
          <IECharts
            option={serviceOption}
            resizable
            style={{
              height: '115px',
            }}
          />
          <div className={styles.text} title={_.last(data).name || ''}>{_.last(data).name || '--'}</div>
        </div>
      </div>
    );
  }
}


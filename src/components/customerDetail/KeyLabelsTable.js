/*
 * @Author: sunweibin
 * @Date: 2018-10-16 15:53:07
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-30 17:59:15
 * @description 重点标签更多中展示的表格
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Popover } from 'antd';

import Pagination from '../common/Pagination';
import Icon from '../common/Icon';

import styles from './keyLablesTable.less';

export default class KeyLabelsTable extends Component {
  static propTypes = {
    labels: PropTypes.array,
    placeholder: PropTypes.string,
  }

  static defaultProps = {
    labels: [],
    placeholder: '暂无标签数据',
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { labels } = nextProps;
    const { prevLabels } = prevState;
    if (labels !== prevLabels) {
      return {
        labelChunks: _.chunk(labels, 20),
        prevLabels: labels,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    // 前端进行分页，将所有的数据按照每一页20条数据切割
    const chunks = _.chunk(props.labels, 20);
    this.state = {
      labelChunks: chunks,
      // 当前页码
      current: 1,
      // prevLabels
      prevLabels: props.labels,
    };
  }
  // 切换页面
  @autobind
  handlePageChange(current ) {
    this.setState({ current });
  }

  // 渲染每一个label
  @autobind
  renderLable(label) {
    const { name, desc, id } = label;
    return(
      <div className={styles.item}>
        <Popover
          key={id}
          overlayClassName={styles.labelPopover}
          content={desc}
          title={name}
        >
          {name}
        </Popover>
      </div>
    );
  }

  @autobind
  renderEmptyDom() {
    return (
      <div className={styles.body}>
        <div className={styles.noRadarData}>
          <div className={styles.noDataHead}>
            <Icon type="zanwushuju" className={styles.noDataIcon} />
          </div>
          <div className={styles.noDataTip}>{this.props.placeholder}</div>
        </div>
      </div>
    );
  }

  render() {
    const { labels } = this.props;
    const { current, labelChunks } = this.state;
    const total = _.size(labels);
    if (_.isEmpty(labels)) {
      return this.renderEmptyDom();
    }
    return (
      <div>
        <div className={styles.container}>
          {
            _.map(labelChunks[current - 1], this.renderLable)
          }
        </div>
        <Pagination
          current={current}
          total={total}
          pageSize={20}
          onChange={this.handlePageChange}
        />
      </div>
    );
  }
}

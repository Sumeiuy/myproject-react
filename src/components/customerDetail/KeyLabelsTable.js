/*
 * @Author: sunweibin
 * @Date: 2018-10-16 15:53:07
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-16 16:49:45
 * @description 重点标签更多中展示的表格
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Popover } from 'antd';

import Pagination from '../common/Pagination';

import styles from './keyLablesTable.less';

export default class KeyLabelsTable extends Component {
  static propTypes = {
    labels: PropTypes.array,
  }

  static defaultProps = {
    labels: [],
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
      // 当前页码下的标签数据数组,当前第一页
      currentLabels: chunks[0],
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
      <Popover key={id} overlayClassName={styles.labelPopover} content={desc} title={name}>
        <div className={styles.item}>{name}</div>
      </Popover>
    );
  }

  render() {
    const { labels } = this.props;
    const { current, labelChunks } = this.state;
    const total = _.size(labels);
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

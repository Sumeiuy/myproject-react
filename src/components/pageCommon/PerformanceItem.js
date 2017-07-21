/**
 * @file invest/PerformanceItem.js
 * @author LiuJianShu
 */
import React, { PropTypes, PureComponent } from 'react';
import { Row, Col, Pagination } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import Item from './item';
import styles from './PerformanceItem.less';

const pageSize = 8;

export default class PerformanceItem extends PureComponent {

  static propTypes = {
    data: PropTypes.array,
  }

  static defaultProps = {
    data: [],
  }

  constructor(props) {
    super(props);
    const { data } = props;
    console.warn('data', data);
    // 取出第一页的数据
    const firstPage = _.slice(data, 0, pageSize);
    this.state = {
      totalLength: data.length,
      performanceData: firstPage,
    };
  }

  @autobind
  onChange(pageNumber) {
    const { data } = this.props;
    // 计算出开始截取的索引位置
    const beginIndex = (pageNumber - 1) * pageSize;
    // 计算出结束截取的索引位置
    const endIndex = pageNumber * pageSize;
    // 取出下一页的数据
    const newPage = _.slice(data, beginIndex, endIndex);
    // 更新 state
    this.setState({
      performanceData: newPage,
    });
  }

  render() {
    const { performanceData, totalLength } = this.state;
    console.warn();
    return (
      <div>
        <div className={styles.titleText}>总量指标</div>
        <div className={styles.items}>
          <Row>
            <Pagination
              simple
              defaultCurrent={1}
              defaultPageSize={pageSize}
              total={totalLength}
              onChange={this.onChange}
            />
            {
              performanceData.map(item => (
                <a className={styles.hover} key={`${item.key}Key`}>
                  <Col span={3} className={styles.itemWrap}>
                    <Item data={item} />
                  </Col>
                </a>
              ))
            }
          </Row>
        </div>
      </div>
    );
  }
}

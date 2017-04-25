/**
 * @file example/showItem.js
 * @author liujianshu
 */
import React, { PropTypes, PureComponent } from 'react';
import { Row, Col } from 'antd';
import Item from './item';
import styles from './PerformanceItem.less';

export default class PerformanceItem extends PureComponent {

  static propTypes = {
    data: PropTypes.array,
  }

  static defaultProps = {
    data: [],
  }

  render() {
    const { data } = this.props;
    // 数据的长度
    const length = data.length;
    // 数据的行数
    const lines = Math.ceil(length / 8);
    // 一行时无边框
    const borderName = lines === 1 ? styles.noBorder : '';
    // 最后一行开始的索引
    const lastLineFirst = ((lines - 1) * 8) - 1;
    return (
      <div>
        <div className={styles.titleText}>总量指标</div>
        <div className={`${borderName} ${styles.items}`}>
          <Row>
            {
              data.map((item, index) => {
                const uniqueKey = `invest-index-${index}`;
                const itemBorder = index > lastLineFirst ? styles.noBorder : '';
                return (
                  <Col key={uniqueKey} span={3} className={`${itemBorder} ${styles.itemWrap}`}>
                    <Item data={item} />
                  </Col>
                );
              })
            }
          </Row>
        </div>
      </div>
    );
  }
}

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
    return (
      <div>
        <div className={styles.titleText}>总量指标</div>
        <div className={styles.items}>
          <Row gutter={4}>
            {
              data && data.map((item, index) => {
                const uniqueKey = `invest-index-${index}`;
                return (
                  <Col key={uniqueKey} span={3} className={styles.itemWrap}>
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

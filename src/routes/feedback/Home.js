/**
 * @file feedback/Home.js
 *  问题反馈
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import Detail from '../../components/feedback/Detail';
import styles from './home.less';

export default class FeedBack extends PureComponent {

  render() {
    return (
      <div className={styles.feedbackbox}>
        <div className="tab-box">
          <h3>tab</h3>
        </div>
        <Row>
          <Col span="10">
            <h3>列表</h3>
            <ul>
              <li>最好能看到流失客户的信息，方便及时维护，最好能看到流...</li>
              <li>最好能看到流失客户的信息，方便及时维护，最好能看到流...</li>
              <li>最好能看到流失客户的信息，方便及时维护，最好能看到流...</li>
              <li>最好能看到流失客户的信息，方便及时维护，最好能看到流...</li>
              <li>最好能看到流失客户的信息，方便及时维护，最好能看到流...</li>
              <li>最好能看到流失客户的信息，方便及时维护，最好能看到流...</li>
              <li>最好能看到流失客户的信息，方便及时维护，最好能看到流...</li>
              <li>最好能看到流失客户的信息，方便及时维护，最好能看到流...</li>
            </ul>
          </Col>
          <Col span="14">
            <Detail />
          </Col>
        </Row>
      </div>
    );
  }
}


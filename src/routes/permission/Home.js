/**
 * @file premission/Home.js
 *  权限申请
 * @author honggaunqging
 */

import React, { PureComponent, PropTypes } from 'react';
import { Col } from 'antd';
import './home.less';

export default class Permission extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
  }

  static defaultProps = {

  }
  render() {
    return (
      <div className="premissionbox">
        <div className="pageBody">
          <Col span="24" className="leftSection" id="leftSection">
            123456
          </Col>
          <Col span="24" className="rightSection" id="rightSection">
            wfdgfjhk
          </Col>
        </div>
      </div>
    );
  }
}


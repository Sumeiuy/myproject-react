/*
 * @Author: LiuJianShu
 * @Date: 2017-06-23 13:30:03
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-06-23 15:01:25
 */

import React, { PropTypes, PureComponent } from 'react';
import { Row } from 'antd';

import BoardSelect from '../../components/pageCommon/BoardSelect';

export default class BoardManageHome extends PureComponent {
  static propTypes = {
    boardManage: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  render() {
    const {
      location,
    } = this.props;
    return (
      <div className="page-invest content-inner">
        <div className="reportHeader">
          <Row type="flex" justify="start" align="middle">
            <div className="reportName">
              <BoardSelect
                location={location}
              />
            </div>
          </Row>
        </div>
      </div>
    );
  }
}


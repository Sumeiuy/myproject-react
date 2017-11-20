/*
 * @Description: 审批记录列表组件
 * @Author: LiuJianShu
 * @Date: 2017-09-25 18:42:50
 * @Last Modified by:   K0240008
 * @Last Modified time: 2017-11-17 10:35:43
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Pagination } from 'antd';
import _ from 'lodash';

import styles from './index.less';

export default class ApproveList extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    nowStep: PropTypes.object,
    needPagination: PropTypes.bool,
  }

  static defaultProps = {
    data: [],
    nowStep: {},
    needPagination: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 默认第一页
      page: 1,
      // 默认每页五条
      pageSize: 5,
    };
  }

  @autobind
  changePagination(current) {
    this.setState({
      page: current,
    });
  }
  render() {
    const { data, nowStep, needPagination } = this.props;
    const { page, pageSize } = this.state;
    const chunkData = data.length ?
      _.chunk(data, pageSize)[page - 1]
    :
      [];
    const displayData = needPagination ? chunkData : data;
    return (
      <div className={styles.approveWrapper}>
        {
          !_.isEmpty(nowStep) ?
            <div className={styles.approveNow}>
              <span>当前步骤：</span>
              <span>{nowStep.stepName}</span>
              <span>当前审批人：</span>
              <span>{nowStep.handleName}</span>
            </div>
          :
            null
        }
        {
          displayData.length ?
            <div className={styles.approveList}>
              {
                displayData.map(item => (
                  <div key={item.entryTime} className={styles.approveItem}>
                    <p>
                      审批人：{item.handleName}
                      于{item.handleTime}，
                      步骤名称：{item.stepName}
                    </p>
                    <p>
                      {item.comment}
                    </p>
                  </div>
                ))
              }
              {
                needPagination ?
                  <Pagination
                    size="small"
                    defaultPageSize={pageSize}
                    defaultCurrent={1}
                    total={data && data.length}
                    onChange={this.changePagination}
                  />
                :
                  null
              }
            </div>
          :
            null
        }
      </div>
    );
  }
}

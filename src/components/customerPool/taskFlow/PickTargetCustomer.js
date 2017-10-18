/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-10 10:29:33
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-10-12 14:12:02
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
// import { autobind } from 'core-decorators';
// import classnames from 'classnames';
import { connect } from 'react-redux';
// import _ from 'lodash';
import CustomerSegment from './CustomerSegment';
import TaskFlowSecond from './TaskFlowSecond';
import styles from './pickTargetCustomer.less';

// const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};

// const FormItem = Form.Item;

const TabPane = Tabs.TabPane;

const effects = {
  getLabelCirclePeople: 'customerPool/getLabelCirclePeople',
  getPeopleOfLabel: 'customerPool/getPeopleOfLabel',
};
const fectchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  circlePeopleData: state.customerPool.circlePeopleData,
  peopleOfLabelData: state.customerPool.peopleOfLabelData,
});

const mapDispatchToProps = {
  getCirclePeople: fectchDataFunction(true, effects.getCirclePeople),
  getPeopleOfLabel: fectchDataFunction(true, effects.getPeopleOfLabel),
};

@connect(mapStateToProps, mapDispatchToProps)

export default class PickTargetCustomer extends PureComponent {
  static propTypes = {
    getCirclePeople: PropTypes.func.isRequired,
    getPeopleOfLabel: PropTypes.func.isRequired,
    circlePeopleData: PropTypes.array.isRequired,
    peopleOfLabelData: PropTypes.array.isRequired,
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleTabChange(key) {
    console.log(key);
  }

  render() {
    const { getCirclePeople, circlePeopleData } = this.props;
    return (
      <div className={styles.pickCustomerSection}>
        <div className={styles.title}>目标客户</div>
        <div className={styles.divider} />
        <div className={styles.tabsSection}>
          <Tabs onChange={this.handleTabChange} type="card">
            <TabPane tab="客户细分" key="1">
              <CustomerSegment />
            </TabPane>
            <TabPane tab="标签圈人" key="2">
              <TaskFlowSecond
                circlePeopleData={circlePeopleData}
                getCirclePeople={getCirclePeople}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

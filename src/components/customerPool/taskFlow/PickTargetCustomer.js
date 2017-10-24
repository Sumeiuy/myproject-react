/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-10 10:29:33
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-10-19 14:11:28
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import CustomerSegment from './CustomerSegment';
import SelectLabelCust from './SelectLabelCust';
import styles from './pickTargetCustomer.less';

const TabPane = Tabs.TabPane;


export default class PickTargetCustomer extends PureComponent {
  static propTypes = {
    onPreview: PropTypes.func.isRequired,
    priviewCustFileData: PropTypes.object.isRequired,
    getLabelInfo: PropTypes.func.isRequired,
    getLabelPeople: PropTypes.func.isRequired,
    circlePeopleData: PropTypes.array.isRequired,
    peopleOfLabelData: PropTypes.array.isRequired,
    currentTab: PropTypes.string.isRequired,
    saveCurrentTab: PropTypes.func.isRequired,
    storedTaskFlowData: PropTypes.object.isRequired,
    // saveTaskFlowData: PropTypes.func.isRequired,
    // saveDataEmitter: PropTypes.object.isRequired,
    // onStepUpdate: PropTypes.func.isRequired,
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.state = {
      currentKey: '1',
    };
  }

  @autobind
  getData() {
    let custData = {};
    let labelCustData = {};
    if (this.customerSegmentRef) {
      custData = this.customerSegmentRef.getData();
    }
    if (this.selectLabelCustRef) {
      labelCustData = this.selectLabelCustRef.getData();
    }
    return _.merge(custData, labelCustData);
  }

  @autobind
  handleTabChange(key) {
    const { saveCurrentTab } = this.props;
    this.setState({
      currentKey: key,
    });
    saveCurrentTab(key);
  }

  render() {
    const {
      onPreview,
      priviewCustFileData,
      currentTab,
      storedTaskFlowData,
      getLabelInfo,
      circlePeopleData,
      getLabelPeople,
      peopleOfLabelData,
    } = this.props;
    const { currentKey } = this.state;

    // 当前激活的tab
    // 根据缓存数据或者默认初始化数据，恢复tab
    const currentActiveKey = currentTab || currentKey;
    return (
      <div className={styles.pickCustomerSection}>
        <div className={styles.title}>目标客户</div>
        <div className={styles.divider} />
        <div className={styles.tabsSection}>
          <Tabs defaultActiveKey={currentActiveKey} onChange={this.handleTabChange} type="card">
            <TabPane tab="客户细分" key="1">
              <CustomerSegment
                ref={ref => (this.customerSegmentRef = ref)}
                onPreview={onPreview}
                priviewCustFileData={priviewCustFileData}
                storedData={storedTaskFlowData}
              />
            </TabPane>
            <TabPane tab="标签圈人" key="2">
              <SelectLabelCust
                circlePeopleData={circlePeopleData}
                getLabelInfo={getLabelInfo}
                peopleOfLabelData={peopleOfLabelData}
                getLabelPeople={getLabelPeople}
                storedData={storedTaskFlowData}
                ref={ref => (this.selectLabelCustRef = ref)}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

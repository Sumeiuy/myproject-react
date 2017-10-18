/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-10 10:29:33
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-10-18 17:26:38
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { autobind } from 'core-decorators';
import CustomerSegment from './CustomerSegment';
import SelectLabelCust from './SelectLabelCust';
import styles from './pickTargetCustomer.less';

const TabPane = Tabs.TabPane;
export default class PickTargetCustomer extends PureComponent {
  static propTypes = {
    onPreview: PropTypes.func.isRequired,
    priviewCustFileData: PropTypes.object.isRequired,
    isRestoreData: PropTypes.bool,
    isStoreData: PropTypes.bool,
    storedCustSegmentData: PropTypes.object,
    saveCustSegmentData: PropTypes.func.isRequired,
    storedLabelCustData: PropTypes.object,
    saveLabelCustData: PropTypes.func.isRequired,
    onStepUpdate: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    getCirclePeople: PropTypes.func.isRequired,
    getPeopleOfLabel: PropTypes.func.isRequired,
    circlePeopleData: PropTypes.array.isRequired,
    peopleOfLabelData: PropTypes.array.isRequired,
    currentTab: PropTypes.string.isRequired,
    saveCurrentTab: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isRestoreData: false,
    isStoreData: false,
    storeData: () => { },
    restoreData: () => { },
    storedCustSegmentData: {},
    storedLabelCustData: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      currentKey: '1',
    };
  }

  @autobind
  handleTabChange(key) {
    const { saveCurrentTab } = this.props;
    this.setState({
      currentKey: key,
    });
    saveCurrentTab(key);
    console.log(key);
  }

  render() {
    const {
      onPreview,
      priviewCustFileData,
      isRestoreData,
      isStoreData,
      storedCustSegmentData,
      storedLabelCustData,
      onStepUpdate,
      replace,
      location,
      saveCustSegmentData,
      saveLabelCustData,
      currentTab,
    } = this.props;
    const { currentKey } = this.state;

    // 当前激活的tab
    // 根据缓存数据或者默认初始化数据，恢复tab
    const currentActiveKey = currentTab || currentKey;

    const { getCirclePeople, circlePeopleData } = this.props;
    return (
      <div className={styles.pickCustomerSection}>
        <div className={styles.title}>目标客户</div>
        <div className={styles.divider} />
        <div className={styles.tabsSection}>
          <Tabs defaultActiveKey={currentActiveKey} onChange={this.handleTabChange} type="card">
            <TabPane tab="客户细分" key="1">
              <CustomerSegment
                location={location}
                replace={replace}
                onPreview={onPreview}
                priviewCustFileData={priviewCustFileData}
                // 只有当前tab是客户细分，并且需要存储数据时，才存储数据
                isStoreData={isStoreData && currentActiveKey === '1'}
                isRestoreData={isRestoreData}
                storeData={saveCustSegmentData}
                storedData={storedCustSegmentData}
                onStepUpdate={onStepUpdate}
              />
            </TabPane>
            <TabPane tab="标签圈人" key="2">
              <SelectLabelCust
                circlePeopleData={circlePeopleData}
                getCirclePeople={getCirclePeople}
                onStepUpdate={onStepUpdate}
                // 只有当前tab是标签圈人，并且需要存储数据时，才存储数据
                isStoreData={isStoreData && currentActiveKey === '2'}
                isRestoreData={isRestoreData}
                storeData={saveLabelCustData}
                storedData={storedLabelCustData}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-10 10:29:33
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-10-17 16:27:13
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { autobind } from 'core-decorators';
// import classnames from 'classnames';
// import _ from 'lodash';
import CustomerSegment from './CustomerSegment';
import styles from './pickTargetCustomer.less';

// const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};

// const FormItem = Form.Item;

const TabPane = Tabs.TabPane;

export default class PickTargetCustomer extends PureComponent {
  static propTypes = {
    onPreview: PropTypes.func.isRequired,
    priviewCustFileData: PropTypes.object.isRequired,
    isRestoreData: PropTypes.bool,
    isStoreData: PropTypes.bool,
    storeData: PropTypes.func,
    restoreData: PropTypes.func,
    storedData: PropTypes.object,
    onStepUpdate: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isRestoreData: false,
    isStoreData: false,
    storeData: () => { },
    restoreData: () => { },
    storedData: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      currentKey: '1',
    };
  }

  @autobind
  handleTabChange(key) {
    this.setState({
      currentKey: key,
    });
    console.log(key);
  }

  render() {
    const {
      onPreview,
      priviewCustFileData,
      isRestoreData,
      isStoreData,
      storeData,
      restoreData,
      storedData,
      onStepUpdate,
    } = this.props;
    const { currentKey } = this.state;

    const { currentSelect } = storedData;

    // 当前激活的tab
    // 根据缓存数据或者默认初始化数据，恢复tab
    const currentActiveKey = currentSelect || currentKey;

    return (
      <div className={styles.pickCustomerSection}>
        <div className={styles.title}>目标客户</div>
        <div className={styles.divider} />
        <div className={styles.tabsSection}>
          <Tabs defaultActiveKey={currentActiveKey} onChange={this.handleTabChange} type="card">
            <TabPane tab="客户细分" key="1">
              <CustomerSegment
                onPreview={onPreview}
                priviewCustFileData={priviewCustFileData}
                // 只有当前tab是客户细分，并且需要存储数据时，才存储数据
                isStoreData={isStoreData && currentKey === '1'}
                isRestoreData={isRestoreData}
                storeData={storeData}
                restoreData={restoreData}
                storedData={storedData}
                onStepUpdate={onStepUpdate}
              />
            </TabPane>
            <TabPane tab="标签圈人" key="2">Content of Tab Pane 2</TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

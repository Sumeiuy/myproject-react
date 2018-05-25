/*
 * @Description: 页签切换显示
 * @Author: WangJunjun
 * @Date: 2018-05-22 14:53:21
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-05-24 13:31:13
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import ServiceImplementation from './serviceImplementation/ServiceImplementation';
import styles from './tabsArea.less';

const TabPane = Tabs.TabPane;

const TabsArea = (props) => {
  const { hasSurvey, performerViewCurrentTab, changePerformerViewTab } = props;
  const handleTabsChange = (activeKey) => {
    changePerformerViewTab(activeKey);
  };
  return (
    <div className={styles.tabsContainer} >
      <Tabs activeKey={performerViewCurrentTab} onChange={handleTabsChange}>
        <TabPane tab="服务实施" key="serviceImplementation">
          <ServiceImplementation
            {...props}
          />
        </TabPane>
        <TabPane tab="服务结果" key="serviceResult">Content of Tab Pane 2</TabPane>
        {hasSurvey && <TabPane tab="任务问卷调查" key="questionnaireSurvey">fff</TabPane>}
      </Tabs>
    </div>
  );
};

TabsArea.propTypes = {
  hasSurvey: PropTypes.bool,
  servicePolicy: PropTypes.string,
  performerViewCurrentTab: PropTypes.string.isRequired,
  changePerformerViewTab: PropTypes.func.isRequired,
};

TabsArea.defaultProps = {
  hasSurvey: false,
  servicePolicy: '',
};

export default TabsArea;

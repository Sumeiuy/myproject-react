/*
 * @Description: 页签切换显示
 * @Author: WangJunjun
 * @Date: 2018-05-22 14:53:21
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-05-28 22:08:43
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import ServiceImplementation from './serviceImplementation/ServiceImplementation';
import ServiceResult from './serviceResult/ServiceResult';
import styles from './tabsArea.less';

const TabPane = Tabs.TabPane;

const TabsArea = (props) => {
  const { hasSurvey, performerViewCurrentTab, changePerformerViewTab } = props;
  const handleTabsChange = (activeKey) => {
    changePerformerViewTab(activeKey);
  };
  const { isFold,
    serviceProgress,
    custFeedBack,
    currentId,
    queryExecutorFeedBack,
    queryExecutorDetail,
    custDetail,
    queryExecutorFlowStatus } = props;
  return (
    <div className={styles.tabsContainer} >
      <Tabs activeKey={performerViewCurrentTab} onChange={handleTabsChange}>
        <TabPane tab="服务实施" key="serviceImplementation">
          <ServiceImplementation
            {...props}
          />
        </TabPane>
        <TabPane tab="服务结果" key="serviceResult">
          <ServiceResult
            isFold={isFold}
            currentId={currentId}
            serviceProgress={serviceProgress}
            custFeedBack={custFeedBack}
            custDetail={custDetail}
            queryExecutorFeedBack={queryExecutorFeedBack}
            queryExecutorFlowStatus={queryExecutorFlowStatus}
            queryExecutorDetail={queryExecutorDetail}
          />
        </TabPane>
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
  isFold: PropTypes.bool,
  serviceProgress: PropTypes.object.isRequired,
  custFeedBack: PropTypes.array.isRequired,
  custDetail: PropTypes.object.isRequired,
  queryExecutorFeedBack: PropTypes.func.isRequired,
  queryExecutorFlowStatus: PropTypes.func.isRequired,
  queryExecutorDetail: PropTypes.func.isRequired,
  currentId: PropTypes.string.isRequired,
};

TabsArea.defaultProps = {
  hasSurvey: false,
  servicePolicy: '',
  isFold: false,
};

export default TabsArea;

/*
 * @Description: 页签切换显示
 * @Author: WangJunjun
 * @Date: 2018-05-22 14:53:21
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-08-13 17:14:42
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import ServiceImplementation from './serviceImplementation/ServiceImplementation';
import ServiceResult from './serviceResult/ServiceResult';
import Survey from './survey/QuestionnaireSurvey';
import { taskStatusList } from './config';
import styles from './tabsArea.less';

const TabPane = Tabs.TabPane;

const TabsArea = (props) => {
  const { hasSurvey, performerViewCurrentTab, changePerformerViewTab } = props;
  const handleTabsChange = (activeKey) => {
    changePerformerViewTab(activeKey);
  };
  // 结束状态
  const isEndState = statusCode => +statusCode === taskStatusList[6].id;
  const {
    isFold,
    serviceProgress,
    custFeedBack,
    currentId,
    queryExecutorFeedBack,
    queryExecutorDetail,
    custDetail,
    queryExecutorFlowStatus,
    answersList,
    getTempQuesAndAnswer,
    isSubmitSurveySucceed,
    saveAnswersByType,
    basicInfo,
    basicInfo: { missionStatusCode },
    queryExecutorDetailLoading,
  } = props;
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
            queryExecutorDetailLoading={queryExecutorDetailLoading}
          />
        </TabPane>
        {hasSurvey ?
          <TabPane tab="任务问卷调查" key="questionnaireSurvey">
            {
              performerViewCurrentTab === 'questionnaireSurvey' ?
                <Survey
                  answersList={answersList}
                  getTempQuesAndAnswer={getTempQuesAndAnswer}
                  isSubmitSurveySucceed={isSubmitSurveySucceed}
                  saveAnswersByType={saveAnswersByType}
                  basicInfo={basicInfo}
                  currentId={currentId}
                  key={currentId}
                  // 不是结束状态的才可以提交
                  canSubmit={!isEndState(missionStatusCode)}
                /> : null
            }
          </TabPane> : null
        }
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
  queryExecutorDetailLoading: PropTypes.bool.isRequired,
  currentId: PropTypes.string.isRequired,
  answersList: PropTypes.object,
  getTempQuesAndAnswer: PropTypes.func.isRequired,
  isSubmitSurveySucceed: PropTypes.bool,
  saveAnswersByType: PropTypes.func.isRequired,
  basicInfo: PropTypes.object.isRequired,
};

TabsArea.defaultProps = {
  hasSurvey: false,
  servicePolicy: '',
  isFold: false,
  answersList: {},
  isSubmitSurveySucceed: false,
};

export default TabsArea;

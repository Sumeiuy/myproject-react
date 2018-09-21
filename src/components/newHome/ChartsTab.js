/**
 * @Author: zhufeiyang
 * @Date: 2018-01-30 13:37:45
 * @Last Modified by: zhufeiyang
 * @Last Modified time: 2018-09-14 13:46:09
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { optionsMap } from '../../config';
import {
  CUST_MANAGER,
  ORG,
  MAIN_MAGEGER_ID,
} from '../../routes/customerPool/config';
import { emp, time, permission } from '../../helper';
import { transformDateTypeToDate } from '../customerPool/helper';
import { PerformanceIndicators } from '../customerPool/home';
import AnalysisCharts from './AnalysisCharts';
import TabController from './TabController';
import logable from '../../decorators/logable';
import styles from './chartsTab.less';

const TabPane = Tabs.TabPane;

export default class ChartsTab extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    custRange: PropTypes.array.isRequired,
    cycle: PropTypes.array.isRequired,
    managerIndicators: PropTypes.object.isRequired,
    custAnalyticsIndicators: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
    performanceIndicators: PropTypes.object.isRequired,
    custCount: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]).isRequired,
    getCustCount: PropTypes.func.isRequired,
    getManagerIndicators: PropTypes.func.isRequired,
    getPerformanceIndicators: PropTypes.func.isRequired,
    getCustAnalyticsIndicators: PropTypes.func.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
    };
    // 初始化当前登录用户的orgId
    this.loginOrgId = emp.getOrgId();
    // HTSC 首页指标查询
    this.hasIndexViewPermission = permission.hasIndexViewPermission();
  }

  componentDidMount() {
    this.requstIndicator(this.props);
  }

  componentDidUpdate(prevProps) {
    const {
      location: { query: nextQuery },
    } = this.props;

    const {
      location: { query: prevQuery },
    } = prevProps;

    // 时间或者组织机构树变化
    // 重新请求绩效指标数据和净创收数据
    if (prevQuery.orgId !== nextQuery.orgId
      || prevQuery.cycleSelect !== nextQuery.cycleSelect) {
      // 请求指标数据
      this.requstIndicator(this.props);
    }
  }

  // 我的客户时custType=CUST_MANAGER，非我的客户时custType=ORG， custType用来传给后端
  getCustType(orgId) {
    let custType = CUST_MANAGER;
    if (orgId) {
      custType = orgId !== MAIN_MAGEGER_ID ? ORG : CUST_MANAGER;
    } else if (this.hasIndexViewPermission) {
      custType = ORG;
    }
    return custType;
  }

  // 周期类型
  getDateType(cycleSelect) {
    const { cycle } = this.props;
    return cycleSelect || (!_.isEmpty(cycle) ? cycle[0].key : '');
  }

  getTimeSelectBeginAndEnd(props) {
    const { cycle, location: { query: { cycleSelect } } } = props;
    const { historyTime, customerPoolTimeSelect } = optionsMap;
    const currentSelect = _.find(historyTime, (itemData) => {
      const matchTime = _.find(
        customerPoolTimeSelect,
        item => item.key === (cycleSelect || (cycle[0] || {}).key),
      ) || {};
      return itemData.name === matchTime.name;
    }) || {}; // 本月
    const nowDuration = time.getDurationString(currentSelect.key);
    const begin = nowDuration.begin;
    const end = nowDuration.end;
    return {
      begin,
      end,
    };
  }

  requstIndicator(props) {
    const {
      cycle,
      location: {
        query: {
          cycleSelect,
          orgId,
        },
      },
    } = props;

    // 根据cycle获取对应的begin和end值
    // T-1天的数据
    const { begin, end } = this.getTimeSelectBeginAndEnd(props);
    const custType = this.getCustType(orgId);
    const tempObj = {
      begin,
      end,
      custType,
      cycleSelect: cycleSelect || (cycle[0] || {}).key,
    };
    if (orgId) {
      tempObj.orgId = orgId !== MAIN_MAGEGER_ID ? orgId : '';
    } else if (this.hasIndexViewPermission) {
      tempObj.orgId = this.loginOrgId;
    }
    // 绩效指标
    this.getIndicators(tempObj);
  }

  @autobind
  getIndicators({ begin, end, orgId, cycleSelect, custType }) {
    const {
      getPerformanceIndicators,
      getCustAnalyticsIndicators,
      getManagerIndicators,
      getCustCount,
      empInfo = {},
    } = this.props;
    const { tgQyFlag = false } = empInfo.empInfo || {};
    const cycleDate = transformDateTypeToDate(cycleSelect);
    const param = {
      custType, // 客户范围类型
      orgId, // 组织ID
      dateType: this.getDateType(cycleSelect), // 周期类型
      dateStart: cycleDate.cycleStartTime,
      dateEnd: cycleDate.cycleEndTime,
      empId: emp.getId(),
    };
    // 经营指标新增客户数指标
    getCustCount({ ...param });
    // 经营指标
    getManagerIndicators({ ...param, end, begin });
    // 客户分析
    getCustAnalyticsIndicators({ ...param, end, begin });
    // 查看投顾绩效开关:empinfo返回的权限指标字段（tgQyFlag：bool）
    if (tgQyFlag) {
      getPerformanceIndicators({ ...param, end, begin });
    }
  }

  @autobind
  getCurrentActiveKey() {
    const { location: { query: { activeKey } } } = this.props;
    return activeKey || 'analysis';
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '切换Tab：经营指标/投顾绩效' } })
  handleTabClick(key) {
    const { location: { query } } = this.props;
    this.context.replace({
      query: {
        ...query,
        activeKey: key,
      }
    });
  }

  renderTabController() {
    const tabControllerProps = {
      loginOrgId: this.loginOrgId,
      custRange: this.props.custRange,
      location: this.props.location,
      replace: this.context.replace,
      authority: this.hasIndexViewPermission,
      cycle: this.props.cycle,
    };
    return (
      <TabController {...tabControllerProps} />
    );
  }

  render() {
    const {
      empInfo,
      custCount,
      managerIndicators,
      performanceIndicators,
      custAnalyticsIndicators,
      location,
      cycle
    } = this.props;

    const { tgQyFlag } = (empInfo && empInfo.empInfo) || {};

    const activeKey = this.getCurrentActiveKey();

    return (
      <Tabs
        className={styles.tab}
        tabBarExtraContent={this.renderTabController()}
        defaultActiveKey={activeKey}
        onTabClick={this.handleTabClick}
        animated={false}
      >
        <TabPane tab="客户分析" key="analysis">
          <AnalysisCharts
            indicators={custAnalyticsIndicators}
            location={location}
            cycle={cycle}
          />
        </TabPane>
        <TabPane tab="经营指标" key="manage">
          <PerformanceIndicators
            custCount={custCount}
            indicators={managerIndicators}
            location={location}
            cycle={cycle}
            category={'manager'}
            isNewHome
          />
        </TabPane>
        {
          tgQyFlag ? (
            <TabPane tab="投顾绩效" key="performance">
              <PerformanceIndicators
                indicators={performanceIndicators}
                location={location}
                cycle={cycle}
                custCount={custCount}
                category={'performance'}
                isNewHome
              />
            </TabPane>
          ) : null
        }
      </Tabs>
    );
  }
}

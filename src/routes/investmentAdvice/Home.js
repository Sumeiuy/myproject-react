/**
 * @Author: sunweibin
 * @Date: 2018-06-04 11:13:00
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-06 16:04:32
 * @description 任务绑定投资建议模板与投资建议模板维护的Tab页面
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import { Tabs } from 'antd';
// import _ from 'lodash';

import InvestAdviceMaintain from './InvestAdviceMaintain';
import TaskBindTemplate from './TaskBindTemplate';
import withRouter from '../../decorators/withRouter';
import logable from '../../decorators/logable';
import { dva } from '../../helper';
import { TAB_LIST, TabKeys } from './config';
import styles from './home.less';

const TabPane = Tabs.TabPane;

// 以前的fetchDataFunction提取到helper/dva里面成为公共方法使用
const effect = dva.generateEffect;

const mapStateToProps = state => ({
  // 投资模板列表
  investmentAdvices: state.investmentAdvice.investmentAdvices,
  // 删除是否成功
  deleteSuccessStatus: state.investmentAdvice.deleteSuccessStatus,
  // 新建或编辑模版是否成功
  modifySuccessStatus: state.investmentAdvice.modifySuccessStatus,
  // 任务绑定投资建议模板列表
  taskBindTemplate: state.investmentAdvice.taskBindTemplate,
  // 删除任务绑定投资建议模板状态
  delTaskBindTemplateStatus: state.investmentAdvice.delTaskBindTemplateStatus,
  // 可选投资模板列表
  templateList: state.investmentAdvice.templateList,
  // 绑定模板列表状态
  bindTemplateStatus: state.investmentAdvice.bindTemplateStatus,
});

const mapDispatchToProps = {
  // 获取投资建议模版列表
  getInvestAdviceList: effect('investmentAdvice/getInvestmentAdviceList'),
  // 删除投资建议固定话术模板
  deleteInvestAdvice: effect('investmentAdvice/deleteInvestAdvice', { loading: false }),
  // 新建或编辑模版
  modifyInvestAdvice: effect('investmentAdvice/modifyInvestAdvice'),
  // 查询任务绑定投资建议模板列表 api
  getTaskBindList: effect('investmentAdvice/getTaskBindList'),
  // 删除任务绑定的投资建议模板
  delTaskBindTemplate: effect('investmentAdvice/delTaskBindTemplate'),
  // 获取可新增的投资模板列表 api
  queryTemplateList: effect('investmentAdvice/getOptionalTemplateList'),
  // 为当前任务绑定模板列表
  bindTemplateListForMission: effect('investmentAdvice/bindTemplateList'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class InvestAdviceTabsHome extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 投资模板列表
    investmentAdvices: PropTypes.object.isRequired,
    // 删除是否成功
    deleteSuccessStatus: PropTypes.bool.isRequired,
    // 新建或编辑模版是否成功
    modifySuccessStatus: PropTypes.bool.isRequired,
    // 获取投资建议模版列表
    getInvestAdviceList: PropTypes.func.isRequired,
    // 删除投资建议固定话术模板
    deleteInvestAdvice: PropTypes.func.isRequired,
    // 新建或编辑模版
    modifyInvestAdvice: PropTypes.func.isRequired,
    // 查询任务绑定投资建议模板列表
    getTaskBindList: PropTypes.func.isRequired,
    // 任务绑定投资建议模板列表
    taskBindTemplate: PropTypes.object.isRequired,
    // 删除任务绑定的投资建议模板
    delTaskBindTemplate: PropTypes.func.isRequired,
    // 删除任务绑定投资建议模板状态
    delTaskBindTemplateStatus: PropTypes.string.isRequired,
    // 获取投资模板列表
    queryTemplateList: PropTypes.func.isRequired,
    // 投资模板列表
    templateList: PropTypes.array.isRequired,
    // 为当前任务绑定模板列表
    bindTemplateListForMission: PropTypes.func.isRequired,
    // 绑定模板列表状态
    bindTemplateStatus: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 当前激活的是Tab, 默认显示投资建议模板维护的Tab
      active: TabKeys.TEMPLATE,
    };
  }

  // 根据切换的TabKey，展示相关的内容组件
  @autobind
  getComponentByTabKey(tabKey) {
    let component = null;

    switch (tabKey) {
      case TabKeys.TEMPLATE:
        component = this.getInvestAdviceMaintainComponent();
        break;
      case TabKeys.TASK_BIND:
        component = this.getTaskBindInvestAdviceTmplComponent();
        break;
      default:
        component = this.getInvestAdviceMaintainComponent();
        break;
    }
    return component;
  }

  @autobind
  getInvestAdviceMaintainComponent() {
    const {
      investmentAdvices,
      deleteSuccessStatus,
      modifySuccessStatus,
      getInvestAdviceList,
      deleteInvestAdvice,
      modifyInvestAdvice,
    } = this.props;
    return (
      <InvestAdviceMaintain
        investmentAdvices={investmentAdvices}
        deleteSuccessStatus={deleteSuccessStatus}
        modifySuccessStatus={modifySuccessStatus}
        getInvestAdviceList={getInvestAdviceList}
        deleteInvestAdvice={deleteInvestAdvice}
        modifyInvestAdvice={modifyInvestAdvice}
      />
    );
  }

  @autobind
  getTaskBindInvestAdviceTmplComponent() {
    const {
      getTaskBindList,
      taskBindTemplate,
      delTaskBindTemplate,
      delTaskBindTemplateStatus,
      queryTemplateList,
      templateList,
      bindTemplateListForMission,
      bindTemplateStatus,
    } = this.props;
    return (
      <TaskBindTemplate
        getTaskBindList={getTaskBindList}
        taskBindTemplate={taskBindTemplate}
        delTaskBindTemplate={delTaskBindTemplate}
        delTaskBindTemplateStatus={delTaskBindTemplateStatus}
        queryTemplateList={queryTemplateList}
        templateList={templateList}
        bindTemplateListForMission={bindTemplateListForMission}
        bindTemplateStatus={bindTemplateStatus}
      />
    );
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '切换Tab：任务绑定投资建议模板/投资建议模板维护' } })
  handleTabChange(key) {
    this.setState({
      active: key,
    });
    // TODO 此处切换Tab的时候需要刷新新页面数据
  }

  render() {
    const { active } = this.state;
    const tabContentComponent = this.getComponentByTabKey(active);

    return (
      <div className={styles.customerFeedbackWapper}>
        <div className={styles.tabBox}>
          <Tabs onChange={this.handleTabChange} activeKey={active} type="card">
            { TAB_LIST.map(v => (<TabPane tab={v.tabName} key={v.key} />)) }
          </Tabs>
        </div>
        <div className={styles.componentBox}>
          {' '}
          {tabContentComponent}
          {' '}
        </div>
      </div>
    );
  }
}

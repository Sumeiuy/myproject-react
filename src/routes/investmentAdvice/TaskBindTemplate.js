/*
 * @Description: 任务绑定客户反馈
 * @Author: XuWenKang
 * @Date: 2017-12-21 14:49:16
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-29 09:44:50
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import {
  Tabs, Collapse, Icon, Popover, Button, Input
} from 'antd';
import _ from 'lodash';
import cx from 'classnames';

import TaskBindTemplateModal from '../../components/operationManage/investmentAdvice/TaskBindTemplateModal';
import confirm from '../../components/common/confirm_';
import Pagination from '../../components/common/Pagination';
import logable, { logPV } from '../../decorators/logable';
import {
  TASK_LIST,
  MOT_TASK,
} from './config';

import styles from './taskBindTemplate.less';

const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
const Search = Input.Search;

export default class MissionBind extends PureComponent {
  static propTypes = {
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
    // 给当前任务绑定模板列表
    bindTemplateListForMission: PropTypes.func.isRequired,
    // 绑定模板列表状态
    bindTemplateStatus: PropTypes.string.isRequired,
  }

  static contextTypes = {
    dict: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 展示添加投资建议模板的弹出层
      addTemplateModal: false,
      // 当前显示 MOT任务页签内容还是自建任务页签内容,默认为MOT
      active: MOT_TASK.key,
      // 显示哪个折叠面板，此值可以用于确认用户选择的是哪个任务
      collapseActiveKey: '',
      // MOT任务可以根据关键字的搜索任务
      keyWord: '',
      // 当前页码
      pageNum: 1,
    };
  }

  componentDidMount() {
    this.queryTaskBindList({ type: MOT_TASK.key });
  }

  @autobind
  generateParameterReg() {
    const { dict: { investAdviceIndexPlaceHolders = [] } } = this.context;
    const parameterRegString = investAdviceIndexPlaceHolders.map(item => `\\${item.value}`).join('|');
    const regString = `(\\s(${parameterRegString}))`;
    // var reg1 = new RegExp('(\\s(\\$服务经理|\\$客户名称))', 'g');
    // 将字典中的投资建议模板参数转化成 RegExp 对象
    return new RegExp(regString, 'g');
  }

  @autobind
  queryTaskBindList({
    type, pageNum = 1, pageSize = 10, keyWord = ''
  } = {}) {
    const isMot = type === MOT_TASK.key;
    const query = { type, pageNum, pageSize };
    // 如果是自建任务不存在,根据关键字进行过滤查询
    if (isMot) {
      query.keyWord = keyWord;
    }
    this.props.getTaskBindList(query);
  }

  @autobind
  handleCloseModal() {
    this.setState({ addTemplateModal: false });
  }

  @autobind
  @logPV({ pathname: '/modal/addInvestmentTemplate', title: '新增投资建议模板' })
  handleAddTemplateClick() {
    this.setState({ addTemplateModal: true });
  }

  // 切换折叠面板
  @autobind
  @logable({ type: 'Click', payload: { name: '切换折叠面板' } })
  handleChangeCollapse(collapseActiveKey) {
    this.setState({ collapseActiveKey });
  }

  @autobind
  handlePageChange(pageNum) {
    this.setState({ pageNum });
    const { active, keyWord } = this.state;
    this.queryTaskBindList({ type: active, pageNum, keyWord });
  }

  @autobind
  handleTaskBindTemplateModalOK(list) {
    // 此处确保穿过来的 list 为非空
    // 选择了弹出层的模板列表后,需要针对该任务下的已经存在的模板和选择添加的模板进行去重
    // 然后，在调用添加接口，进行添加数据
    // 获取当前任务下绑定的模板列表, collapseActiveKey 可以用户确认用户目前点击的哪个任务的id
    const { collapseActiveKey, active } = this.state;
    const { taskBindTemplate: { missionList = [] } } = this.props;
    // templateList 是已经添加的模板列表
    const { templateList } = _.find(missionList, item => item.id === collapseActiveKey);
    // 此处后端返回的接口数据可能为null, 使用 _.map 来获取 id 数据
    const templateIds = _.map(templateList, 'id');
    // 在用户选择的模板列表中取消掉当前任务中已经存在的模板
    const selectedIds = _.filter(list, item => !_.includes(templateIds, item));
    // 此处增加一个判断如果用户选择的模板列表去重后，selectedIds 为空数据，
    // 即用户选择的为全部存在了，则提示用户已经添加
    if (_.isEmpty(selectedIds)) {
      confirm({
        content: '您选择的模板已经全部存在,请重新选择！',
      });
    } else {
      this.props.bindTemplateListForMission({
        type: active,
        templateList: selectedIds,
        missionId: collapseActiveKey,
      }).then(this.refreshListAfterAdd);
      this.handleCloseModal();
    }
  }


  @autobind
  @logable({ type: 'Click', payload: { name: '搜索Mot任务列表', value: '$args[0]' } })
  searchMotMission(keyWord) {
    this.setState({ keyWord });
    this.queryTaskBindList({ type: MOT_TASK.key, keyWord });
  }

  // 修复tab上input中左右键切换不符合预期
  @autobind
  preventKeyDownPropagation(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }

  @autobind
  @logPV({ pathname: '/modal/deletingTips', title: '系统提示-解绑' })
  openDelConfirm(template) {
    // 打开是否删除的确认框
    confirm({
      content: '确定要将该模板从任务下解绑吗？',
      onOk: () => {
        this.handleDelTemplateClick(template);
      },
    });
  }

  @autobind
  refreshListAfterDel() {
    // 如果删除成功，则刷新列表
    const { delTaskBindTemplateStatus } = this.props;
    if (delTaskBindTemplateStatus === 'success') {
      const { active, pageNum, keyWord } = this.state;
      this.queryTaskBindList({ type: active, pageNum, keyWord });
    }
  }

  @autobind
  refreshListAfterAdd() {
    // 如果删除成功，则刷新列表
    const { bindTemplateStatus } = this.props;
    if (bindTemplateStatus === 'success') {
      const { active, pageNum, keyWord } = this.state;
      this.queryTaskBindList({ type: active, pageNum, keyWord });
    }
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '切换Tab：MOT任务/自建任务' } })
  handleSwitchTabClick(active) {
    this.setState({ active, keyWord: '', pageNum: 1 });
    this.queryTaskBindList({ type: active });
  }

  @autobind
  handleDelTemplateClick(templateId) {
    const { collapseActiveKey, active } = this.state;
    // 删除任务下绑定的投资建议模板
    this.props.delTaskBindTemplate({
      missionId: collapseActiveKey,
      type: active,
      templateId,
    }).then(this.refreshListAfterDel);
  }

  // 将投资建议模板中的内容里面的 $服务经理 参数进行使用html标签包装文本
  // 使其显示高亮
  @autobind
  replaceInvestAdviceParameterInContent(content) {
    if (!this.mentionReg) {
      this.mentionReg = this.generateParameterReg();
    }
    const newContent = content.replace(this.mentionReg,
      (a, b) => `<span class=${styles.investAdviceBindMentionHightlight}>${b}</span>`);
    // 此处用于转化成 html 标签字符串 ，传递给 React 的 dangerouslySetInnerHTML 使用
    return { __html: `<span>${newContent}</span>` };
  }

  @autobind
  renderPanelHeaderComponent(item, isMot) {
    const taskCls = cx({
      [styles.parentClass]: isMot,
      [styles.parentClassSelf]: !isMot,
    });
    return (
      <div className={styles.collapseHead}>
        <span className={taskCls}>{item.parentClassName}</span>
        {
          isMot ? (<span className={styles.missionId}>{item.id}</span>) : null
        }
        <span className={styles.childClass} title={item.childClassName}>{item.childClassName}</span>
        <span className={styles.optionClass}>
查看
          <Icon type="up" />
          <Icon type="down" />
        </span>
      </div>
    );
  }

  @autobind
  renderInvestAdviceTamplate(list) {
    // 此处由于后端如果没有传递templateList为null,而null是无法使用参数默认值的ES6 写法的
    const newList = _.isEmpty(list) ? [] : list;
    return newList.map((tmpl) => {
      const tmplContent = (
        <div
          className={styles.content}
          dangerouslySetInnerHTML={this.replaceInvestAdviceParameterInContent(tmpl.content)} // eslint-disable-line
        />
      );

      return (
        <div className={styles.templates} key={tmpl.id}>
          <div className={styles.title}>
            <div className={styles.titleText}>{tmpl.title}</div>
            <div className={styles.delIcon} onClick={() => this.openDelConfirm(tmpl.id)}>
              <Icon type="close-circle" />
            </div>
          </div>
          <Popover
            placement="topLeft"
            overlayClassName={styles.tmplContentPopover}
            content={tmplContent}
          >
            {tmplContent}
          </Popover>
        </div>
      );
    });
  }

  @autobind
  renderPanelListComponent() {
    const { taskBindTemplate: { missionList = [] } } = this.props;
    const { active } = this.state;
    const isMot = active === MOT_TASK.key;

    return missionList.map((item) => {
      const header = this.renderPanelHeaderComponent(item, isMot);
      return (
        <Panel header={header} key={item.id}>
          <div className={styles.taskbindBox}>
            <div className={styles.captions}>
              <div className={styles.title}>标题</div>
              <div className={styles.content}>内容</div>
            </div>
            {this.renderInvestAdviceTamplate(item.templateList)}
            <Button
              ghost
              icon="plus"
              type="primary"
              onClick={this.handleAddTemplateClick}
            >
              新增
            </Button>
          </div>
        </Panel>
      );
    });
  }

  render() {
    const {
      addTemplateModal,
      collapseActiveKey,
      active,
      pageNum,
    } = this.state;

    const {
      templateList,
      queryTemplateList,
      taskBindTemplate: { page = {}, missionList = [] },
    } = this.props;
    const isMOTMission = active === MOT_TASK.key;

    return (
      <div className={styles.missionBindWapper}>
        <div className={styles.tipsBox}>
          <p>
            请基于任务类型（或MOT事件）定义投顾可以选择的投资建议模板，每个类型可以定义多条投资建议模板。
          </p>
        </div>
        <div className={styles.tabBox}>
          <Tabs
            onChange={this.handleSwitchTabClick}
            activeKey={active}
            tabBarExtraContent={
              isMOTMission
                ? (
                  <Search
                    onKeyDown={this.preventKeyDownPropagation}
                    placeholder="事件ID/事件名称"
                    style={{ width: 186 }}
                    onSearch={this.searchMotMission}
                    enterButton
                  />
                )
                : null
            }
          >
            {
              TASK_LIST.map(item => (<TabPane tab={item.name} key={item.key} />))
            }
          </Tabs>
        </div>
        <div className={styles.collapseBox}>
          <div className={styles.titleBox}>
            <span className={isMOTMission ? styles.parentClass : styles.parentClassSelf}>任务大类</span>
            {
              !isMOTMission ? null : (<span className={styles.missionId}>事件ID</span>)
            }
            <span className={styles.childClass}>任务子类/事件名称</span>
            <span className={styles.optionClass}>客户反馈选项</span>
          </div>
          {
            !_.isEmpty(missionList)
              ? (
                <span>
                  <Collapse
                    activeKey={collapseActiveKey}
                    onChange={this.handleChangeCollapse}
                    accordion
                  >
                    { this.renderPanelListComponent() }
                  </Collapse>
                  <div className={styles.pageBox}>
                    <Pagination
                      current={pageNum}
                      total={page.totalCount}
                      pageSize={page.pageSize}
                      onChange={this.handlePageChange}
                    />
                  </div>
                </span>
              )
              : (
                <div className={styles.emptyContent}>
                  <span>
                    <Icon type="frown-o" />
暂无数据
                  </span>
                </div>
              )
          }
          <div className={styles.clear} />
        </div>
        {
          !addTemplateModal ? null
            : (
              <TaskBindTemplateModal
                data={templateList}
                visible={addTemplateModal}
                onOK={this.handleTaskBindTemplateModalOK}
                onCancel={this.handleCloseModal}
                queryTemplateList={queryTemplateList}
              />
            )
        }
      </div>
    );
  }
}

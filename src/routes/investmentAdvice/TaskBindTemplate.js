/*
 * @Description: 任务绑定客户反馈
 * @Author: XuWenKang
 * @Date: 2017-12-21 14:49:16
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-05 20:30:54
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Tabs, Modal, Collapse, Icon, Popover, Button, Input } from 'antd';
import _ from 'lodash';
import cx from 'classnames';

import Pagination from '../../components/common/Pagination';
import logable from '../../decorators/logable';
import {
  TASK_LIST,
  MOT_TASK,
} from './config';

import styles from './taskBindTemplate.less';

const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
// const confirm = Modal.confirm;
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
  }

  static contextTypes = {
    dict: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 展示添加投资建议模板的弹出层
      addTemplateModall: false,
      // 当前显示 MOT任务页签内容还是自建任务页签内容,默认为MOT
      active: MOT_TASK.key,
      // 显示哪个折叠面板
      collapseActiveKey: '',
      // MOT任务可以根据关键字的搜索任务
      keyWord: '',
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
  queryTaskBindList({ type, pageNum = 1, pageSize = 10, keyWord = '' } = {}) {
    const isMot = type === MOT_TASK.key;
    const query = { type, pageNum, pageSize };
    if (isMot) {
      query.keyWord = keyWord;
    }
    this.props.getTaskBindList(query);
  }

  // 关闭弹窗
  @autobind
  handleCloseModal() {
    this.setState({
      addTemplateModall: false,
    });
  }

  // 切换折叠面板
  @autobind
  @logable({ type: 'Click', payload: { name: '切换折叠面板' } })
  handleChangeCollapse(collapseActiveKey) {
    this.setState({ collapseActiveKey });
  }

  @autobind
  handlePageChange(pageNum) {
    const { active, keyWord } = this.state;
    this.queryTaskBindList({ type: active, pageNum, keyWord });
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
  @logable({ type: 'Click', payload: { name: '切换Tab：MOT任务/自建任务' } })
  handleSwitchTabClick(active) {
    this.setState({ active });
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
    });
  }

  // 将投资建议模板中的内容里面的 $服务经理 参数进行使用html标签包装文本
  // 使其显示高亮
  @autobind
  replaceInvestAdviceParameterInContent(content) {
    const reg = this.generateParameterReg();
    const newContent = content.replace(reg,
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
        <span className={taskCls} >{item.parentClassName}</span>
        {
          isMot ? (<span className={styles.missionId}>{item.id}</span>) : null
        }
        <span className={styles.childClass} title={item.childClassName}>{item.childClassName}</span>
        <span className={styles.optionClass}>查看<Icon type="up" /><Icon type="down" /></span>
      </div>
    );
  }

  @autobind
  renderInvestAdviceTamplate(list = []) {
    return list.map(tmpl =>
      (<div className={styles.templates} key={tmpl.id}>
        <div className={styles.title}>
          <div className={styles.titleText}>{tmpl.title}</div>
          <div className={styles.delIcon} onClick={() => this.handleDelTemplateClick(tmpl.id)}>
            <Icon type="close-circle" />
          </div>
        </div>
        <Popover content="xoxoxo">
          <div
            className={styles.content}
            dangerouslySetInnerHTML={this.replaceInvestAdviceParameterInContent(tmpl.content)} // eslint-disable-line
          />
        </Popover>
      </div>
    ));
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
            >
              新增
            </Button>
          </div>
        </Panel>
      );
    });
  }

  render() {
    const { dict } = this.context;
    if (_.isEmpty(dict)) return null;

    const {
      addTemplateModall,
      collapseActiveKey,
      active,
    } = this.state;

    const { taskBindTemplate: { page = {}, missionList = [] } } = this.props;

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
              isMOTMission ?
                <Search
                  onKeyDown={this.preventKeyDownPropagation}
                  placeholder="事件ID/事件名称"
                  style={{ width: 186 }}
                  onSearch={this.searchMotMission}
                  enterButton
                /> :
                null
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
            !_.isEmpty(missionList) ?
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
                    current={page.pageNum}
                    total={page.totalCount}
                    pageSize={page.pageSize}
                    onChange={this.handlePageChange}
                  />
                </div>
              </span>
              :
              (
                <div className={styles.emptyContent}>
                  <span><Icon type="frown-o" />暂无数据</span>
                </div>
              )
          }
          <div className={styles.clear} />
        </div>
        {
          !addTemplateModall ? null
          : (
            <Modal
              title="请选择恰当的投资建议模板"
              visible={addTemplateModall}
              onOk={this.handleAddFeedback}
              onCancel={this.handleCloseModal}
              width={650}
              wrapClassName={styles.feedbackAddModalWarp}
            >
              <div>暂无</div>
            </Modal>
          )
        }
      </div>
    );
  }
}

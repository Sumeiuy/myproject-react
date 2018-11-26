/*
 * @Description: 客户反馈选项维护
 * @Author: LiuJianShu
 * @Date: 2017-12-25 13:59:04
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-27 15:55:13
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Collapse, Icon, message } from 'antd';

import Button from '../../../components/common/Button';
import EditInput from './EditInput';
import Pagination from '../../common/Pagination';
// 此处为funcition,而非组件，所以使用小写打头
import confirm from '../../../components/common/confirm_';
import logable from '../../../decorators/logable';

import styles from './optionsMaintain.less';

const Panel = Collapse.Panel;

export default class OptionsMaintain extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 查询客户反馈列表
    queryFeedbackList: PropTypes.func.isRequired,
    feedbackData: PropTypes.object.isRequired,
    // 删除客户反馈选项
    delFeedback: PropTypes.func.isRequired,
    // 增加客户反馈选项
    addFeedback: PropTypes.func.isRequired,
    // 编辑客户反馈选项
    modifyFeedback: PropTypes.func.isRequired,
    // 修改一级客户反馈后，返回的相关涨乐客户选项超过4个的任务数量
    taskNum: PropTypes.number.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 折叠面板当前展开的id,
      collapseActiveKey: '',
      // 是否添加一级反馈可选项
      addParentClass: false,
      // 判断是需要增加二级反馈项的服务经理一级反馈可选项
      beAddedParentId: '',
    };
  }

  // 同步页码到url
  @autobind
  syncPageDataToUrl() {
    const { replace } = this.context;
    const { location: { query, pathname } } = this.props;
    const { feedbackData: { page = {} } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        pageNum: page.pageNum || 1,
      },
    });
  }

  // 查询客户反馈列表
  @autobind
  queryFeedbackList(pageNum = 1, pageSize = 20) {
    this.props.queryFeedbackList({ pageNum,
pageSize }).then(this.syncPageDataToUrl);
  }

  // 修改反馈选项的文字后的弹出层的OK建处理程序,
  // 修改服务经理一级反馈选项文字，需要将custFeedbackName一并传递过去
  // 修改服务经理二级反馈选项文字, custFeedbackName传空字符串
  @autobind
  handleModifySMFeedbackText(name, item) {
    const { id, custFeedbackName = '' } = item;
    const { location: { query: { pageNum } } } = this.props;
    this.props.modifyFeedback({ id,
name,
custFeedbackName }).then(() => {
      this.queryFeedbackList(pageNum);
    });
  }

  // 修改涨乐客户反馈一级选项文字
  @autobind
  handleEditZLFeedbackTextConfirmOK(custFeedbackName, item) {
    const { id, name } = item;
    const { location: { query: { pageNum } } } = this.props;
    this.props.modifyFeedback({ id,
name,
custFeedbackName }).then(() => {
      const { taskNum } = this.props;
      // 修改一级客户反馈后，返回的相关涨乐客户选项超过4个的任务数量
      // 如果大于0条，则弹出让用户去任务绑定Tab下修改
      if (taskNum > 0) {
        const content = `您的修改导致有${taskNum}条任务的客户反馈超过了4项，请在“任务绑定客户反馈”下调整带警示标记的任务，否则涨乐客户端回无法正常处理`;
        confirm({ content });
      }
      this.queryFeedbackList(pageNum);
    });
  }

  // 修改服务经理可选项一级反馈文字
  @autobind
  handleUpdateFeedbackOfServiceManager(name, item) {
    if (_.isEmpty(name)) {
      confirm({
        shortCut: 'feedbackMaintainNotEmpty',
        onOk: _.noop,
      });
    } else {
      confirm({
        shortCut: 'feedbackMaintainUpdate',
        onOk: () => this.handleModifySMFeedbackText(name, item),
      });
    }
  }

  // 修改涨乐客户反馈一级可选项文字
  @autobind
  handleUpdateFirstFeedbackOfZhangLeCust(name, item) {
    // 涨乐客户可选反馈可以为空，所以不需要检验，空的情况
    confirm({
      shortCut: 'feedbackMaintainUpdate',
      onOk: () => this.handleEditZLFeedbackTextConfirmOK(name, item),
    });
  }

  // 删除服务经理反馈可选项的二级反馈选项
  @autobind
  @logable({ type: 'Click',
payload: { name: '删除二级反馈选项' } })
  deleteSecondFeedbackOfServiceManager(item, e) {
    const { id, parentId } = item;
    const { feedbackData: { feedbackList = [] } } = this.props;
    if (id) {
      const parentNode = _.find(feedbackList, v => v.id === parentId);
      if (parentNode.childList.length < 2) {
        message.error('必须保留一个子类');
        return;
      }
      this.deleteConfirm(id, e);
    }
  }

  // 删除一级客户反馈选项
  @autobind
  @logable({ type: 'Click',
payload: { name: '删除一级反馈选项' } })
  deleteFirstFeedbackOfServiceManager(item, e) {
    const { id } = item;
    this.deleteConfirm(id, e);
  }

  // 删除服务经理的二级反馈客户反馈
  // 删除整条反馈维护记录
  @autobind
  @logable({ type: 'Click',
payload: { name: '删除',
value: '$args[0]' } })
  deleteConfirm(id, e) {
    const { location: { query: { pageNum } } } = this.props;
    const { delFeedback } = this.props;
    if (e) {
      e.stopPropagation();
    }
    confirm({
      shortCut: 'feedbackMaintainDelete',
      onOk: () => {
        delFeedback({ id }).then(() => { this.queryFeedbackList(pageNum); });
      },
    });
  }

  // 显示添加二级反馈选项的输入框
  @autobind
  @logable({ type: 'ButtonClick',
payload: { name: '+新增二级' } })
  showAddSecondFeedbackInput() {
    // 因为折叠面板的key就是反馈列表一级反馈选项的id值
    const { collapseActiveKey } = this.state;
    this.setState({
      beAddedParentId: collapseActiveKey,
    });
  }

  // 隐藏添加二级反馈客户可选项的输入框
  @autobind
  hideAddSecondFeedbackInput() {
    this.setState({ beAddedParentId: '' });
  }

  // 在新增一级或者二级客户反馈可选项之后的操作
  @autobind
  doAfterAddFeedbackOption() {
    const { location: { query: { pageNum } } } = this.props;
    this.queryFeedbackList(pageNum);
    this.setState({
      beAddedParentId: '',
      addParentClass: false,
    });
  }

  // 新增服务经理可选项下的二级客户反馈选项
  @autobind
  handleAddSecondClassOfServiceManagerOption(name, item) {
    const { parentId } = item;
    // 因为新需求的接口中要求，custFeedbackName为必传值，
    // 而由于涨乐客户反馈不能修改二级选项，所以传空字符串即可
    this.addFeedbackOption({ name,
parentId,
custFeedbackName: '' });
  }

  // 新增服务经可选项或者客户涨乐可选项的一级反馈选项
  @autobind
  handleAddFirstClassOfFeedbackOption(name) {
    // 因为一级反馈选项没有父节点
    // 新建一级反馈选项的时候，涨乐客户反馈选项，默认值为空，
    // 所以新增的时候，custFeedbackName 传空字符串
    this.addFeedbackOption({ name,
parentId: '',
custFeedbackName: '' });
  }

  // 新增服务经理可选项|客户涨乐可选项一级选项
  @autobind
  addFeedbackOption(option) {
    this.props.addFeedback(option).then(this.doAfterAddFeedbackOption);
  }

  // 点击添加一级反馈选项
  @autobind
  @logable({ type: 'ButtonClick',
payload: { name: '+反馈类型' } })
  parentAddHandle() {
    this.setState({
      addParentClass: true,
    });
  }

  // 取消添加一级反馈选项
  @autobind
  handleCancelAddParent() {
    this.setState({
      addParentClass: false,
    });
  }

  // 切换折叠面板
  @autobind
  @logable({ type: 'ButtonClick',
payload: { name: '切换折叠面板' } })
  handleChangeCollapse(collapseActiveKey) {
    // 此处出来的key值已经从数值转换成了字符串
    this.setState({ collapseActiveKey });
  }

  // 翻页
  @autobind
  handlePageChange(pageNum) {
    this.queryFeedbackList(pageNum);
  }

  // 渲染折叠面板的头部header，此为客户反馈可选项的一级可选项
  // TODO 新需求，需要新增 客户涨乐可选项
  @autobind
  renderCollapsePanelHeader(item) {
    return (
      <div className={styles.header}>
        {/** 服务经理可选项，编辑框 */}
        <EditInput
          editName="服务经理可选项"
          value={item.name}
          item={item}
          editable={item.edit}
          onEditConfirm={this.handleUpdateFeedbackOfServiceManager}
        />
        {/** 客户涨乐可选项，编辑框, 客户可选项字符长度最大为7 */}
        <EditInput
          editName="客户涨乐可选项"
          maxLen={7}
          value={item.custFeedbackName || ''}
          item={item}
          editable={item.edit}
          onEditConfirm={this.handleUpdateFirstFeedbackOfZhangLeCust}
        />
        <div className={styles.lengthDiv}>{item.length || 0}项<Icon type="up" /><Icon type="down" /></div>
        <div className={styles.actionDiv}>
          <Icon type="delete" title="删除" onClick={e => this.deleteFirstFeedbackOfServiceManager(item, e)} />
        </div>
      </div>
    );
  }

  // 渲染二级反馈列表
  // 目前只有服务经理可选项存在二级反馈，并且可以修改|删除
  @autobind
  renderChildrenFeedbackList(parentId, children = []) {
    return _.map(children, (child) => {
      const btnGroup = (
        <Icon
          type="delete"
          title="删除"
          onClick={e => this.deleteSecondFeedbackOfServiceManager({ ...child,
parentId }, e)}
        />
      );
      // 因为由于二级反馈选项的原始数据中并没有对应的一级反馈选项的id值，
      // 因此此处需要将父节点放入子节点中,此处为修改二级反馈的文字
      return (
        <li key={child.id}>
          <EditInput
            editName="服务经理二级可选项"
            value={child.name}
            item={{ ...child,
parentId }}
            btnGroup={btnGroup}
            editable={child.edit}
            onEditConfirm={this.handleUpdateFeedbackOfServiceManager}
          />
        </li>
      );
    });
  }

  // 渲染用来 新增二级反馈可选项的输入框
  @autobind
  renderChildAddClassInput(id) {
    const { beAddedParentId } = this.state;
    // 如果当前的父节点，就是目标节点的时候，
    // 则按新增子类型按钮，会在相应的折叠面板下，显示输入框
    // 只有在服务经理可选项中 有该功能
    if (beAddedParentId === id) {
      return (
        <li>
          <EditInput
            editName="服务经理二级可选项"
            editable
            item={{ parentId: id }}
            onEditConfirm={this.handleAddSecondClassOfServiceManagerOption}
            onCancel={this.hideAddSecondFeedbackInput}
          />
        </li>
      );
    }
    return null;
  }

  // 渲染Collapse里面所有的feedbackList
  @autobind
  renderCollapseAllPanels(feedbackList) {
    return _.map(feedbackList, (item, index, array) => {
      // 面板的头部，展示以及反馈列表的一级可选项
      const panelHeader = this.renderCollapsePanelHeader(item, index, array);
      const { id, childList = [] } = item;
      // TODO 此处使用id值来代表折叠面板的key值，
      // 该id值可以在后续查询数据，修改数据时候使用,
      // 此处id值为Number，但是经过antd的collapse使用后，传递出来的已经变成了String，
      // 所以此处统一将id值设置为String
      return (
        <Panel header={panelHeader} key={`${id}`}>
          <ul>
            {/* 展示二级反馈可选项 */}
            {this.renderChildrenFeedbackList(id, childList)}
            {/* 添加二级反馈的输入框 */}
            {this.renderChildAddClassInput(`${id}`)}
            {/* 添加二级反馈可选项的按钮 */}
            <li>
              <Button
                type="primary"
                onClick={this.showAddSecondFeedbackInput}
                icon="plus"
                ghost
              >
                新增二级
              </Button>
            </li>
          </ul>
        </Panel>
      );
    });
  }

  render() {
    const { feedbackData: { page = {}, feedbackList = [] } } = this.props;
    const { collapseActiveKey, addParentClass } = this.state;

    return (
      <div className={styles.optionsMaintain}>
        <div className={styles.parentAddBtn}>
          <Button type="primary" onClick={this.parentAddHandle} icon="plus" ghost >反馈类型</Button>
        </div>
        <h2 className={styles.title}>
          请在此维护客户反馈字典，客户反馈由两级内容组成，即反馈大类和反馈子类；可选项分服务经理可选项和客户涨乐可选项，设置了客户涨乐可选项则会显示在涨乐财富通中供客户选择。
        </h2>
        {/** 头部添加服务经理可选项|客户涨乐反馈可选项的输入框 */}
        <div className={styles.addParentClassBox}>
          {
            !addParentClass ? null
              : (<EditInput
                editName="服务经理可选项"
                editable
                onEditConfirm={this.handleAddFirstClassOfFeedbackOption}
                onCancel={this.handleCancelAddParent}
              />)
          }
        </div>
        {/** 头部服务经理可选项 | 客户涨乐反馈可选项 | 操作 头部 */}
        <div className={styles.optiaonsListCaption}>
          <div className={styles.optionCaption}>服务经理可选项</div>
          <div className={styles.optionCaption}>客户涨乐可选项</div>
          <div className={styles.optionLengthCaption}>{/** 列表头部占空位使用,用来与下面的几项保持相同的大小位置展示 */}</div>
          <div className={styles.optionActionCaption}>操作</div>
        </div>
        <Collapse activeKey={collapseActiveKey} onChange={this.handleChangeCollapse} accordion>
          {this.renderCollapseAllPanels(feedbackList)}
        </Collapse>
        <div className={styles.pageBox}>
          <Pagination
            current={page.pageNum}
            total={page.totalCount}
            pageSize={page.pageSize}
            onChange={this.handlePageChange}
          />
        </div>
        <div className={styles.clear} />
      </div>
    );
  }
}

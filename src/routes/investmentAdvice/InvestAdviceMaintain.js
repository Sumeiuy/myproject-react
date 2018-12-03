/*
 * @Author: zhangjun
 * @Date: 2018-04-24 14:14:04
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-29 10:00:25
 * @Descripter:投资建议模板 Home页面
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import {
  Button, Collapse, Icon, Mention
} from 'antd';

import Pagination from '../../components/common/Pagination';
import CommonModal from '../../components/common/biz/CommonModal';
import confirm from '../../components/common/confirm_';
import { logPV } from '../../decorators/logable';
import TemplateForm from '../../components/operationManage/investmentAdvice/TemplateForm';

import { MENTION_PREFIX, MentionTextStyles } from './config';

import styles from './investAdviceMaintain.less';

const Panel = Collapse.Panel;
const { toContentState } = Mention;

export default class InvestmentAdvice extends PureComponent {
  static propTypes = {
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
  }

  constructor(props) {
    super(props);
    this.state = {
      // 是否显示弹层
      showModal: false,
      // 弹出层操作类型，'CREATE'为新建模板 'UPDATE': 为编辑模板
      action: 'CREATE',
      // 折叠面板打开的id
      collapseActiveKey: '',
      // commonModal组件参数
      modalKey: 'addInvestAdviceTemplate',
      // 编辑模板初始化参数
      initialTemplateParams: {},
      // 内容提示框错误状态
      isShowContentStatusError: false,
      // 内容提示框错误提示信息
      contentStatusErrorMessage: '',
      // 标题提示框错误状态
      isShowTitleStatusError: false,
      // 标题提示框错误提示信息
      titleStatusErrorMessage: '',
      // 当前页码
      pageNum: 1,
      // 每页条数
      pageSize: 10,
      // 投资建议模板标题
      title: '',
      // 投资建议模板内容
      content: '',
    };
  }

  componentDidMount() {
    this.getInvestAdviceList();
  }

  // 获取投资建议模版列表
  @autobind
  getInvestAdviceList({ pageNum = 1, pageSize = 10 } = {}) {
    this.props.getInvestAdviceList({
      pageNum,
      pageSize,
    });
  }

  // 新增投资建议模板
  @autobind
  @logPV({
    pathname: '/modal/addInvestAdviceTpl',
    title: '新增投资建议模板'
  })
  addInvestAdviceTemplate() {
    this.setState({
      showModal: true,
      action: 'CREATE',
      initialTemplateParams: {},
      isShowContentStatusError: false,
      isShowTitleStatusError: false,
    });
  }

  // 编辑投资建议模板
  @autobind
  @logPV({
    pathname: '/modal/editInvestAdviceTpl',
    title: '编辑投资建议模板'
  })
  editInvestAdviceTemplate(item) {
    this.setState({
      showModal: true,
      action: 'UPDATE',
      initialTemplateParams: item,
      isShowContentStatusError: false,
      isShowTitleStatusError: false,
      title: item.title,
      content: item.content,
    });
  }

  // 切换折叠面板
  @autobind
  handleChangeCollapse(collapseActiveKey) {
    this.setState({ collapseActiveKey });
  }

  // 删除投资建议模板确认弹窗
  @autobind
  @logPV({
    pathname: '/modal/deleteConfirmFrame',
    title: '删除投资建议模板确认弹窗'
  })
  deleteConfirm(id, e) {
    if (e) {
      e.stopPropagation();
    }
    const self = this;
    confirm({
      content: '删除的信息在系统中实时生效，会影响到已关联的任务，确认要删除吗？',
      onOk() {
        self.deleteInvestAdvice({ id });
      },
    });
  }

  // 删除投资建议模板
  @autobind
  deleteInvestAdvice(params) {
    const { list = [], page = {} } = this.props.investmentAdvices;
    this.props.deleteInvestAdvice(params).then(() => {
      if (this.props.deleteSuccessStatus) {
        const { curPageNum } = page;
        // 判断是否最后一条
        if (list.length < 2) {
          // 最后一条数据
          // 需要查询前一页的数据
          if (curPageNum === 1) {
            this.getInvestAdviceList({ pageNum: 1 });
          } else {
            this.getInvestAdviceList({ pageNum: curPageNum - 1 });
          }
        } else {
          this.getInvestAdviceList({ pageNum: curPageNum });
        }
      }
    });
  }

  // 切换当前页
  @autobind
  handlePageChange(pageNum) {
    this.getInvestAdviceList({ pageNum });
  }

  // 校验mention内容提及框
  @autobind
  checkMention(mentions) {
    if (!mentions) {
      this.setState({
        isShowContentStatusError: true,
        contentStatusErrorMessage: '请输入内容',
      });
    } else if (mentions.length > 500) {
      this.setState({
        isShowContentStatusError: true,
        contentStatusErrorMessage: '内容长度不能超过500字',
      });
    } else {
      this.setState({
        isShowContentStatusError: false,
      });
      return true;
    }
    return false;
  }

  // 校验标题
  @autobind
  checkTitle(title) {
    if (!title) {
      this.setState({
        isShowTitleStatusError: true,
        titleStatusErrorMessage: '请输入标题',
      });
    } else if (title.length > 15) {
      this.setState({
        isShowTitleStatusError: true,
        titleStatusErrorMessage: '标题长度不能超过15字',
      });
    } else {
      this.setState({
        isShowTitleStatusError: false,
      });
      return true;
    }
    return false;
  }

  // 弹窗确定按钮
  @autobind
  handleOk() {
    const {
      action,
      initialTemplateParams,
      title,
      content,
    } = this.state;
    const checkContentStatus = this.checkMention(content);
    const checkTitleStatus = this.checkTitle(title);
    if (checkTitleStatus && checkContentStatus) {
      const templateId = initialTemplateParams.id || '';
      const params = {
        templateId,
        action,
        title,
        content,
      };
      const { page: { curPageNum = 1 } } = this.props.investmentAdvices;
      this.props.modifyInvestAdvice(params).then(() => {
        if (this.props.modifySuccessStatus) {
          this.handleCancel();
          this.getInvestAdviceList({ pageNum: curPageNum });
        }
      });
    }
  }

  @autobind
  handleTemplateFormChange(param) {
    this.setState({
      ...param,
    });
  }

  // 弹窗取消按钮
  @autobind
  handleCancel() {
    this.setState({
      title: '',
      content: '',
      showModal: false,
      isShowContentStatusError: false,
      isShowTitleStatusError: false,
    });
  }

  render() {
    const {
      showModal,
      collapseActiveKey,
      initialTemplateParams,
      isShowContentStatusError,
      contentStatusErrorMessage,
      isShowTitleStatusError,
      titleStatusErrorMessage,
      defaultMissionDesc,
      modalKey,
      action,
    } = this.state;
    const { list = [], page = {} } = this.props.investmentAdvices;
    const { curPageNum, pageSize, totalRecordNum } = page;
    const investmentAdviceList = list.map((item) => {
      const header = (
        <div className={styles.collapseHead}>
          <span className={styles.title}>{item.title}</span>
          <div className={styles.contentwapper}>
            <span className={styles.content}>{item.content}</span>
            <i className={styles.icon}>
              <Icon type="up" />
              <Icon type="down" />
            </i>
          </div>
          <span className={styles.operate}>
            <Icon type="delete" onClick={e => this.deleteConfirm(item.id, e)} />
          </span>
        </div>
      );
      return (
        <Panel header={header} key={item.id}>
          <div className={styles.collapsePanel}>
            <Mention
              mentionStyle={MentionTextStyles}
              style={{
                width: '100%',
                height: 50
              }}
              readOnly
              multiLines
              prefix={MENTION_PREFIX}
              value={toContentState(item.content)}
            />
            <Button onClick={e => this.editInvestAdviceTemplate(item, e)}>编辑</Button>
          </div>
        </Panel>
      );
    });

    return (
      <div className={styles.investmentAdviceWrapper}>
        <div className={styles.tipsBox}>
          <p>请在此定义投顾可以选择的投资建议固定话术。</p>
          <Button type="primary" icon="plus" ghost onClick={this.addInvestAdviceTemplate}>模板</Button>
        </div>
        <div className={styles.collapseBox}>
          <div className={styles.head}>
            <span className={styles.title}>标题</span>
            <span className={styles.headcontent}>内容</span>
            <span className={styles.operate}>操作</span>
          </div>
          <Collapse
            activeKey={collapseActiveKey}
            onChange={this.handleChangeCollapse}
            accordion
          >
            {investmentAdviceList}
          </Collapse>
        </div>
        <div className={styles.pageBox}>
          { _.isEmpty(page) ? null
            : (
              <Pagination
                current={curPageNum}
                total={totalRecordNum}
                pageSize={pageSize}
                onChange={this.handlePageChange}
              />
            )
          }

        </div>
        <div className={styles.clear} />
        {
          !showModal ? null
            : (
              <CommonModal
                title={action === 'CREATE' ? '新建模板' : '编辑模板'}
                visible={showModal}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                closeModal={this.handleCancel}
                modalKey={modalKey}
                maskClosable={false}
                wrapClassName={styles.investAdviceModal}
              >
                <TemplateForm
                  defaultMissionDesc={defaultMissionDesc}
                  initialTemplateParams={initialTemplateParams}
                  isShowContentStatusError={isShowContentStatusError}
                  contentStatusErrorMessage={contentStatusErrorMessage}
                  isShowTitleStatusError={isShowTitleStatusError}
                  titleStatusErrorMessage={titleStatusErrorMessage}
                  checkMention={this.checkMention}
                  checkTitle={this.checkTitle}
                  onChange={this.handleTemplateFormChange}
                />
              </CommonModal>
            )
        }
      </div>
    );
  }
}

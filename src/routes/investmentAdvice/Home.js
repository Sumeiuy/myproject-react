/*
 * @Author: zhangjun
 * @Date: 2018-04-24 14:14:04
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-04-27 13:11:27
 * @Descripter:投资建议模板 Home页面
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Button, Collapse, Icon, Mention } from 'antd';

import { dva } from '../../helper';
import Pagination from '../../components/common/Pagination';
import CommonModal from '../../components/common/biz/CommonModal';
import confirm from '../../components/common/confirm_';
import TemplateForm from '../../components/operationManage/investmentAdvice/TemplateForm';
import styles from './home.less';

const Panel = Collapse.Panel;
const { toString, toContentState } = Mention;
// Mention属性
const PREFIX = ['$'];
const mentionTextStyle = {
  color: '#2d84cc',
  backgroundColor: '#ebf3fb',
  borderColor: '#ebf3fb',
};
// 使用helper里面封装的生成effects的方法
const effect = dva.generateEffect;

const effects = {
  getList: 'investmentAdvice/getInvestmentAdviceList',
  delete: 'investmentAdvice/deleteInvestAdvice',
  modify: 'investmentAdvice/modifyInvestAdvice',
};

const mapStateToProps = state => ({
  // 投资模板列表
  investmentAdvices: state.investmentAdvice.investmentAdvices,
  // 删除是否成功
  deleteSuccessStatus: state.investmentAdvice.deleteSuccessStatus,
  // 新建或编辑模版是否成功
  modifySuccessStatus: state.investmentAdvice.modifySuccessStatus,
});

const mapDispatchToProps = {
  // 获取投资建议模版列表
  getInvestAdviceList: effect(effects.getList),
  // 删除投资建议固定话术模板
  deleteInvestAdvice: effect(effects.delete, { loading: false }),
  // 新建或编辑模版
  modifyInvestAdvice: effect(effects.modify),
};

@connect(mapStateToProps, mapDispatchToProps)
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
      // 弹层标题
      modelTitle: '新建模板',
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
    };
  }

  componentDidMount() {
    this.getInvestAdviceList();
  }

  // 获取投资建议模版列表
  @autobind
  getInvestAdviceList() {
    const { pageNum, pageSize } = this.state;
    this.props.getInvestAdviceList({
      pageNum,
      pageSize,
    });
  }

  // 新增投资建议模板
  @autobind
  addInvestAdviceTemplate() {
    this.setState({
      showModal: true,
      modelTitle: '新建模板',
      initialTemplateParams: {},
    });
  }

  // 编辑投资建议模板
  @autobind
  editInvestAdviceTemplate(item) {
    console.log('item', item);
    this.setState({
      showModal: true,
      modelTitle: '编辑模板',
      initialTemplateParams: item,
    });
  }

  // 切换折叠面板
  @autobind
  handleChangeCollapse(collapseActiveKey) {
    this.setState({ collapseActiveKey });
  }

  // 删除投资建议模板确认弹窗
  @autobind
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
      onCancel() {
        console.log('取消删除');
      },
    });
  }

  // 删除投资建议模板
  @autobind
  deleteInvestAdvice(params) {
    this.props.deleteInvestAdvice(params).then(() => {
      if (this.props.deleteSuccessStatus) {
        this.getInvestAdviceList();
        if (!this.investmentAdvices.list.length) {
          this.setState({ pageNum: this.state.pageNum - 1 }, this.getInvestAdviceList);
        }
      }
    });
  }

  // 切换当前页
  @autobind
  handlePageChange(pageNum) {
    this.setState({ pageNum }, this.getInvestAdviceList);
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
      console.warn('111');
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
    const { getFieldValue } = this.formTemplate;
    const content = toString(getFieldValue('content'));
    const title = getFieldValue('title') || '';
    const type = getFieldValue('type');
    const checkContentStatus = this.checkMention(content);
    const checkTitleStatus = this.checkTitle(title);
    const {
      modelTitle,
      initialTemplateParams,
     } = this.state;
    if (checkTitleStatus && checkContentStatus) {
      const id = initialTemplateParams.id || '';
      const action = modelTitle === '新建模板' ? 'CREATE' : 'UPDATE';
      const params = {
        id,
        action,
        title,
        content,
        type,
      };
      this.props.modifyInvestAdvice(params).then(() => {
        if (this.props.modifySuccessStatus) {
          this.handleCancel();
          this.getInvestAdviceList();
        }
      });
    }
  }

  // 弹窗取消按钮
  @autobind
  handleCancel() {
    this.setState({
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
      modelTitle,
    } = this.state;
    const { list = [], page = {} } = this.props.investmentAdvices;
    const { curPageNum, pageSize, totalPageNum } = page;
    const investmentAdviceList = list.map((item) => {
      const header = (<div className={styles.collapseHead}>
        <span className={styles.type}>{item.typeName}</span>
        <span className={styles.title}>{item.title}</span>
        <p className={styles.contentwapper}>
          <span className={styles.content}>{item.content}</span>
          <i className={styles.icon}><Icon type="up" /><Icon type="down" /></i>
        </p>
        <span className={styles.operate} >
          <Icon type="delete" onClick={e => this.deleteConfirm(item.id, e)} />
        </span>
      </div>);
      return (
        <Panel header={header} key={item.id}>
          <div className={styles.collapsePanel}>
            <Mention
              mentionStyle={mentionTextStyle}
              style={{ width: '100%', height: 50 }}
              readOnly
              multiLines
              prefix={PREFIX}
              defaultValue={toContentState(item.content)}
            />
            <Button onClick={e => this.editInvestAdviceTemplate(item, e)} >编辑</Button>
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
            <span className={styles.type}>类型</span>
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
                total={totalPageNum}
                pageSize={pageSize}
                onChange={this.handlePageChange}
              />
              )
          }

        </div>
        {
          !showModal ? null
          : (<CommonModal
            title={modelTitle}
            visible={showModal}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            closeModal={this.handleCancel}
            modalKey={modalKey}
          >
            <TemplateForm
              ref={(form) => { this.formTemplate = form; }}
              defaultMissionDesc={defaultMissionDesc}
              initialTemplateParams={initialTemplateParams}
              isShowContentStatusError={isShowContentStatusError}
              contentStatusErrorMessage={contentStatusErrorMessage}
              isShowTitleStatusError={isShowTitleStatusError}
              titleStatusErrorMessage={titleStatusErrorMessage}
              checkMention={this.checkMention}
            />
          </CommonModal>)
        }
      </div>
    );
  }
}

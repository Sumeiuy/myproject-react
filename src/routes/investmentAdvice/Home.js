/*
 * @Author: zhangjun
 * @Date: 2018-04-24 14:14:04
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-04-25 22:07:09
 * @Descripter:投资建议模板 Home页面
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import { Button, Collapse, Icon } from 'antd';

import { dva } from '../../helper';
import Pagination from '../../components/common/Pagination';
import CommonModal from '../../components/common/biz/CommonModal';
import Confirm from '../../components/common/Confirm';
import TemplateAdd from '../../components/operationManage/investmentAdvice/TemplateAdd';
import styles from './home.less';

const Panel = Collapse.Panel;
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
      // 折叠面板打开的id
      collapseActiveKey: '',
      // TemplateAdd组件参数
      users: [],
      defaultMissionDesc: '',
      templetDescSuggestion: {
        type: '1',
        name: 'benjycui',
      },
      // commonModal组件参数
      modalKey: '1',
    };
  }

  componentDidMount() {
    // this.getInvestAdviceList();
  }

  // 获取投资建议模版列表
  @autobind
  getInvestAdviceList(pageNum = 1, pageSize = 10) {
    this.getInvestAdviceList({
      pageNum,
      pageSize,
    });
  }

  // 新增模板
  @autobind
  addTemplate() {
    this.setState({
      showModal: true,
    });
  }

  // 切换折叠面板
  @autobind
  handleChangeCollapse(collapseActiveKey) {
    this.setState({ collapseActiveKey });
  }

  // 删除投资建议
  deleteConfirm(id, e) {
    console.warn('e', e);
    if (e) {
      e.stopPropagation();
    }
    Confirm({
      content: '删除的信息在系统中实时生效，会影响到已关联的任务，确认要删除吗？',
      onOk() {
        console.log('确认删除');
        this.deleteInvestAdvice({ id });
      },
      onCancel() {
        console.log('取消删除');
      },
    });
  }

  @autobind
  deleteInvestAdvice(params) {
    console.warn('params', params);
    // this.props.deleteInvestAdvice().then(() => {
    //   console.warning('deleteSuccessStatus', this.props.deleteSuccessStatus);
    // });
  }

  // 切换当前页
  @autobind
  handlePageChange(pageNum, pagaSize) {
    console.log('pageNum', pageNum);
    console.log('pagaSize', pagaSize);
  }

  // 弹窗确定按钮
  @autobind
  handleOk() {
  }

  // 弹窗取消按钮
  @autobind
  handleCancel() {
    this.setState({
      showModal: false,
    });
  }
  render() {
    const { showModal, collapseActiveKey,
       users, defaultMissionDesc, modalKey, templetDescSuggestion } = this.state;
    const { list, page } = this.props.investmentAdvices;
    const { curPageNum, pageSize, totalPageNum } = page;
    const collapseProps = {
      activeKey: collapseActiveKey,
      onChange: this.handleChangeCollapse,
      accordion: true,
    };
    const paginationOption = {
      current: Number(curPageNum),
      total: Number(totalPageNum),
      pageSize: Number(pageSize),
      onChange: this.handlePageChange,
    };
    console.warn('list', list);
    console.warn('paginationOption', paginationOption);
    const investmentList = list.map((item) => {
      const header = (<div className={styles.collapseHead}>
        <span className={styles.type}>{item.type}</span>
        <span className={styles.title}>{item.title}</span>
        <p className={styles.contentwapper}>
          <span className={styles.content}>{item.content}</span>
          <i className={styles.icon}><Icon type="up" /><Icon type="down" /></i>
        </p>
        <span className={styles.operate} >
          <Icon type="delete" onClick={e => this.deleteConfirm(item.templateId, e)} />
        </span>
      </div>);
      return (
        <Panel header={header} key={item.templateId}>
          <div className={styles.collapsePanel}>
            <p>{item.content}</p>
            <Button>编辑</Button>
          </div>
        </Panel>
      );
    });
    return (
      <div className={styles.investmentAdviceWrapper}>
        <div className={styles.tipsBox}>
          <p>请在此定义投顾可以选择的投资建议固定话术。</p>
          <Button type="primary" icon="plus" ghost onClick={this.addTemplate}>模板</Button>
        </div>
        <div className={styles.collapseBox}>
          <div className={styles.head}>
            <span className={styles.type}>类型</span>
            <span className={styles.title}>标题</span>
            <span className={styles.headcontent}>内容</span>
            <span className={styles.operate}>操作</span>
          </div>
          <Collapse {...collapseProps}>{investmentList}</Collapse>
        </div>
        <div className={styles.pageBox}>
          <Pagination {...paginationOption} />
        </div>
        <CommonModal
          title="新增模板"
          visible={showModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          closeModal={this.handleCancel}
          modalKey={modalKey}
        >
          { showModal ?
            <TemplateAdd
              users={users}
              defaultMissionDesc={defaultMissionDesc}
              templetDescSuggestion={templetDescSuggestion}
            /> : ''
          }
        </CommonModal>
      </div>
    );
  }
}

/**
 * @Author: sunweibin
 * @Date: 2018-04-12 14:36:08
 * @Last Modified by: zhangmei
 * @Last Modified time: 2018-11-12 13:39:41
 * @description 投资建议弹出层
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import _ from 'lodash';

import { dva } from '../../../helper';
import logable, { logPV } from '../../../decorators/logable';
import CommonModal from '../biz/CommonModal';
import confirm from '../confirm_';
import FreeMode from './ChoiceInvestAdviceFreeMode';
import TmplMode from './ChoiceInvestAdviceTmplMode';

import styles from './choiceInvestAdviceModal.less';

const effect = dva.generateEffect;

const mapStateToProps = state => ({
  // 模板列表
  templateList: state.performerView.templateList,
  // 翻译模板列表的结果
  templateResult: state.performerView.templateResult,
});

const mapDispatchToProps = {
  // 获取模板列表
  getTemplateList: effect('performerView/getTemplateList', { forceFull: true }),
  // 翻译模板
  translateTemplate: effect('performerView/translateTemplate', { loading: false }),
};

// 投资建议的类型名称
const MODE_TYPE = {
  free: '手动输入',
  tmpl: '模板添加',
};

// 自建以及MOT人物的类型
const TASK_TYPE = {
  MOT: 1,
  SELF: 2,
};

@connect(mapStateToProps, mapDispatchToProps)
export default class ChoiceInvestAdviceModal extends PureComponent {

  static getDerivedStateFromProps(nextProps, prevState) {
    const { templateID: nextID, serveContent = {} } = nextProps;
    const { prevPropID } = prevState;
    if (nextID !== prevPropID) {
      return {
        templateID: nextID,
        prevPropID: nextID,
        title: serveContent.title || '',
      };
    }
    return null;
  }

  constructor(props) {
    // 此处需要进行初始化的 mode 判断
    super(props);
    const { serveContent = {} } = props;
    this.state = {
      // 投资建议内容获取方式， free为自由编辑，tmpl为投资建议模板
      mode: this.getInitialMode(props),
      // 自由话术模式下，需要验证标题是否符合要求,如果为true则显示提示信息
      validateTitle: false,
      // 自由话术模式下，需要验证内容是否符合要求,如果为true则显示提示信息
      validateContent: false,
      // 内容错误提示信息
      descErrorInfo: '',
      // 标题错误提示信息
      titleErrorInfo: '',
      // 在固定话术投资建议模板下，选择的模板ID号
      templateID: '',
      // 自由话术下的服务内容
      serveContent,
    };
    // 投资建议标题
    this.title = '';
    // 投资建议内容
    this.desc = '';
  }

  componentDidMount() {
    // 初始化的时候优先获取模板列表，
    // 如果获取的模板列表为空，则显示手动输入
    // 因为此处列表不做分页处理，所以pageNum固定为1，pageSize的值固定取100
    const { eventId, taskType, serviceTypeCode } = this.props;
    const type = parseInt(taskType, 10) + 1;
    let taskTypeCode = eventId;
    if (type === TASK_TYPE.SELF) {
      // type值为 1,为MOT任务
      // type值为 2,为自建任务
      // MOT任务使用eventID, 自建任务使用serviceTypeCode
      taskTypeCode = serviceTypeCode;
    }
    this.props.getTemplateList({
      pageNum: 1,
      pageSize: 100,
      taskTypeCode,
      type: `${type}`,
    }).then(() => {
      const { mode } = this.state;
      const { templateList } = this.props;
      const hasNoEmpty = _.isEmpty(templateList);
      // 此时 constructor 下已经将初始的 mode 计算出来
      // 此时，如果计算出来的 mode 是 tmpl,但是获取到的模板列表为空，
      // 则显示自由话术 free
      if (mode === 'tmpl' && hasNoEmpty) {
        this.setState({ mode: 'free' });
      }
    });
  }

  @autobind
  setChoiceInvestAdviceFreeModeRef(input) {
    this.freeModeRef = input;
  }

  @autobind
  getInitialMode(props) {
    // 1. 首先判断是否驳回后修改,如果是驳回后修改并且还未进行修改编辑的情况下
    // 为 free mode
    const { isReject, fromMode } = props;
    if (isReject && fromMode === '') {
      // 如果是驳回后修改并且还未进行修改编辑的情况下
      return 'free';
    } else if (isReject && fromMode !== '') {
      // 如果是驳回后修改已经进行过修改动作了
      return fromMode;
    } else if (!isReject && fromMode !== '') {
      // 如果是新建情况下，并且修改过的情况
      return fromMode;
    }
    return 'tmpl';
  }

  // 获取投资建议文本标题和内容
  @autobind
  getInvestAdviceFreeModeData(title, desc) {
    this.title = title;
    this.desc = desc;
  }
  // 关闭弹出层
  @autobind
  closeModal() {
    const { modalKey, onClose } = this.props;
    onClose(modalKey);
  }

  @autobind
  checkWallCollisionStatus(type) {
    if (this.props.testWallCollisionStatus) {
      if (type === 'title') {
        this.setState({
          titleErrorInfo: '推荐的产品未通过合规撞墙检测，请修改投资建议',
          validateTitle: true,
        });
      }
      if (type === 'desc') {
        this.setState({
          descErrorInfo: '推荐的产品未通过合规撞墙检测，请修改投资建议',
          validateContent: true,
        });
      }
      return false;
    }
    return true;
  }

  // 点击服务内容弹出层确认按钮
  @autobind
  async handleOK() {
    const { mode } = this.state;
    this.setState({
      validateTitle: false,
      validateContent: false,
    });
    if (mode === 'free' && this.freeModeRef.checkData()) {
      const title = this.title;
      const desc = this.desc;
      try {
        const { testWallCollision, onOK } = this.props;
        await testWallCollision({ content: title });
        if (this.checkWallCollisionStatus('title')) {
          await testWallCollision({ content: desc });
          if (this.checkWallCollisionStatus('desc')) {
            onOK({ title,
desc,
mode });
          }
        }
      } catch (e) {
        console.error(e);
      }
    } else if (mode === 'tmpl') {
      // 如果选择的是固定话术,则需要先翻译模板
      const { custId } = this.props;
      const { templateID, title } = this.state;
      if (templateID === '') {
        confirm({ content: '请选择模板！' });
        return;
      }
      await this.props.translateTemplate({
        templateId: templateID,
        custNumber: custId,
      });
      const { templateResult } = this.props;
      if (!_.isEmpty(templateResult)) {
        this.props.onOK({
          title,
          desc: templateResult.content,
          mode,
          templateID,
        });
      }
    }
  }

  @autobind
  handleSwitchModeConfirm() {
    // 从固定话术->自由编辑，清空用户选择的模板
    // 从自由编辑->固定话术，清空用户填写的信息
    const { mode } = this.state;
    if (mode === 'free') {
      this.setState({
        mode: 'tmpl',
        templateID: '',
      });
    } else {
      this.setState({
        mode: 'free',
        serveContent: {},
      });
    }
  }

  @autobind
  @logPV({
    pathname: '/modal/switchModeChangeConfirm',
    title: '切换涨乐财富通的服务内容',
  })
  handleSwitchModeChange() {
    // 当切换涨乐财富通的服务内容的方式的时候，需要提示下用户，修改的东西将会清空
    confirm({
      content: '您添加的服务内容未保存，如切换窗口信息将丢失，确认要切换吗？',
      onOk: this.handleSwitchModeConfirm,
    });
  }

  @autobind
  @logable({ type: 'Click',
payload: { name: '选择服务内容模板' } })
  handleSelectInvestAdviceTmpl({ id, title }) {
    this.setState({ templateID: id,
title });
  }

  render() {
    const {
      modalKey,
      visible,
      wrapClassName,
      isUpdate,
      // 投资建议文本撞墙检测是否有股票代码
      testWallCollisionStatus,
      onFormDataChange,
      templateList,
    } = this.props;

    const {
      mode,
      templateID,
      validateContent,
      validateTitle,
      descErrorInfo,
      titleErrorInfo,
      serveContent,
    } = this.state;

    // 如果模板列表为空的时候，显示自由编辑
    const isFreeMode = mode === 'free';
    // 此处需要增加，如果没有固定话术模板，则直接显示自由编辑
    const modeSwitchText = isFreeMode ? MODE_TYPE.tmpl : MODE_TYPE.free;

    return (
      <CommonModal
        title="添加服务内容"
        modalKey={modalKey}
        needBtn
        maskClosable={false}
        showCancelBtn
        size="large"
        visible={visible}
        closeModal={this.closeModal}
        okText="确认"
        onOk={this.handleOK}
        onCancel={this.closeModal}
        wrapClassName={wrapClassName}
      >
        <div className={styles.serveContentContainer}>
          <div className={styles.modalHeader}>
            <div className={styles.modeName}>{MODE_TYPE[mode]}</div>
            <div
              className={styles.modeSwitch}
              onClick={this.handleSwitchModeChange}
            >
              {modeSwitchText}
            </div>
          </div>
          {
            isFreeMode ?
            (
              <FreeMode
                ref={this.setChoiceInvestAdviceFreeModeRef}
                isUpdate={isUpdate}
                serveContent={serveContent}
                validateContent={validateContent}
                validateTitle={validateTitle}
                descErrorInfo={descErrorInfo}
                titleErrorInfo={titleErrorInfo}
                testWallCollisionStatus={testWallCollisionStatus}
                onGetInvestAdviceFreeModeData={this.getInvestAdviceFreeModeData}
                onFormDataChange={onFormDataChange}
              />
            )
            :
            (
              <TmplMode
                templateID={templateID}
                tmplList={templateList}
                onSelect={this.handleSelectInvestAdviceTmpl}
              />
            )
          }
        </div>
      </CommonModal>
    );
  }

}

ChoiceInvestAdviceModal.propTypes = {
  modalKey: PropTypes.string.isRequired,
  wrapClassName: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onOK: PropTypes.func.isRequired,
  serveContent: PropTypes.object,
  visible: PropTypes.bool,
  isUpdate: PropTypes.bool, // 是否编辑修改
  // 投资建议文本撞墙检测
  testWallCollision: PropTypes.func.isRequired,
  // 投资建议文本撞墙检测是否有股票代码
  testWallCollisionStatus: PropTypes.bool.isRequired,
  onFormDataChange: PropTypes.func,
  templateList: PropTypes.array,
  templateResult: PropTypes.object,
  getTemplateList: PropTypes.func,
  translateTemplate: PropTypes.func,
  eventId: PropTypes.string.isRequired,
  serviceTypeCode: PropTypes.string.isRequired,
  templateID: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  // 当时编辑内容的时候，判断之前的是哪个模式
  // 驳回修改不存在使用固定话术的情况
  // 因此在驳回后修改的情况下，目前只存在采用了自由话术的情况下
  fromMode: PropTypes.string.isRequired,
  // 判断当前是否驳回后修改的情景
  isReject: PropTypes.bool.isRequired,
  taskType: PropTypes.string.isRequired,
};

ChoiceInvestAdviceModal.defaultProps = {
  visible: false,
  isUpdate: false,
  wrapClassName: 'serveContentADD',
  serveContent: {},
  onFormDataChange: _.noop,
  templateList: [],
  templateResult: {},
  getTemplateList: _.noop,
  translateTemplate: _.noop,
  templateID: '',
  fromMode: '',
};

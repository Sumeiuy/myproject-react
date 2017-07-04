/**
 * @descript 看板编辑页面
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import { Input, Tooltip, Button, message } from 'antd';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import _ from 'lodash';

import SimpleEditor from '../../components/Edit/SimpleEditor';
import SelfSelect from '../../components/Edit/SelfSelect';
import BoardSelectTree from '../../components/Edit/BoardSelectTree';
import selectHandlers from '../../components/Edit/selectHelper';
import PreviewReport from '../reports/PreviewReport';
import { BackConfirmModal, PublishConfirmModal } from '../../components/modals';

import styles from './Home.less';

const fectchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  visibleRanges: state.edit.visibleRanges,
  boardInfo: state.edit.boardInfo,
  updateLoading: state.edit.updateLoading,
  publishLoading: state.edit.publishLoading,
  message: state.edit.message,
  indicatorLib: state.edit.indicatorLib,
  globalLoading: state.activity.global,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  getBoardInfo: fectchDataFunction(true, 'edit/getBoardInfo'),
  getVisibleRange: fectchDataFunction(false, 'edit/getVisibleRange'),
  getIndicatorLib: fectchDataFunction(false, 'edit/getIndicatorLib'),
  updateBoard: fectchDataFunction(false, 'edit/updateBoard'),
  publishBoard: fectchDataFunction(true, 'edit/publishBoard'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class BoardEditHome extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    boardInfo: PropTypes.object.isRequired,
    visibleRanges: PropTypes.array.isRequired,
    indicatorLib: PropTypes.array.isRequired,
    message: PropTypes.string.isRequired,
    globalLoading: PropTypes.bool.isRequired,
    updateLoading: PropTypes.bool.isRequired,
    publishLoading: PropTypes.bool.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    getBoardInfo: PropTypes.func.isRequired,
    getVisibleRange: PropTypes.func.isRequired,
    getIndicatorLib: PropTypes.func.isRequired,
    updateBoard: PropTypes.func.isRequired,
    publishBoard: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      boardNameEditor: false,
      visibleRangeEditor: false,
      bNEditorOriginal: '',
      vROriginal: '',
      vREditorOriginal: [],
      preview: false,
      vrTipVisible: false,
      visibleRangeTip: '',
      publishBt: false, // 发布按钮状态, 默认为false，即可用状态
      previewBt: false, // 预览按钮状态
      saveBt: false, // 保存按钮状态，false为已经保存过了的状态
      publishConfirmModal: false,
      backConfirmModal: false,
      hasPublished: false, // 看板是否已经发布
      saveBtnType: 'default', // 按钮样式
    };
  }

  componentWillMount() {
    const { location: { query: { boardId, orgId, boardType } } } = this.props;
    const { getBoardInfo, getVisibleRange, getIndicatorLib } = this.props;
    getBoardInfo({
      boardId,
      orgId,
    });
    getVisibleRange({
      orgId,
    });
    getIndicatorLib({
      type: boardType,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { visibleRanges, boardInfo } = nextProps;
    if (!_.isEmpty(visibleRanges) && !_.isEmpty(boardInfo)) {
      const userVR = boardInfo.orgModel; // 只出现下级选项
      const hasPublished = boardInfo.boardStatus === 'RELEASE';
      const summury = boardInfo.summury;// 用户选择的总量指标
      const detail = boardInfo.detail; // 用户选择的分类指标
      const finalLabel = this.getVRLabel(userVR, visibleRanges);
      this.setState({
        bNEditorOriginal: boardInfo.name, // 看板名称
        vROriginal: finalLabel, // 可见范围的显示label
        vREditorOriginal: userVR.splice(0, 1), // 选择的可见范围
        visibleRangeTip: this.getTooltipHtml(finalLabel),
        hasPublished,
        publishBt: !summury && !detail,
        previewBt: !summury && !detail,
      });
    }
    const { publishLoading: prePL, updateLoading: preUL } = this.props;
    const { publishLoading, updateLoading } = nextProps;
    if (prePL && !publishLoading) {
      message.success('发布成功');
    }
    if (preUL && !updateLoading) {
      message.success('保存成功');
    }
  }

  @autobind
  getVRLabel(user, all) {
    // 默认必须选中本级机构
    const allCheckedNode = selectHandlers.getAllCheckboxNode(all[0].level);
    const getFinalLabel = selectHandlers.afterSelected(all, allCheckedNode);
    return getFinalLabel(user);
  }

  @autobind
  getTooltipHtml(label) {
    const newLabel = label.replace(/\//g, '、');
    return (
      <div className="vrlabel">
        <div className="title">可见范围：</div>
        <div className="label">{newLabel}</div>
      </div>
    );
  }

  @autobind
  changeBtnState(button) {
    this.setState({
      ...button,
    });
  }

  @autobind
  editorStateController(editor, flag) {
    if (flag) {
      // 如果是打开某一个,其余需要关闭
      this.setState({
        boardNameEditor: false,
        visibleRangeEditor: false,
        [editor]: true,
        vrTipVisible: false,
      });
    } else {
      // 如果是关闭则只是关闭
      this.setState({
        [editor]: false,
      });
    }
  }

  @autobind
  saveBoardChange(board) {
    const { updateBoard, publishBoard } = this.props;
    const { isPublished } = board;
    if (isPublished === 'Y') {
      // 发布
      publishBoard(board);
    } else {
      // 更新
      updateBoard(board);
    }
  }

  // editor按确认按钮的处理程序
  @autobind
  editorConfirm(obj) {
    const { key, value } = obj;
    if (key === 'boardNameEditor') {
      this.setState({
        bNEditorOriginal: value,
        saveBtnType: 'primary',
        saveBt: true,
      });
    }
    if (key === 'visibleRangeEditor') {
      const tip = this.getTooltipHtml(value.label);
      this.setState({
        vROriginal: value.label,
        vREditorOriginal: value.currency,
        visibleRangeTip: tip,
        saveBtnType: 'primary',
        saveBt: true,
      });
    }
  }

  @autobind
  showPreview() {
    this.setState({
      preview: true,
    });
  }

  @autobind
  hidePreview() {
    console.log('hidePreview');
    this.setState({
      preview: false,
    });
  }

  @autobind
  closeModal(modal) {
    this.setState({
      [modal]: false,
    });
  }

  @autobind
  openPublishConfirmModal() {
    this.setState({
      publishConfirmModal: true,
    });
  }

  @autobind
  openBackConfirmModal() {
    this.setState({
      backConfirmModal: true,
    });
  }

  @autobind
  vrTipVisibleHandle(flag) {
    const { visibleRangeEditor } = this.state;
    this.setState({
      vrTipVisible: !visibleRangeEditor && flag,
    });
  }

  @autobind
  handlePublishBtnClick() {
    this.openPublishConfirmModal();
  }

  @autobind
  saveBoard(extraParam) {
    const { bNEditorOriginal, vREditorOriginal } = this.state;
    const { id, ownerOrgId } = this.props.boardInfo;
    // 后面新增指标库
    this.saveBoardChange({
      boardId: id,
      ownerOrgId,
      name: bNEditorOriginal,
      permitOrgIds: vREditorOriginal,
      ...extraParam,
    });
  }
  // 发布就是保存并将isPublished: '设置成Y',
  @autobind
  publishBoardCofirm() {
    this.saveBoard({
      isPublished: 'Y',
    });
  }

  @autobind
  backModalConfirm() {
    this.props.push('/boardManage');
  }

  @autobind
  handleBackBtnClick() {
    // 需要判断，是否进行了指标选择
    const { saveBt } = this.state;
    if (saveBt) {
      this.openBackConfirmModal();
    } else {
      this.props.push('/boardManage');
    }
  }

  @autobind
  handlePreviewBtnClick() {
    // 预览按钮点击之后，需要先保存
    this.saveBoard({});
    // this.showPreview();
  }

  @autobind
  handleSaveBtnClick() {
    this.saveBoard({});
  }

  render() {
    const { boardInfo, visibleRanges, indicatorLib } = this.props;
    const { vROriginal, vREditorOriginal, bNEditorOriginal } = this.state;
    // 做初始化容错处理
    if (_.isEmpty(visibleRanges)) {
      return null;
    }
    if (_.isEmpty(boardInfo)) {
      return null;
    }
    if (_.isEmpty(indicatorLib)) {
      return null;
    }
    const {
      boardNameEditor,
      visibleRangeEditor,
      preview,
      visibleRangeTip,
      vrTipVisible,
      publishBt,
      previewBt,
      publishConfirmModal,
      backConfirmModal,
      hasPublished,
      saveBtnType,
    } = this.state;
    const { location } = this.props;
    // 发布共同配置项
    const publishConfirmMProps = {
      modalKey: 'publishConfirmModal',
      modalCaption: '提示',
      visible: publishConfirmModal,
      closeModal: this.closeModal,
      confirm: this.publishBoardCofirm,
    };

    const backConfirmMProps = {
      modalKey: 'backConfirmModal',
      modalCaption: '提示',
      visible: backConfirmModal,
      closeModal: this.closeModal,
      confirm: this.backModalConfirm,
    };

    // 总量指标库
    const summuryLib = {
      type: 'summury',
      checkTreeArr: indicatorLib,
    };
    // 分类明细指标库
    const detailLib = {
      type: 'detail',
      checkTreeArr: indicatorLib,
    };

    const { boardTypeDesc, boardType, id } = this.props.boardInfo;
    // 初始化的时候还没有值
    return preview ?
    (
      <PreviewReport
        location={location}
        previewBack={this.hidePreview}
        previewPublish={this.publishBoardCofirm}
        reportName={bNEditorOriginal}
        boardId={id}
        boardType={boardType}
      />
    )
    :
    (
      <div className="page-invest content-inner">
        <div className={styles.editPageHd}>
          <div className={styles.HdName} onClick={this.showPreview}>看板编辑</div>
        </div>
        <div className={styles.editBasicHd}>
          <div className={styles.editBasic}>
            <div className={styles.basicInfo}>
              <div className={styles.title}>看板类型:</div>
              <SimpleEditor
                editable={false}
                originalValue={boardTypeDesc}
              />
            </div>
            <div className={styles.hDivider} />
            <div className={styles.basicInfo}>
              <div className={styles.title}>看板名称:</div>
              <SimpleEditor
                editable
                originalValue={bNEditorOriginal}
                style={{
                  maxWidth: '350px',
                }}
                editorValue={bNEditorOriginal}
                editorName="boardNameEditor"
                controller={this.editorStateController}
                editorState={boardNameEditor}
                confirm={this.editorConfirm}
              >
                <Input />
              </SimpleEditor>
            </div>
            <div className={styles.hDivider} />
            <Tooltip
              placement="bottom"
              title={visibleRangeTip}
              trigger="hover"
              visible={vrTipVisible}
              onVisibleChange={this.vrTipVisibleHandle}
              overlayClassName="visibleRangeToolTip"
              getPopupContainer={() => document.querySelector('.react-app')}
            >
              <div className={styles.basicInfo}>
                <div className={styles.title}>可见范围:</div>
                <SimpleEditor
                  editable
                  originalValue={vROriginal}
                  style={{
                    maxWidth: '450px',
                  }}
                  editorValue={{
                    currency: vREditorOriginal,
                    label: vROriginal,
                  }}
                  editorName="visibleRangeEditor"
                  controller={this.editorStateController}
                  editorState={visibleRangeEditor}
                  confirm={this.editorConfirm}
                >
                  <SelfSelect
                    options={visibleRanges}
                    level={visibleRanges[0].level || '3'}
                    style={{ height: '30px' }}
                  />
                </SimpleEditor>
              </div>
            </Tooltip>
          </div>
        </div>
        <div className={styles.editPageMain}>
          <BoardSelectTree key="summuryLib" data={summuryLib} />
          <BoardSelectTree key="detailLib" data={detailLib} />
        </div>
        <div className={styles.editPageFoot}>
          <div className={styles.buttonGroup}>
            <Button
              disabled={publishBt}
              className={styles.editBt}
              onClick={this.handlePublishBtnClick}
              key="editPubl"
              size="large"
              type="primary"
            >
              发布
            </Button>
            <Button
              className={styles.editBt}
              onClick={this.handleBackBtnClick}
              key="editBack"
              size="large"
            >
              返回
            </Button>
          </div>
          <div className={styles.buttonGroup}>
            <Button
              disabled={previewBt}
              className={styles.editBt}
              onClick={this.handlePreviewBtnClick}
              key="editPrev"
              size="large"
            >
              预览
            </Button>
            {/* 对于已经发布的看板不需要保存 */}
            {
              hasPublished ?
              null
              :
              (
                <Button
                  className={styles.editBt}
                  onClick={this.handleSaveBtnClick}
                  key="editSave"
                  size="large"
                  type={saveBtnType}
                >
                  保存
                </Button>
              )
            }
          </div>
        </div>
        <PublishConfirmModal {...publishConfirmMProps} />
        <BackConfirmModal {...backConfirmMProps} />
      </div>
    );
  }
}

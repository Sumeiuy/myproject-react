/**
 * @descript 看板编辑页面
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import { Input, Tooltip, Button } from 'antd';
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
import { checkTreeObj, checkTreeObj1 } from './tempData';

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
  globalLoading: state.activity.global,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  getBoardInfo: fectchDataFunction(true, 'edit/getBoardInfo'),
  getVisibleRange: fectchDataFunction(true, 'edit/getVisibleRange'),
  updateBoard: fectchDataFunction(true, 'edit/updateBoard'),
  publishBoard: fectchDataFunction(true, 'edit/publishBoard'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class BoardEditHome extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    boardInfo: PropTypes.object.isRequired,
    visibleRanges: PropTypes.array.isRequired,
    message: PropTypes.string.isRequired,
    globalLoading: PropTypes.bool.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    getBoardInfo: PropTypes.func.isRequired,
    getVisibleRange: PropTypes.func.isRequired,
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
      publishBt: false, // 发布按钮状态
      previewBt: false, // 预览按钮状态
      saveBt: false, // 保存按钮状态
      publishConfirmModal: false,
      backConfirmModal: false,
    };
  }

  componentWillMount() {
    const { location: { query: { boardId, orgId } } } = this.props;
    this.props.getBoardInfo({
      boardId,
      orgId,
    });
    this.props.getVisibleRange({
      orgId,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { visibleRanges, boardInfo } = nextProps;
    this.setState({
      bNEditorOriginal: boardInfo.name, // 看板名称
    });
    const userVR = ['ZZ001041093']; // 只出现下级选项
    const finalLabel = this.getVRLabel(userVR, visibleRanges);
    this.setState({
      vROriginal: finalLabel, // 可见范围的显示label
      vREditorOriginal: userVR, // 选择的可见范围
      visibleRangeTip: this.getTooltipHtml(finalLabel),
    });
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
    const { updateBoard } = this.props;
    updateBoard(board);
  }

  // editor按确认按钮的处理程序
  @autobind
  editorConfirm(obj) {
    const { key, value } = obj;
    const { id, ownerOrgId } = this.props.boardInfo;
    if (key === 'boardNameEditor') {
      this.setState({
        bNEditorOriginal: value,
      });
      this.saveBoardChange({
        ownerOrgId,
        boardId: id,
        name: value,
      });
    }
    if (key === 'visibleRangeEditor') {
      const tip = this.getTooltipHtml(value.label);
      this.setState({
        vROriginal: value.label,
        vREditorOriginal: value.currency,
        visibleRangeTip: tip,
      });
      // TODO 此处数据缺少
      this.saveBoardChange({
        ownerOrgId,
        boardId: id,
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
  publishBoardCofirm() {

  }

  @autobind
  handleBackBtnClick() {
    this.openBackConfirmModal();
    // this.props.push('/boardManage');
  }

  @autobind
  handlePreviewBtnClick() {
    this.showPreview();
  }

  @autobind
  handleSaveBtnClick() {
    this.saveBoardChange();
  }

  render() {
    const { boardInfo, visibleRanges } = this.props;
    const { vROriginal, vREditorOriginal, bNEditorOriginal } = this.state;
    // 做初始化容错处理
    if (_.isEmpty(visibleRanges)) {
      return null;
    }
    if (_.isEmpty(boardInfo)) {
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
      saveBt,
      publishConfirmModal,
      backConfirmModal,
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
    };

    const { boardTypeDesc } = this.props.boardInfo; // 此处目前缺少看板选择的可见范围
    // 初始化的时候还没有值
    return preview ?
    (
      <PreviewReport
        location={location}
        previewBack={this.hidePreview}
        previewPublish={this.publishBoardCofirm}
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
                    level={visibleRanges[0].level}
                    style={{ height: '30px' }}
                  />
                </SimpleEditor>
              </div>
            </Tooltip>
          </div>
        </div>
        <div className={styles.editPageMain}>
          <BoardSelectTree key={1} data={checkTreeObj} />
          <BoardSelectTree key={2} data={checkTreeObj1} />
        </div>
        <div className={styles.editPageFoot}>
          <div className={styles.buttonGroup}>
            <Button disabled={publishBt} className={styles.editBt} onClick={this.handlePublishBtnClick} key="editPubl" size="large" type="primary">发布</Button>
            <Button className={styles.editBt} onClick={this.handleBackBtnClick} key="editBack" size="large">返回</Button>
          </div>
          <div className={styles.buttonGroup}>
            <Button disabled={previewBt} className={styles.editBt} onClick={this.handlePreviewBtnClick} key="editPrev" size="large">预览</Button>
            <Button disabled={saveBt} className={styles.editBt} onClick={this.handleSaveBtnClick} key="editSave" size="large">保存</Button>
          </div>
        </div>
        <PublishConfirmModal {...publishConfirmMProps} />
        <BackConfirmModal {...backConfirmMProps} />
      </div>
    );
  }
}

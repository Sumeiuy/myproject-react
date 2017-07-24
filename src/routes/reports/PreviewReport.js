/**
 * @description 定制看板预览页面
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import { Button, message } from 'antd';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { withRouter, routerRedux } from 'dva/router';

import ReportHome from './Home';
import { getCssStyle } from '../../utils/helper';
import { PublishConfirmModal } from '../../components/modals';

import styles from './PreviewReport.less';

// 首先判断wrap存在与否
const contentWrapper = document.getElementById('workspace-content');

const fectchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  boardInfo: state.edit.boardInfo,
  publishLoading: state.edit.publishLoading,
  globalLoading: state.activity.global,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  goBack: routerRedux.goBack,
  publishBoard: fectchDataFunction(true, 'edit/publishBoard'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class PreviewReport extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    boardInfo: PropTypes.object.isRequired,
    publishBoard: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    publishLoading: PropTypes.bool.isRequired,
    // reportName: PropTypes.string.isRequired,
    // boardId: PropTypes.number.isRequired,
    // boardType: PropTypes.string.isRequired,
    // previewBack: PropTypes.func.isRequired,
    // previewPublish: PropTypes.func.isRequired,
  }

  static defaultProps = {
    // reportName: '',
    // boardId: 1,
    // boardType: 'TYPE_TGJX',
  }

  constructor(props) {
    super(props);
    // 新的页面需要
    this.state = {
      publishConfirmModal: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { publishLoading: prePL } = this.props;
    const { push, publishLoading } = nextProps;
    if (!publishLoading && prePL) {
      const { id } = this.props.boardInfo;
      message.success('保存成功');
      push(`/report?boardId=${id}`);
    }
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
  handleBackClick() {
    this.props.goBack();
    // this.props.previewBack();
  }

  @autobind
  handlePubClick() {
    this.openPublishConfirmModal();
  }

  @autobind
  publishBoardCofirm() {
    const { id, ownerOrgId } = this.props.boardInfo;
    this.props.publishBoard({
      boardId: id,
      ownerOrgId,
      isPublished: 'Y',
    });
    // this.props.previewPublish();
  }

  render() {
    const { publishConfirmModal } = this.state;
    const { location } = this.props;
    const { name, id, boardType } = this.props.boardInfo;
    console.warn('boardInfo', this.props.boardInfo);
    // 发布共同配置项
    const publishConfirmMProps = {
      modalKey: 'publishConfirmModal',
      modalCaption: '提示',
      visible: publishConfirmModal,
      closeModal: this.closeModal,
      confirm: this.publishBoardCofirm,
    };
    return (
      <div className={styles.previewReport}>
        <ReportHome
          preView
          reportName={name}
          location={location}
          boardId={id}
          boardType={boardType}
        />
        <div
          className={styles.previewLayout}
          style={{
            left: contentWrapper ? getCssStyle(contentWrapper, 'left') : '0',
          }}
        >
          <Button onClick={this.handlePubClick} key="publish" className={styles.preButton} size="large" type="primary">发布</Button>
          <Button onClick={this.handleBackClick} key="back" className={styles.preButton} size="large" ghost>返回</Button>
        </div>
        <PublishConfirmModal {...publishConfirmMProps} />
      </div>
    );
  }
}

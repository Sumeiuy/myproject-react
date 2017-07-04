/**
 * @description 定制看板预览页面
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import { Button } from 'antd';
import { autobind } from 'core-decorators';
import ReportHome from './Home';
import { getCssStyle } from '../../utils/helper';
import { PublishConfirmModal } from '../../components/modals';

import styles from './PreviewReport.less';

// 首先判断wrap存在与否
const contentWrapper = document.getElementById('workspace-content');

export default class PreviewReport extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    reportName: PropTypes.string.isRequired,
    boardId: PropTypes.number.isRequired,
    boardType: PropTypes.string.isRequired,
    previewBack: PropTypes.func.isRequired,
    previewPublish: PropTypes.func.isRequired,
  }

  static defaultProps = {
    reportName: '',
    boardId: 1,
    boardType: 'TYPE_TGJX',
  }

  constructor(props) {
    super(props);
    this.state = {
      publishConfirmModal: false,
    };
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
    this.props.previewBack();
  }

  @autobind
  handlePubClick() {
    this.openPublishConfirmModal();
  }

  @autobind
  publishBoardCofirm() {
    this.props.previewPublish();
  }

  render() {
    const { publishConfirmModal } = this.state;
    const { location, reportName, boardId, boardType } = this.props;
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
          reportName={reportName}
          location={location}
          boardId={boardId}
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

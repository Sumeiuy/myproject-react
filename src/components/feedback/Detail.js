/**
 * @file components/feedback/Detail.js
 *  问题反馈
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Row, Col, Button, message, Modal } from 'antd';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import ProblemHandling from './ProblemHandling';
import Remark from './Remark';
import RemarkList from './RemarkList';
import Problemdetails from './ProblemDetails';
import FeedbackUser from './FeedbackUser';
import UploadFiles from './UploadFiles';
import { helper } from '../../utils';
import { feedbackOptions, request } from '../../config';
import './detail.less';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
const GETDETAIL = 'feedback/getFeedbackDetail';
const GETRECORDLIST = 'feedback/getFeedbackRecordList';
const UPDATEQUESTION = 'feedback/updateFeedback';

const issueTypeOptions = feedbackOptions.typeOptions;

const mapStateToProps = state => ({
  fbDetail: state.feedback.fbDetail,
  recordList: state.feedback.recordList,
  updateQuestion: state.feedback.updateQuestion,
});

const getDataFunction = loading => totype => query => ({
  type: totype,
  payload: query || {},
  loading,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  getFeedbackDetail: getDataFunction(true)(GETDETAIL),
  getFeedbackRecordList: getDataFunction(true)(GETRECORDLIST),
  updateFeedback: getDataFunction(true)(UPDATEQUESTION),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class Detail extends PureComponent {
  static propTypes = {
    fbDetail: PropTypes.object.isRequired,
    recordList: PropTypes.object.isRequired,
    updateQuestion: PropTypes.object.isRequired,
    getFeedbackDetail: PropTypes.func.isRequired,
    getFeedbackRecordList: PropTypes.func.isRequired,
    updateFeedback: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    const { fbDetail, recordList } = this.props;
    const { resultData = EMPTY_OBJECT } = fbDetail || EMPTY_OBJECT;
    const { resultData: voResultData } = recordList || EMPTY_OBJECT;
    this.state = {
      dataSource: resultData,
      voDataSource: voResultData,
      visible: false,
      remarkVisible: false,
      title: '',
      messageBtnValue: '',
      inforTxt: '',
      uploadPops: {},
      colSpans: {
        left: 16,
        right: 8,
      },
      nowStatus: true, // PROCESSING / CLOSED
      currentId: '',
      previewVisible: false,
      newWidth: 520,
    };
  }

  componentWillMount() {
    const { location: { query } } = this.props;
    const { currentId } = query;
    if (currentId) {
      this.setState({
        currentId,
      });
      this.handlegetData(currentId);
    }
  }

  componentDidMount() {
    // const img = new Image();
    // img.src = '../../static/images/2.png';
    // const that = img;
    // img.onload = this.loadImg(that);
  }

  componentWillReceiveProps(nextProps) {
    const { fbDetail: nextDetail = EMPTY_OBJECT,
      location: { query: { currentId } },
      recordList: nextVOList = EMPTY_OBJECT } = nextProps;
    const { fbDetail: preDetail = EMPTY_OBJECT,
      location: { query: { currentId: prevCurrentId } },
      recordList: preVOList = EMPTY_OBJECT } = this.props;
    const { resultData: nextResultData = EMPTY_OBJECT } = nextDetail;
    const { resultData: preResultData = EMPTY_OBJECT } = preDetail;

    if (preResultData !== nextResultData || nextVOList !== preVOList) {
      this.setState({
        voDataSource: nextVOList,
        dataSource: nextDetail,
        currentId,
      }, () => {
        const { resultData = EMPTY_OBJECT } = nextDetail || EMPTY_OBJECT;
        const { mediaUrls = '', status } = resultData || EMPTY_OBJECT;
        if (mediaUrls && mediaUrls.length < 1) {
          this.setState({
            hasImgUrl: false,
            previewVisible: true,
          });
        }
        if (status === 'CLOSED') {
          this.setState({
            nowStatus: false,
            messageBtnValue: '重新打开',
            inforTxt: '重新打开表示此问题没有解决，需要继续关注。',
          });
        } else if (status === 'PROCESSING') {
          this.setState({
            nowStatus: true,
            messageBtnValue: '处理问题',
            inforTxt: '处理问题表示对此问题做出判断处理。',
          });
        }
      });
    }

    /* currentId变化重新请求 */
    if (currentId && (currentId !== prevCurrentId)) {
      this.handlegetData(currentId);
      this.setState({
        currentId,
      });
    }
  }

  componentDidUpdate() {
    const { location: { query } } = this.props;
    const { currentId } = query;
    const { currentId: id } = this.state;

    // 只有当前state里面有currentId
    // 并且当前query里面有currentId
    // 才发起初始化请求
    if (!id && currentId) {
      this.handlegetData(currentId);
    }
    this.setState({ //eslint-disable-line
      currentId,
    });
  }

  /**
   * 获取原始图片的宽，高
   * @param {*} img 图片对象
   */
  @autobind
  loadImg() {
    // const originalWidth = img.width;
    // const originalHeight = img.height;
    // const imgElem = document.createElement('img');
    // imgElem.setAttribute('src', '../../static/images/2.png');
    // imgElem.setAttribute('alt', '图片');
    // const imgBox = document.querySelector('.imgbox_2');
    // imgBox.appendChild(imgElem);

    // const layout = document.querySelector('img');
    // const originalAspectRatio = originalWidth / originalHeight;
    // const currentAspectRatio = layout.width / layout.height;
    // const clientWidth = document.documentElement.clientWidth;
    // const clientHeight = document.documentElement.clientHeight;
    // if (originalHeight > clientHeight || originalWidth > clientWidth) {
    //   const rate = (originalHeight / clientHeight) - 1;
    //   const newHeight = originalHeight - (rate * originalHeight);
    //   const newWidth = originalWidth - (rate * originalWidth);
    //   this.setState({
    //     newHeight,
    //     newWidth,
    //   });
    // }
  }

  /**
   * 数据加载
   */
  handlegetData = (cid) => {
    const { getFeedbackDetail, getFeedbackRecordList } = this.props;
    getFeedbackRecordList({
      feedbackId: cid,
    });
    getFeedbackDetail({
      id: cid,
    });
  }
  /**
   * 弹窗处理（开启）
  */
  showModal = () => {
    this.setState({ visible: true });
  }
  /**
   * 弹窗处理（关闭）
  */
  handleCancel = () => {
    this.setState({ visible: false });
  }
  /**
   * 备注显示
  */
  showRemark = () => {
    this.setState({ remarkVisible: true });
  }
  /**
   * 备注隐藏
  */
  remarkCancel = () => {
    this.setState({ remarkVisible: false });
  }
  /**
   * 问题处理提交
  */
  @autobind
  handleCreate(f) {
    const form = f;
    const { location: { query }, updateFeedback } = this.props;
    const { currentId } = query;
    form.validateFields((err, values) => {
      if (err) {
        message.error(err);
        return;
      }
      let detail = values;
      const removeEmpty = (obj) => {
        const objs = obj;
        Object.keys(objs).forEach(key => (_.isEmpty(objs[key]) || objs[key] === '无') && delete objs[key]);
        return objs;
      };
      detail = removeEmpty(detail);
      if (detail.uploadedFiles && detail.uploadedFiles.fileList) {
        const files = detail.uploadedFiles.fileList.map(item =>
          item.response.resultData,
        );
        detail.uploadedFiles = files;
      }
      updateFeedback({
        request: {
          ...detail,
          id: currentId,
          feedbackId: currentId,
          processerEmpId: helper.getEmpId(),
        },
        currentQuery: query,
      });
      form.resetFields();
      this.setState({ visible: false });
    });
  }

  // 删除附件
  @autobind
  handleRemoveFile(item) {
    const { location: { query }, updateFeedback } = this.props;
    const { currentId } = query;
    updateFeedback({
      request: {
        deletedFiles: [item],
        id: currentId,
        processerEmpId: helper.getEmpId(),
        feedbackId: currentId,
      },
      currentQuery: query,
    });
  }

  /**
   * 备注提交
  */
  saveFromRemark = () => {
    const form = this.remarkForm;
    const { location: { query }, updateFeedback } = this.props;
    const { currentId } = query;
    form.validateFields((err, values) => {
      if (values.remarkContent) {
        if (!err) {
          updateFeedback({
            request: {
              remark: values.remarkContent,
              id: currentId,
              processerEmpId: helper.getEmpId(),
            },
            currentQuery: query,
          });
        } else {
          message.error(err);
          return;
        }
      } else {
        message.error('您还未填写备注信息');
      }
      form.resetFields();
      this.setState({ remarkVisible: false });
    });
  }
  /**
   * 存储处理问题form
  */
  saveFormRef = (form) => {
    this.handlingForm = form;
  }
  /**
   * 存储备注form
  */
  saveRemarkFormRef = (form) => {
    this.remarkForm = form;
  }
  /**
   * 详情编辑form
  */
  saveEditForm = (form) => {
    this.editForm = form;
  }
  /**
   * 缩略图预览
   */
  @autobind
  handlePreview() {
    // this.setState({
    //   previewVisible: true,
    // });
  }

  @autobind
  handlePreviewCancel() {
    // this.setState({
    //   previewVisible: false,
    // });
  }

  render() {
    const {
      dataSource,
      voDataSource,
      hasImgUrl,
      nowStatus,
      messageBtnValue,
      inforTxt,
      previewVisible,
      newWidth,
      // newHeight,
    } = this.state;
    const { resultData = EMPTY_OBJECT } = dataSource || EMPTY_OBJECT;
    const { resultData: voList = EMPTY_OBJECT } = voDataSource || EMPTY_OBJECT;
    const { feedbackVOList = EMPTY_LIST } = voList; // 处理记录
    const { appId, feedId, description, mediaUrls } = resultData || EMPTY_OBJECT;
    const imgUrl = _.isEmpty(mediaUrls) ? EMPTY_OBJECT : JSON.parse(mediaUrls);
    const {
      feedEmpInfo = EMPTY_OBJECT,
      attachModelList = EMPTY_LIST,
      functionName,
      createTime,
      processer,
      version,
      status,
      jiraId,
      tag,
      id,
      issueType,
    } = resultData || EMPTY_OBJECT; // 反馈用户
    const feedbackDetail = {
      functionName,
      createTime,
      processer,
      version,
      status,
      jiraId,
      tag,
      id,
    };

    const remarkbtn = classnames({
      btnhidden: this.state.remarkVisible,
    });
    const type = _.find(issueTypeOptions, item => item.value === issueType);

    return (
      <div className="detail_box">
        <div className="inner">
          <h1 className="bugtitle">【{type && type.label}】{appId}/{feedId}</h1>
          <div className="row_box">
            {hasImgUrl ?
              <Row gutter={16}>
                <Col span="16">
                  <div id="detail_module" className="module">
                    <div className="mod_header">
                      <h2 className="toogle_title">问题详情</h2>
                    </div>
                    <div className="mod_content">
                      <Problemdetails
                        problemDetails={feedbackDetail}
                        onCancel={this.remarkCancel}
                        onCreate={this.handleCreate}
                        nowStatus={nowStatus}
                      />
                    </div>
                  </div>
                  <div id="descriptionmodule" className="module">
                    <div className="mod_header">
                      <h2 className="toogle_title">描述</h2>
                    </div>
                    <div className="mod_content">
                      <div className="des_txt">
                        {description}
                      </div>
                      <div className="btn_dv">
                        <Button type="primary" onClick={this.showModal}>处理问题</Button>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span="8">
                  <div className="imgbox" onClick={this.handlePreview}>
                    <img src={`${request.prefix}${imgUrl.imageUrls}`} alt="图片" />
                  </div>
                </Col>
              </Row> :
              <Row>
                <Col span="24">
                  <div id="detail_module" className="module">
                    <div className="mod_header">
                      <h2 className="toogle_title">问题详情</h2>
                    </div>
                    <div className="mod_content">
                      <Problemdetails
                        problemDetails={resultData}
                        onCancel={this.remarkCancel}
                        onCreate={this.handleCreate}
                        nowStatus={nowStatus}
                      />
                    </div>
                  </div>
                  <div id="descriptionmodule" className="module">
                    <div className="mod_header">
                      <h2 className="toogle_title">描述</h2>
                    </div>
                    <div className="mod_content">
                      <div className="des_txt">
                        {description !== ' ' ? description : '暂无描述'}
                      </div>
                      <div className="btn_dv">
                        <Button type="primary" onClick={this.showModal}>{messageBtnValue}</Button>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            }
          </div>
          <div id="peoplemodule" className="module">
            <div className="mod_header">
              <h2 className="toogle_title">反馈用户</h2>
            </div>
            <div className="mod_content">
              <FeedbackUser
                fbuser={feedEmpInfo}
              />
            </div>
          </div>
          <div id="annex" className="module">
            <div className="mod_header">
              <h2 className="toogle_title">附件</h2>
            </div>
            <div className="mod_content">
              <UploadFiles
                onCreate={this.handleCreate}
                attachModelList={attachModelList}
                removeFile={this.handleRemoveFile}
              />
            </div>
          </div>
          <div id="processing" className="module">
            <div className="mod_header">
              <h2 className="toogle_title">处理记录</h2>
            </div>
            <div className="mod_content">
              <RemarkList
                remarkList={feedbackVOList}
              />
              <div className="remarks_box">
                <Button icon="edit" className={remarkbtn} onClick={this.showRemark}>备注</Button>
                <Remark
                  visible={this.state.remarkVisible}
                  ref={this.saveRemarkFormRef}
                  onCancel={this.remarkCancel}
                  onCreate={this.saveFromRemark}
                />
              </div>
            </div>
          </div>
        </div>
        <ProblemHandling
          ref={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          problemDetails={feedbackDetail}
          title={messageBtnValue}
          inforTxt={inforTxt}
        />
        <Modal
          visible={previewVisible}
          width={newWidth}
          footer={null}
          onCancel={this.handlePreviewCancel}
        >
          <img alt="图片" style={{ width: '100%' }} src="../../static/images/2.png" />
        </Modal>
      </div>
    );
  }
}


/**
 * @file components/feedback/Detail.js
 *  问题反馈
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Row, Col, Button } from 'antd';
import classnames from 'classnames';
import { connect } from 'react-redux';
// import { autobind } from 'core-decorators';
import { routerRedux } from 'dva/router';
import ProblemHandling from './ProblemHandling';
import Remark from './Remark';
import RemarkList from './RemarkList';
import Problemdetails from './ProblemDetails';
import FeedbackUser from './FeedbackUser';
import UploadFiles from './UploadFiles';
import './detail.less';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
const GETDETAIL = 'feedback/getFeedbackDetail';
const GETRECORDLIST = 'feedback/getFeedbackRecordList';
const UPDATEQUESTION = 'feedback/updateFeedback';

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
      title: '处理问题',
      messageBtnValue: '处理问题',
      uploadPops: {},
      colSpans: {
        left: 16,
        right: 8,
      },
      nowStatus: true, // PROCESSING / CLOSED
      currentId: '',
    };
  }

  componentWillMount() {
    const { location: { query } } = this.props;
    const { currentId } = query;
    this.handlegetData(currentId);
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
        const { attachmentJson = EMPTY_LIST, status } = resultData || EMPTY_OBJECT;
        if (attachmentJson && attachmentJson.length < 1) {
          this.setState({
            hasImgUrl: false,
          });
        }
        if (status === 'CLOSED') {
          this.setState({
            nowStatus: false,
            messageBtnValue: '重新打开',
          });
        }
      });
    }

    /* currentId变化重新请求 */
    if (currentId !== prevCurrentId) {
      this.handlegetData(currentId);
    }
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
  handleCreate = () => {
    const form = this.handlingForm;
    form.validateFields((err, values) => {
      console.log(err);
      if (err) {
        console.log(11);
        return;
      }
      console.log('Received values of form: ', values);
      form.resetFields();
      this.setState({ visible: false });
    });
  }
  /**
   * 备注提交
  */
  saveFromRemark = () => {
    const form = this.remarkForm;
    form.validateFields((err, values) => {
      console.log(err);
      if (err) {
        console.log(11);
        return;
      }
      console.log('Remark values of form: ', values);
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
  render() {
    const { dataSource, voDataSource } = this.state;
    const { resultData = EMPTY_OBJECT } = dataSource || EMPTY_OBJECT;
    const { resultData: voList = EMPTY_OBJECT } = voDataSource || EMPTY_OBJECT;
    const { feedbackVOList = EMPTY_LIST } = voList; // 处理记录
    const { appId, feedId, description, mediaUrls } = resultData || EMPTY_OBJECT;
    const {
      feedEmpInfo = EMPTY_OBJECT,
      attachModelList = EMPTY_LIST,
      functionName,
      createTime,
      version,
      status,
      tag,
      processer,
      jiraId,
    } = resultData || EMPTY_OBJECT; // 反馈用户
    const feedbackDetail = {
      functionName,
      createTime,
      version,
      status,
      tag,
      processer,
      jiraId,
    };

    const remarkbtn = classnames({
      btnhidden: this.state.remarkVisible,
    });
    const { hasImgUrl, nowStatus, messageBtnValue } = this.state;
    return (
      <div className="detail_box">
        <div className="inner">
          <h1 className="bugtitle">【问题】{appId}/{feedId}</h1>
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
                        ref={this.saveRemarkFormRef}
                        onCancel={this.remarkCancel}
                        onCreate={this.saveFromRemark}
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
                  <div className="imgbox">
                    <img src={mediaUrls} alt="图片" />
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
                        ref={this.saveRemarkFormRef}
                        onCancel={this.remarkCancel}
                        onCreate={this.saveFromRemark}
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
                attachModelList={attachModelList}
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
        />
      </div>
    );
  }
}


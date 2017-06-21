/**
 * @file components/feedback/Home.js
 *  问题反馈
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Row, Col, Button } from 'antd';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { withRouter, routerRedux } from 'dva/router';
import ProblemHandling from './ProblemHandling';
import Remark from './Remark';
import RemarkList from './RemarkList';
import Problemdetails from './ProblemDetails';
import FeedbackUser from './FeedbackUser';
import UploadFiles from './UploadFiles';
import './detail.less';

const EMPTY_OBJECT = {};
// const EMPTY_LIST = [];
const GETDETAIL = 'feedback/getFeedbackDetail';
const mapStateToProps = state => ({
  fbDetail: state.feedback.fbDetail,
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
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class FeedBack extends PureComponent {
  static propTypes = {
    fbDetail: PropTypes.object.isRequired,
    getFeedbackDetail: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
  }
  static defaultProps = {
  }
  constructor(props) {
    super(props);
    const { resultData = EMPTY_OBJECT } = this.props.fbDetail || EMPTY_OBJECT;
    this.state = {
      dataSource: resultData,
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
    };
  }
  componentWillMount() {
    const { getFeedbackDetail, location: { query } } = this.props;
    getFeedbackDetail({
      ...query,
      id: '267',
    });
  }
  componentWillReceiveProps(nextProps) {
    const { fbDetail: nextDetail = EMPTY_OBJECT } = nextProps;
    const { fbDetail: preDetail = EMPTY_OBJECT } = this.props;
    const { resultData: nextResultData = EMPTY_OBJECT } = nextDetail;
    const { resultData: preResultData = EMPTY_OBJECT } = preDetail;
    if (preResultData !== nextResultData) {
      this.setState({
        dataSource: nextDetail,
      }, () => {
        const { resultData = EMPTY_OBJECT } = nextDetail || EMPTY_OBJECT;
        const { feedbackDTO: feedbackDetail = EMPTY_OBJECT } = resultData || EMPTY_OBJECT;
        const { mediaUrls, feedbackStatusEnum } = feedbackDetail;
        if (mediaUrls === null || mediaUrls === '') {
          this.setState({
            hasImgUrl: false,
          });
        }
        if (feedbackStatusEnum === 'CLOSED') {
          this.setState({
            nowStatus: false,
            messageBtnValue: '重新打开',
          });
        }
      });
    }
  }
  componentDidUpdate() {
    // const { feedbackDTO: { mediaUrls } } = this.state.dataSource || [];
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
    const { resultData = EMPTY_OBJECT } = this.state.dataSource || EMPTY_OBJECT;
    const { feedbackDTO: feedbackDetail = EMPTY_OBJECT } = resultData || EMPTY_OBJECT;
    const { feedbackRecord = EMPTY_OBJECT } = resultData || EMPTY_OBJECT; // 处理记录
    const {
      id,
      description,
      userInfo,
      functionName,
      createTime,
      version,
      feedbackStatusEnum,
      issueType,
      approach,
      processer,
      jiraId,
      mediaUrls,
      attachModelList } = feedbackDetail;
    const problemDetails = {
      functionName,
      createTime,
      version,
      feedbackStatusEnum,
      issueType,
      approach,
      processer,
      jiraId,
    }; // 问题详情
    const { rowId, name, department, cellPhone, eMailAddr } = userInfo || EMPTY_OBJECT; // 反馈用户解构
    const feedbackUser = { rowId, name, department, cellPhone, eMailAddr }; // 反馈用户
    const remarkbtn = classnames({
      btnhidden: this.state.remarkVisible,
    });
    const { hasImgUrl, nowStatus, messageBtnValue } = this.state;
    return (
      <div className="detail_box">
        <div className="inner">
          <h1 className="bugtitle">【问题】{issueType}/{id}</h1>
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
                        problemDetails={problemDetails}
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
                        problemDetails={problemDetails}
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
                fbuser={feedbackUser}
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
                remarkList={feedbackRecord}
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


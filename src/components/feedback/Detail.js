/**
 * @file components/feedback/Home.js
 *  问题反馈
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Row, Col, Button, message, Upload } from 'antd';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { withRouter, routerRedux } from 'dva/router';
import ProblemHandling from './ProblemHandling';
import Remark from './Remark';
import RemarkList from './RemarkList';
import Problemdetails from './ProblemDetails';
import FeedbackUser from './FeedbackUser';
import './detail.less';

const Dragger = Upload.Dragger;
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
    this.setState({
      dataSource: resultData,
      uploadPops: {
        name: 'file',
        multiple: true,
        showUploadList: true,
        action: '//jsonplaceholder.typicode.com/posts/',
        onChange(info) {
          const status = info.file.status;
          if (status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
          } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
      },
    });
  }
  state = {
    visible: false,
    remarkVisible: false,
    title: '处理问题',
    uploadPops: {},
  }
  componentWillMount() {
    const { getFeedbackDetail, location: { query } } = this.props;
    getFeedbackDetail({
      ...query,
      feedbackId: '2222',
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
      });
    }
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
      status,
      issueType,
      approach,
      processer,
      jiraId } = feedbackDetail;
    const problemDetails = {
      functionName,
      createTime,
      version,
      status,
      issueType,
      approach,
      processer,
      jiraId }; // 问题详情
    const { rowId, name, department, cellPhone, eMailAddr } = userInfo || EMPTY_OBJECT; // 反馈用户解构
    const feedbackUser = { rowId, name, department, cellPhone, eMailAddr }; // 反馈用户
    const remarkbtn = classnames({
      btnhidden: this.state.remarkVisible,
    });
    return (
      <div className="detail_box">
        <div className="inner">
          <h1 className="bugtitle">【问题】{issueType}/{id}</h1>
          <div className="row_box">
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
                  <img src="" alt="" />
                </div>
              </Col>
            </Row>
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
              <Row>
                <Col span="12">
                  <ul id="filelist" className="filelist">
                    <li>
                      <a href="##">客户中心问题反馈.doc</a>
                    </li>
                  </ul>
                </Col>
                <Col span="12">
                  <div className="upload_dv">
                    <Dragger {...this.state.uploadPops}>
                      <div className="upload_txt">
                        + 上传附件
                      </div>
                    </Dragger>
                  </div>
                </Col>
              </Row>
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


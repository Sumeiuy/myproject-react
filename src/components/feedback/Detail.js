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
import './detail.less';

const Dragger = Upload.Dragger;
const EMPTY_OBJECT = {};
const GETDETAIL = 'feedback/getFeedbackDetail';
const GETRECORDLIST = 'feedback/getFeedbackRecordList';
const mapStateToProps = state => ({
  fbDetail: state.feedback.fbDetail,
  recordList: state.feedback.recordList,
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
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class FeedBack extends PureComponent {
  static propTypes = {
    fbDetail: PropTypes.object.isRequired,
    recordList: PropTypes.object.isRequired,
    getFeedbackDetail: PropTypes.func.isRequired,
    getFeedbackRecordList: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
  }
  static defaultProps = {
  }
  constructor(props) {
    super(props);
    const { resultData = EMPTY_OBJECT } = this.props.fbDetail || EMPTY_OBJECT;
    const { resultData: recordData = EMPTY_OBJECT } = this.props.recordList || EMPTY_OBJECT;
    this.setState({
      dataSource: resultData,
      recordListSource: recordData,
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
    const { getFeedbackDetail, getFeedbackRecordList, location: { query } } = this.props;
    getFeedbackRecordList({
      ...query,
      code: '1111',
    });
    getFeedbackDetail({
      ...query,
      code: '2222',
    });
  }
  componentWillReceiveProps(nextProps) {
    const { fbDetail: nextDetail = EMPTY_OBJECT,
      recordList: nextRecordList = EMPTY_OBJECT } = nextProps;
    const { fbDetail: preDetail = EMPTY_OBJECT } = this.props;
    const { resultData: nextResultData = EMPTY_OBJECT } = nextDetail;
    const { resultData: preResultData = EMPTY_OBJECT } = preDetail;
    // debugger;
    if (preResultData !== nextResultData) {
      this.setState({
        dataSource: nextDetail,
        recordListSource: nextRecordList,
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
   * 解决状态
  */
  handleStatus = (pop) => {
    if (pop === '解决中') {
      return (
        <b className="toSolve">解决中</b>
      );
    } else if (pop === '关闭') {
      return (
        <b className="close">关闭</b>
      );
    }
    return '--';
  }
  /**
   * 构建备注信息
  */
  createRecordList = (list) => {
    if (list.length > 0) {
      return (
        list.map((item, i) => (
          <li className="item" rel={i}>
            <div className="wrap">
              <div className="info_dv">
                <span>{item.department}-{item.userName}</span><span>于{item.date}，添加了备注：</span>
              </div>
              <div className="txt">
                {item.contentlist.length > 0 ? item.contentlist.map((inneritem, l) => (
                  <p rel={l}>{inneritem}</p>)) : '暂无数据'
                }
              </div>
            </div>
          </li>
          ))
      );
    }
    return '暂无数据';
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
    const { detail = EMPTY_OBJECT } = resultData;
    const {
      type,
      code,
      status,
      description,
      phoneNum,
      email,
      manager,
      userName,
      userNum,
      userDepartment,
      jiraNum,
      approach,
      questionType,
      date,
      module,
      version } = detail;
    const { resultData: recordData = EMPTY_OBJECT } = this.state.recordListSource || EMPTY_OBJECT;
    const { recordList = EMPTY_OBJECT } = recordData;
    const remarkbtn = classnames({
      btnhidden: this.state.remarkVisible,
    });
    return (
      <div className="detail_box">
        <div className="inner">
          <h1 className="bugtitle">【问题】{type}/{code}</h1>
          <div className="row_box">
            <Row gutter={16}>
              <Col span="16">
                <div id="detail_module" className="module">
                  <div className="mod_header">
                    <h2 className="toogle_title">问题详情</h2>
                  </div>
                  <div className="mod_content">
                    <ul className="property_list">
                      <li className="item">
                        <div className="wrap">
                          <strong className="name">模块：</strong>
                          <span className="value">{module}</span>
                        </div>
                      </li>
                      <li className="item">
                        <div className="wrap">
                          <strong className="name">反馈时间：</strong>
                          <span className="value">{date}</span>
                        </div>
                      </li>
                      <li className="item">
                        <div className="wrap">
                          <strong className="name">系统版本号：</strong>
                          <span className="value">{version}</span>
                        </div>
                      </li>
                      <li className="item">
                        <div className="wrap">
                          <strong className="name">状态：</strong>
                          <span className="value">
                            {this.handleStatus(status)}
                          </span>
                        </div>
                      </li>
                      <li className="item">
                        <div className="wrap">
                          <strong className="name">问题类型：</strong>
                          <span className="value">{questionType}</span>
                        </div>
                      </li>
                      <li className="item">
                        <div className="wrap">
                          <strong className="name">处理方法：</strong>
                          <span className="value">{approach}</span>
                        </div>
                      </li>
                      <li className="item">
                        <div className="wrap">
                          <strong className="name">经办人：</strong>
                          <span className="value">{userName}</span>
                        </div>
                      </li>
                      <li className="item">
                        <div className="wrap">
                          <strong className="name">Jira编号：</strong>
                          <span className="value">{jiraNum}</span>
                        </div>
                      </li>
                    </ul>
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
              <ul className="property_list">
                <li className="item">
                  <div className="wrap">
                    <strong className="name">员工号：</strong>
                    <span className="value">{userNum}</span>
                  </div>
                </li>
                <li className="item">
                  <div className="wrap">
                    <strong className="name">用户：</strong>
                    <span className="value">{manager}</span>
                  </div>
                </li>
                <li className="item">
                  <div className="wrap">
                    <strong className="name">部门：</strong>
                    <span className="value">{userDepartment}</span>
                  </div>
                </li>
                <li className="item">
                  <div className="wrap">
                    <strong className="name">联系电话：</strong>
                    <span className="value">{phoneNum}</span>
                  </div>
                </li>
                <li className="item">
                  <div className="wrap">
                    <strong className="name">邮箱：</strong>
                    <span className="value">{email}</span>
                  </div>
                </li>
              </ul>
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
              <ul className="record_list">
                {this.createRecordList(recordList)}
              </ul>
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


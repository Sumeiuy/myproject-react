/**
 * @file components/customerPool/CreateServiceRecord.js
 *  创建服务记录弹窗
 * @author wangjunjun
 */

import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Modal, Row, Col, Select, DatePicker, Input, message } from 'antd';
import moment from 'moment';

import Icon from '../../common/Icon';
import { helper } from '../../../utils';

import styles from './createServiceRecord.less';

const { Option } = Select;
const { TextArea } = Input;

const d = new Date();
// 日期组件的显示格式
const dateFormat = 'YYYY-MM-DD HH:mm';
// 当前日期的时间戳
const currentDate = d.getTime();
const formatCurrentDate = moment(currentDate).format(dateFormat);
const width = { width: 192 };
// 根据服务方式的key来记录对应的iconname
const SERVICE_ICON = {
  'HTSC Phone': 'dianhua',
  Mail: 'youjian',
  'HTSC SMS': 'duanxin',
  wx: 'weixin',
  Interview: 'beizi',
  'HTSC Other': 'other',
};

// 服务内容和反馈内容字数限制
const MAX_LENGTH = 1000;


export default class CreateServiceRecord extends PureComponent {

  static propTypes = {
    id: PropTypes.string,
    isShow: PropTypes.bool,
    empInfo: PropTypes.object.isRequired,
    onToggleServiceRecordModal: PropTypes.func.isRequired,
    addServeRecord: PropTypes.func.isRequired,
    addServeRecordSuccess: PropTypes.bool.isRequired,
    isAddServeRecord: PropTypes.bool.isRequired,
    dict: PropTypes.object.isRequired,
  }

  static defaultProps = {
    id: '',
    isShow: false,
  }

  constructor(props) {
    super(props);
    const {
      serveWay,
      serviceTypeTree,
      workResult,
    } = props.dict;
    this.state = {
      serviceWay: serveWay[0].key,
      serviceType: serviceTypeTree[0].key,
      workResult: workResult[0].key,
      serviceTime: formatCurrentDate,
      feedbackTime: formatCurrentDate,
    };
  }

  componentWillUnmount() {
    const {
      isAddServeRecord,
      addServeRecordSuccess,
    } = this.props;
    // 添加成功
    if (addServeRecordSuccess === true &&
      isAddServeRecord === false) {
      message.success('添加服务记录成功');
    }
  }

  // 提交
  @autobind
  handleSubmit() {
    const serviceContentNode = this.serviceContent.textAreaRef;
    const feedbackContentNode = this.feedbackContent.textAreaRef;
    const serviceContent = _.trim(serviceContentNode.value);
    const feedbackContent = _.trim(feedbackContentNode.value);
    if (!serviceContent) {
      message.error('请输入此次服务的内容');
      return;
    }
    if (helper.getStrLen(serviceContent) > MAX_LENGTH) {
      message.error(`服务的内容字数不能超过${MAX_LENGTH}`);
      return;
    }
    if (!feedbackContent) {
      message.error('请输入此次服务的反馈');
      return;
    }
    if (helper.getStrLen(feedbackContent) > MAX_LENGTH) {
      message.error(`服务的反馈内容字数不能超过${MAX_LENGTH}`);
      return;
    }
    const {
      serviceWay,
      serviceType,
      workResult,
      serviceTime,
      feedbackTime,
    } = this.state;
    const {
      id,
      addServeRecord,
      dict: {
        serviceTypeTree,
      },
    } = this.props;
    const targetObj = _.find(serviceTypeTree, obj => obj.key === serviceType);
    let type = null;
    if (targetObj && !_.isEmpty(targetObj.children)) {
      type = targetObj.children[0].key;
    }
    addServeRecord({
      custId: id,
      serveWay: serviceWay,
      serveType: serviceType,
      type,
      serveTime: serviceTime,
      serveContentDesc: serviceContent,
      serveCustFeedBack: feedbackContent,
      feedBackTime: feedbackTime,
      workResult,
    });
    serviceContentNode.value = '';
    feedbackContentNode.value = '';
    const { onToggleServiceRecordModal } = this.props;
    onToggleServiceRecordModal(false);
  }

  // 关闭弹窗
  @autobind
  handleCancel() {
    const { onToggleServiceRecordModal } = this.props;
    onToggleServiceRecordModal(false);
  }

  // 保存选中的服务方式的值
  @autobind
  handleServiceWay(key) {
    this.setState({
      serviceWay: key,
    });
  }

  // 保存服务类型的值
  @autobind
  handleServiceType(value) {
    this.setState({
      serviceType: value,
    });
  }

  // 保存工作结果的值
  @autobind
  handleWorkResult(value) {
    this.setState({
      workResult: value,
    });
  }

  // 保存服务时间的值
  @autobind
  handleServiceTime(date) {
    const selectedDate = Number(date.format('x'));
    this.setState({
      serviceTime: moment(selectedDate).format(dateFormat),
    });
  }

  // 保存回馈时间的值
  @autobind
  handleFeedbackTime(date) {
    const selectedDate = Number(date.format('x'));
    this.setState({
      feedbackTime: moment(selectedDate).format(dateFormat),
    });
  }

  disabledDate(current) {
    if (current) {
      return current.valueOf() > moment().subtract(0, 'days');
    }
    return true;
  }

  render() {
    const {
      isShow,
      empInfo,
      dict,
    } = this.props;
    const {
      serviceWay,
      serviceType,
      workResult,
      serviceTime,
      feedbackTime,
    } = this.state;
    const title = (
      <p className={styles.title}>
        创建服务记录:
        <span>&nbsp;{empInfo.empName}/{empInfo.empNum}</span>
      </p>
    );
    return (
      <Modal
        width={688}
        className={styles.serviceRecord}
        title={title}
        visible={isShow}
        maskClosable={false}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        okText="提交"
        cancelText="取消"
      >
        <p>请选择一项服务方式</p>
        <Row className={styles.serviceWay} type="flex" justify="space-between">
          {
            dict.serveWay.map(obj => (
              <Col
                key={obj.key}
                className={`serviceWayItem ${serviceWay === obj.key ? 'active' : ''}`}
                onClick={() => this.handleServiceWay(obj.key)}
              >
                <span><Icon type={SERVICE_ICON[obj.key] || ''} /></span>
                <p>{obj.value}</p>
              </Col>
            ))
          }
        </Row>
        <Row>
          <Col span={12}>
            <span className={styles.label}>服务类型</span>
            <Select
              value={serviceType}
              style={width}
              onChange={this.handleServiceType}
            >
              {
                dict.serviceTypeTree.map(obj => (
                  <Option key={obj.key} value={obj.key}>{obj.value}</Option>
                ))
              }
            </Select>
          </Col>
          <Col span={12}>
            <span className={styles.label}>服务时间</span>
            <DatePicker
              style={width}
              value={moment(serviceTime, dateFormat)}
              format={dateFormat}
              allowClear={false}
              showTime
              onChange={this.handleServiceTime}
              disabledDate={this.disabledDate}
            />
          </Col>
        </Row>
        <p className={`${styles.mt30} ${styles.mb10}`}>
          请描述此次服务的内容
        </p>
        <TextArea
          rows={5}
          ref={ref => this.serviceContent = ref}
        />
        <p className={`${styles.mt30} ${styles.mb10}`}>
          请描述客户对此次服务的反馈
        </p>
        <TextArea
          rows={5}
          ref={ref => this.feedbackContent = ref}
        />
        <Row className={styles.mt30}>
          <Col span={12}>
            <span className={styles.label}>反馈时间</span>
            <DatePicker
              style={width}
              value={moment(feedbackTime, dateFormat)}
              format={dateFormat}
              allowClear={false}
              showTime
              onChange={this.handleFeedbackTime}
              disabledDate={this.disabledDate}
            />
          </Col>
          <Col span={12}>
            <span className={styles.label}>工作结果</span>
            <Select
              value={workResult}
              style={width}
              onChange={this.handleWorkResult}
            >
              {
                dict.workResult.map(obj => (
                  <Option key={obj.key} value={obj.key}>{obj.value}</Option>
                ))
              }
            </Select>
          </Col>
        </Row>
      </Modal>
    );
  }
}

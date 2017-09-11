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
// 当前日期的时间戳
const currentDate = d.getTime();
const formatCurrentDate = helper.formatTime(currentDate);
// 日期组件的星期值
const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
// 日期组件的显示格式
const dateFormat = 'YYYY/MM/DD (dddd)';
const width = { width: 192 };
// 根据服务方式的key来记录对应的iconname
const SERVICE_ICON = {
  'HTSC Phone': 'dianhua',
  Mail: 'youjian',
  'HTSC SMS': 'duanxin',
  wx: 'weixin',
  Interview: 'beizi',
  Other: 'other',
};


export default class CreateServiceRecord extends PureComponent {

  static propTypes = {
    id: PropTypes.string,
    isShow: PropTypes.bool,
    empInfo: PropTypes.object.isRequired,
    hideCreateServiceRecord: PropTypes.func.isRequired,
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
      serveType,
      workResult,
    } = props.dict;
    this.state = {
      serviceWay: serveWay[0].key,
      serviceType: serveType[0].key,
      workResult: workResult[0].key,
      serviceTime: formatCurrentDate,
      feedbackTime: formatCurrentDate,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      isAddServeRecord,
      addServeRecordSuccess,
      dict: {
        serveWay,
        serveType,
        workResult,
      },
    } = nextProps;
    // 判断两次点击是否是同一个客户的服务记录，不是的，就还原数据，否则保留
    if (nextProps.id !== this.props.id) {
      this.setState({
        serviceWay: serveWay[0].key,
        serviceType: serveType[0].key,
        workResult: workResult[0].key,
        serviceTime: formatCurrentDate,
        feedbackTime: formatCurrentDate,
      });
      const sc = document.querySelector('#serviceContent');
      if (sc) {
        document.querySelector('#serviceContent').value = '';
        document.querySelector('#feedbackContent').value = '';
      }
    }
    // 添加成功
    if (addServeRecordSuccess === true &&
    isAddServeRecord === false &&
    this.props.isAddServeRecord === true) {
      message.success('添加服务记录成功');
    }
  }

  // 提交
  @autobind
  handleSubmit() {
    const serviceContent = _.trim(document.querySelector('#serviceContent').value);
    const feedbackContent = _.trim(document.querySelector('#feedbackContent').value);
    if (!serviceContent) {
      message.error('请输入此次服务的内容');
      return;
    }
    if (!feedbackContent) {
      message.error('请输入此次服务的反馈');
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
      addServeRecord,
    } = this.props;
    addServeRecord({
      serveWay: serviceWay,
      serveType: serviceType,
      serveTime: serviceTime,
      serveContentDesc: serviceContent,
      serveCustFeedBack: feedbackContent,
      feedBackTime: feedbackTime,
      workResult,
    });
    const { hideCreateServiceRecord } = this.props;
    hideCreateServiceRecord();
  }

  // 关闭弹窗
  @autobind
  handleCancel() {
    const { hideCreateServiceRecord } = this.props;
    hideCreateServiceRecord();
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
      serviceTime: helper.formatTime(selectedDate),
    });
  }

  // 保存回馈时间的值
  @autobind
  handleFeedbackTime(date) {
    const selectedDate = Number(date.format('x'));
    this.setState({
      feedbackTime: helper.formatTime(selectedDate),
    });
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
    // 自定义星期的值
    moment.locale('zh-cn', {
      weekdays,
    });
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
                className={`serviceWayItem ${serviceWay === obj.key ? 'active' : ''}`}
                onClick={() => this.handleServiceWay(obj.key)}
              >
                <span><Icon type={SERVICE_ICON[obj.key]} /></span>
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
                dict.serveType.map(obj => (<Option value={obj.key}>{obj.value}</Option>))
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
              onChange={this.handleServiceTime}
            />
          </Col>
        </Row>
        <p className={`${styles.mt30} ${styles.mb10}`}>
          请描述此次服务的内容
        </p>
        <TextArea
          rows={5}
          id="serviceContent"
        />
        <p className={`${styles.mt30} ${styles.mb10}`}>
          请描述客户对此次服务的反馈
        </p>
        <TextArea
          rows={5}
          id="feedbackContent"
        />
        <Row className={styles.mt30}>
          <Col span={12}>
            <span className={styles.label}>反馈时间</span>
            <DatePicker
              style={width}
              value={moment(feedbackTime, dateFormat)}
              format={dateFormat}
              allowClear={false}
              onChange={this.handleFeedbackTime}
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
                dict.workResult.map(obj => (<Option value={obj.key}>{obj.value}</Option>))
              }
            </Select>
          </Col>
        </Row>
      </Modal>
    );
  }
}

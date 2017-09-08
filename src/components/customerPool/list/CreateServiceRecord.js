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
const SERVICE_WAY = [
  {
    key: 'HTSC Phone',
    value: '电话',
  },
  {
    key: 'Mail',
    value: '邮件',
  },
  {
    key: 'HTSC SMS',
    value: '短信',
  },
  {
    key: 'wx',
    value: '微信',
  },
  {
    key: 'Interview',
    value: '面谈',
  },
  {
    key: 'Other',
    value: '其他',
  },
];
const SERVICE_TYPE = [
  {
    key: 'Campaign Action',
    value: '服务营销',
  },
  {
    key: 'Fins Su',
    value: '理财建议',
  },
  {
    key: 'New Customer Visit',
    value: '新客户回访',
  },
];

const WORK_RESULT = [
  {
    key: 'HTSC Complete',
    value: '完整完成',
  },
  {
    key: 'HTSC Partly Completed',
    value: '部分完成',
  },
  {
    key: 'HTSC Booking',
    value: '预约下次',
  },
];


export default class CreateServiceRecord extends PureComponent {

  static propTypes = {
    id: PropTypes.string,
    isShow: PropTypes.bool,
    empInfo: PropTypes.object.isRequired,
    hideCreateServiceRecord: PropTypes.func.isRequired,
    addServeRecord: PropTypes.func.isRequired,
    addServeRecordSuccess: PropTypes.bool.isRequired,
    isAddServeRecord: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    id: '',
    isShow: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      serviceWay: SERVICE_WAY[0].key,
      serviceType: SERVICE_TYPE[0].key,
      workResult: WORK_RESULT[0].key,
      serviceTime: formatCurrentDate,
      feedbackTime: formatCurrentDate,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      isAddServeRecord,
      addServeRecordSuccess,
    } = nextProps;
    if (nextProps.id !== this.props.id) {
      this.setState({
        serviceWay: SERVICE_WAY[0].key,
        serviceType: SERVICE_TYPE[0].key,
        workResult: WORK_RESULT[0].key,
        serviceTime: formatCurrentDate,
        feedbackTime: formatCurrentDate,
      });
      const sc = document.querySelector('#serviceContent');
      if (sc) {
        document.querySelector('#serviceContent').value = '';
        document.querySelector('#feedbackContent').value = '';
      }
    }
    if (addServeRecordSuccess === true &&
    isAddServeRecord === false &&
    this.props.isAddServeRecord === true) {
      message.success('添加服务记录成功');
    }
  }

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
    console.log(`输入的内容有： serviceWay: ${serviceWay}
      serviceType: ${serviceType}
      serviceTime: ${serviceTime}
      serviceContent: ${serviceContent}
      feedbackContent: ${feedbackContent}
      feedbackTime: ${feedbackTime}
      workResult: ${workResult}
    `);
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

  @autobind
  handleCancel() {
    const { hideCreateServiceRecord } = this.props;
    hideCreateServiceRecord();
  }

  @autobind
  handleServiceWay(key) {
    this.setState({
      serviceWay: key,
    });
  }

  @autobind
  handleServiceType(value) {
    this.setState({
      serviceType: value,
    });
  }

  @autobind
  handleWorkResult(value) {
    this.setState({
      workResult: value,
    });
  }

  @autobind
  handleServiceTime(date) {
    const selectedDate = Number(date.format('x'));
    this.setState({
      serviceTime: helper.formatTime(selectedDate),
    });
  }

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
            SERVICE_WAY.map(obj => (
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
                SERVICE_TYPE.map(obj => (<Option value={obj.key}>{obj.value}</Option>))
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
                WORK_RESULT.map(obj => (<Option value={obj.key}>{obj.value}</Option>))
              }
            </Select>
          </Col>
        </Row>
      </Modal>
    );
  }
}

/**
 * @file customerPool/CreateTaskForm.js
 *  客户池-自建任务表单
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Select, DatePicker, Row, Col } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { autobind } from 'core-decorators';
import Collapse from '../../components/customerPool/list/CreateCollapse';
import styles from './serviceLog.less';


// const create = Form.create;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const WEEK = ['日', '一', '二', '三', '四', '五', '六'];

const effects = {
  getServiceRecord: 'customerPool/getServiceRecord',
};
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});
const mapStateToProps = state => ({
  serviceRecordData: state.customerPool.serviceRecordData, // 最近服务记录
});
const mapDispatchToProps = {
  getServiceRecord: fetchDataFunction(true, effects.getServiceRecord),
};
@connect(mapStateToProps, mapDispatchToProps)
// @create()
export default class CreateTaskForm extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    getServiceRecord: PropTypes.func.isRequired,
    serviceRecordData: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      custId: '',
    };
  }
  componentWillMount() {
    this.handileData();
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }
  @autobind
  onChange(value) {
    console.log('value---', value);
    if (!_.isEmpty(value)) {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      const m = d.getMonth() + 1;
      const newDay = `${d.getFullYear()}/${m}/${d.getDate()}`;
      const e = d.getDay();
      const nowDay = moment(newDay, `YYYY/MM/DD(${WEEK[e]})`);
      console.warn('nowDay----', nowDay);
    }
  }
  @autobind
  handileData() {
    const { getServiceRecord } = this.props;
    const params = {
      custId: '020014642',
      empId: '001206',
    };
    getServiceRecord({
      ...params,
    });
    this.setState({
      custId: params.custId,
    });
  }

  render() {
    // const { form } = this.props;
    // const { getFieldDecorator } = form;
    const { serviceRecordData } = this.props;
    const { custId } = this.state;
    const date = serviceRecordData[custId];
    return (
      <div className={styles.serviceInner}>
        <div className={styles.servicecontent}>
          <div className={styles.service_from}>
            <Row>
              <Col span={2} offset={1} className={styles.service_label}>
                <label htmlFor="dd" >服务时间：</label>
              </Col>
              <Col span={5} >
                <RangePicker
                  ranges={{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }}
                  onChange={this.onChange}
                />
              </Col>
              <Col span={4}>
                <Select defaultValue="所有渠道">
                  <Option key="null" value="0" >暂无数据</Option>
                </Select>
              </Col>
              <Col span={4}>
                <Select defaultValue="所有类型">
                  <Option key="null" value="0">暂无数据</Option>
                </Select></Col>
            </Row>
          </div>
          <Row>
            <Col span={20} offset={2} className={styles.serviceLog}>
              <Collapse
                data={date}
                  // executeTypes={executeTypes}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

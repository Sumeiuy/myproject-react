/*
 * @Author: zhangjun
 * @Date: 2018-09-13 15:31:58
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-09-17 16:47:12
 * @description 投顾空间新建表单
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import { Form, DatePicker, Input, Switch, AutoComplete  } from 'antd';

import HtSchedule from 'lego-schedule/src';
import InfoTitle from '../common/InfoTitle';
import SimilarAutoComplete from '../common/similarAutoComplete';
import ProgressSelect from './ProgressSelect';
import logable from '../../decorators/logable';

import styles from './advisorSpaceForm.less';

const FormItem = Form.Item;
const Option = AutoComplete.Option;
const create = Form.create;
const { TextArea } = Input;

@create()
export default class AdvisorSpaceForm  extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    // 智慧前厅列表
    createRoomData: PropTypes.object.isRequired,
    getRoomList: PropTypes.func.isRequired,
    // 参与人列表
    participantData: PropTypes.object.isRequired,
    getParticipantList: PropTypes.func.isRequired,
    // 智慧前厅错误状态
    isShowRoomStatusError: PropTypes.bool.isRequired,
    // 时间段错误状态
    isShowPeriodStatusError: PropTypes.bool.isRequired,
    // 参与人错误状态
    isShowParticipantStatusError: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 预约日期
      orderDate: '',
      // 智慧前厅置灰状态，默认不可选择，只有选择预约日期，才能选择智慧前厅
      isRoomDisabled: true,
      // 智慧前厅编号
      roomNo: '',
      // 已预订的时间段
      selectedRange: [{index: 0, startTime: '11:00', endTime: '12:00'}],
      // 预订的时间段
      defaultRange: {},
      // 智慧前厅名称
      roomTitle: '',
      // 是否是外部客户，false表示不是外部客户，true表示是外部客户，默认是false
      outerPersonFlag: false,
      // 参与人
      participant: {}
    }
  }

  componentDidMount() {
    this.props.getRoomList({
      action: 'CREATE'
    });
  }

  @autobind
  getForm() {
    return this.props.form;
  }

  // 点击预约日期
  @autobind
  handleOrderDateChange(date, dateString) {
    this.setState({
      orderDate: dateString,
      isRoomDisabled: false,
    }, () => {
      this.props.getRoomList({
        orderDate: dateString,
        action: 'CREATE'
      });
    });
    this.props.onChange({orderDate: dateString});
  }

  // 设置不可选时间
  @autobind
  disabledDate(current) {
    return current && current < moment().startOf('day');
  }

  // 设置预订时间
  @autobind
  handleScheduleSelect(obj) {
    const { contentIndex: index, startTime, endTime } = obj;
    this.setState({
      defaultRange: {
        index,
        startTime,
        endTime,
      }
    });
    this.props.onChange({
      startTime,
      endTime,
    })
  }

  // 设置智慧空间
  @autobind
  handleRoomChange(value, option) {
    const { roomNo, roomName, siteCode, siteName, orderPeriodList } = option;
    const selectedRange = _.map(orderPeriodList, item => {
      return {
        index: 0,
        ...item,
      }
    })
    this.setState({
      roomNo: value,
      roomTitle: `${siteName}${roomName}`,
      selectedRange,
    })
    this.props.onChange({
      roomNo,
      roomName,
      siteCode,
      siteName,
    })
  }

  // 搜索参与人
  @autobind
  @logable({ type: 'Click', payload: { name: '搜索参与人', value: '$args[0]' } })
  handleSearchParticipant(keyword) {
    if (_.isEmpty(keyword)) {
      return;
    }
    this.props.getParticipantList({ keyword })
  }

  // 选择参与人
  @autobind
  @logable({ type: 'Click', payload: { name: '选择参与人', value: '$args[0]' } })
  handleSelectParticipant(newParticipant) {
    const { participant } = this.state;
    if (_.isEmpty(newParticipant) || _.get(participant, 'participant.participantCode') !== newParticipant.participantCode) {
      this.setState({ participant: newParticipant });
      this.props.onChange({ participant: newParticipant });
    }
  }

  @autobind
  renderParticipantAutoCompleteOption(participant) {
    // 渲染参与人下拉列表的选项DOM
    const { participantCode, participantName } = participant;
    const text = `${participantName}（${participantCode}）`;
    return (
      <Option key={participantCode} value={text} >
        <span className={styles.participantAutoCompleteOptionValue} title={text}>{text}</span>
      </Option>
    );
  }

  // 输入外部参与人
  @autobind
  handleOuterPersonChange(value) {
    const newParticipant = { participantName: value };
    this.setState({ participant: newParticipant});
    this.props.onChange({ participant: newParticipant });
  }

  @autobind
  handleExternalCustChange(checked) {
    this.setState({ outerPersonFlag: checked });
    this.props.onChange({ outerPersonFlag: checked });
  }

  render() {
    const {
      form: {
        getFieldDecorator,
      },
      createRoomData: {
        smartFrontHallList: roomList,
      },
      participantData: {
        participantList,
      },
      isShowRoomStatusError,
      isShowPeriodStatusError,
      isShowParticipantStatusError,
    } = this.props;
    const {
      orderDate,
      isRoomDisabled,
      roomNo,
      roomTitle,
      outerPersonFlag,
      selectedRange,
    } = this.state;
    // 智慧前厅验证
    const roomStatusErrorProps = isShowRoomStatusError ? {
      hasFeedback: false,
      validateStatus: 'error',
      help: '请选择智慧前厅',
    } : null;
    // 时间段验证
    const periodStatusErrorProps = isShowPeriodStatusError ? {
      hasFeedback: false,
      validateStatus: 'error',
      help: '请选择预订时间段',
    } : null;
    // 参与人验证
    const participantStatusErrorProps = isShowParticipantStatusError ? {
      hasFeedback: false,
      validateStatus: 'error',
      help: '请输入参与人',
    } : null;
    return (
      <div className={styles.advisorSpaceForm}>
        <Form >
          <InfoTitle head="选择智慧前厅和时间" />
          <div className={styles.roomWrapper}>
            <div className={styles.coloumnHalfWrapper}>
              <div className={styles.coloumn}>
                <div className={styles.label}>
                  <i className={styles.isRequired}>*</i>
                  预约日期
                  <span className={styles.colon}>:</span>
                </div>
                <div className={styles.value}>
                  <FormItem>
                    {getFieldDecorator('orderDate', {
                      rules: [{ required: true, message: '请选择预约日期' }],
                    })(
                      <DatePicker
                        onChange={this.handleOrderDateChange}
                        placeholder="请选择"
                        disabledDate={this.disabledDate}
                        dropdownClassName="progressSelectDropdown"
                      />
                    )}
                  </FormItem>
                </div>
              </div>
              <div className={styles.coloumn}>
                <div className={styles.label}>
                  <i className={styles.isRequired}>*</i>
                  智慧前厅
                  <span className={styles.colon}>:</span>
                </div>
                <div className={styles.value}>
                  <FormItem {...roomStatusErrorProps}>
                    <ProgressSelect
                      data={roomList}
                      onChange={this.handleRoomChange}
                      value={roomNo}
                      disabled={isRoomDisabled}
                    />
                  </FormItem>
                </div>
              </div>
            </div>
            {
              !_.isEmpty(roomNo) ?
                (
                  <div className={styles.scheduleWrapper}>
                    <FormItem {...periodStatusErrorProps}>
                      <HtSchedule
                        startTime="09:00"
                        endTime="18:00"
                        onSelected={this.handleScheduleSelect}
                        rowContents={[{title: roomTitle}]}
                        rowContentStyle={{width: '100px', height: '37px', lineHeight: '37px'}}
                        cellStyle={{height: '37px'}}
                        selectedRange={selectedRange}
                      />
                    </FormItem>
                  </div>
                ) : null
            }
          </div>
          <InfoTitle head="填写详细信息" />
          <div className={styles.detailInfo}>
            <div className={styles.coloumn}>
              <div className={styles.label}>
                <i className={styles.isRequired}>*</i>
                主题
                <span className={styles.colon}>:</span>
              </div>
              <div className={`${styles.value} ${styles.theme}`}>
                <FormItem>
                  {getFieldDecorator('theme', {
                    rules: [
                      { required: true, message: '请输入主题' },
                      { whitespace: true, message: '请输入主题' }
                    ],
                  })(
                    <Input />
                  )}
                </FormItem>
              </div>
            </div>
            <div className={styles.coloumn}>
              <div className={styles.label}>
                <i className={styles.isRequired}>*</i>
                  参与人
                  <span className={styles.colon}>:</span>
                </div>
                <div className={`${styles.value} ${styles.participant}`}>
                  <FormItem {...participantStatusErrorProps}>
                    <div>
                      {
                        outerPersonFlag ?
                        (
                          <Input placeholder="请输入"
                          onChange={e => this.handleOuterPersonChange(e.target.value)}/>
                        )
                        :
                        (
                          <SimilarAutoComplete
                            style={{ width: '228px', height: '30px' }}
                            placeholder="经纪客户号/客户名称"
                            optionList={participantList}
                            optionKey="participantCode"
                            needConfirmWhenClear
                            clearConfirmTips="切换或者删除客户，将导致所有的数据清空或者重置"
                            onSelect={this.handleSelectParticipant}
                            onSearch={this.handleSearchParticipant}
                            renderOptionNode={this.renderParticipantAutoCompleteOption}
                          />
                        )
                      }
                      <div className={styles.externalCustomer}>
                        <div className={styles.customerLabel}>外部客户</div>
                        <div className={styles.value}>
                          <Switch checkedChildren="是" unCheckedChildren="否" onChange={this.handleExternalCustChange}/>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                </div>
              </div>
              <div className={styles.coloumn}>
                <div className={styles.label}>
                      备注
                  <span className={styles.colon}>:</span>
                </div>
                <div className={`${styles.value} ${styles.remark}`}>
                  <FormItem>
                    {getFieldDecorator('remark')(
                      <TextArea />
                    )}
                  </FormItem>
                </div>
              </div>
          </div>
        </Form>
      </div>
    )
  }
}

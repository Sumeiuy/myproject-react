/*
 * @Author: zhangjun
 * @Date: 2018-09-13 15:31:58
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-09-25 15:25:53
 * @description 投顾空间新建表单
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import {
  Form, DatePicker, Input, Switch, AutoComplete
} from 'antd';

import HtSchedule from 'lego-schedule/src';
import InfoCell from './InfoCell';
import InfoTitle from '../common/InfoTitle';
import SimilarAutoComplete from '../common/similarAutoComplete';
import ProgressSelect from './ProgressSelect';
import { SCHEDULE_STYLES } from './config';
import logable from '../../decorators/logable';

import styles from './advisorSpaceForm.less';

const FormItem = Form.Item;
const Option = AutoComplete.Option;
const create = Form.create;
const { TextArea } = Input;

// 时间段选择样式配置项
const {
  rowContentStyle, cellStyle, disabledCellStyle, selectedCellStyle
} = SCHEDULE_STYLES;

@create()
export default class AdvisorSpaceForm extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    // 判断此组件用于新建页面还是驳回后修改页面，'CREATE'或者'UPDATE'
    action: PropTypes.oneOf(['CREATE', 'UPDATE']).isRequired,
    formData: PropTypes.object.isRequired,
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
    participantStatusErrorMessage: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    const formData = this.getInitialState(props);
    this.state = {
      // 整个 Form 表单数据
      formData,
    };
  }

  @autobind
  getInitialState(props) {
    const { formData = {} } = props;
    const isCreate = this.isCreateApply();
    if (isCreate) {
      return {};
    }

    return {
      // 预约日期
      orderDate: _.get(formData, 'orderDate'),
      // 智慧前厅置灰状态，默认不可选择，只有选择预约日期，才能选择智慧前厅
      isRoomDisabled: _.get(formData, 'isRoomDisabled'),
      // 智慧前厅编号
      roomNo: _.get(formData, 'roomNo'),
      // 已预订的时间段
      selectedRange: _.get(formData, 'selectedRange') || [],
      // 预订的时间段
      defaultRange: _.get(formData, 'defaultRange') || {},
      // 智慧前厅名称
      roomTitle: _.get(formData, 'roomTitle'),
      // 是否是外部客户，false表示不是外部客户，true表示是外部客户，默认是false
      outerPersonFlag: _.get(formData, 'outerPersonFlag'),
      // 参与人
      participant: _.get(formData, 'participant') || {},
      participantCode: _.get(formData, 'participant.participantCode') || '',
      participantName: _.get(formData, 'participant.participantName') || '',
      // 主题
      theme: _.get(formData, 'theme'),
      // 备注
      remark: _.get(formData, 'remark') || '',
    };
  }

  @autobind
  getForm() {
    return this.props.form;
  }

  @autobind
  isCreateApply() {
    const { action } = this.props;
    // action 判断当前是新建申请 'CREATE' 还是 修改申请'UPDATE'
    return action === 'CREATE';
  }

  @autobind
  queryRoomList(query) {
    this.props.getRoomList(query);
  }

  // 点击预约日期
  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '预约日期',
      value: '$args[1]',
    },
  })
  handleOrderDateChange(date, dateString) {
    const isRoomDisabled = _.isEmpty(date);
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        orderDate: dateString,
        isRoomDisabled,
        roomNo: '',
      }
    });
    this.queryRoomList({
      orderDate: dateString,
      action: 'CREATE',
    });
    this.props.onChange({
      orderDate: dateString,
      isRoomDisabled,
      roomNo: '',
    });
  }

  // 设置不可选时间
  @autobind
  disabledDate(current) {
    return current && current < moment().startOf('day');
  }

  // 设置预订时间
  @autobind
  @logable({
    type: 'DrillDown',
    payload: {
      name: '预约时间段',
      startTime: '$args[0].startTime',
      endTime: '$args[0].endTime',
    },
  })
  handleScheduleSelect(obj) {
    const { contentIndex: index, startTime, endTime } = obj;
    const defaultRange = { index, startTime, endTime };
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        defaultRange,
      }
    });
    this.props.onChange({
      startTime,
      endTime,
      defaultRange,
    });
  }

  // 设置智慧前厅
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '智慧前厅',
      value: '$args[0]',
    },
  })
  handleRoomChange(value, option) {
    const {
      roomNo, roomName, siteCode, siteName, orderPeriodList
    } = option;
    // 已预订时间，每个对象需要增加行标，所以增加index属性
    const selectedRange = _.map(orderPeriodList, item => ({ index: 0, ...item }));
    const roomTitle = `${siteName}${roomName}`;
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        roomNo: value,
        roomTitle,
        selectedRange,
        // 切换智慧空间，已选时间段需要置空
        defaultRange: {},
        startTime: '',
        endTime: '',
      }
    });
    this.props.onChange({
      roomNo,
      roomName,
      siteCode,
      siteName,
      selectedRange,
      roomTitle,
      // 切换智慧空间，已选时间段需要置空
      defaultRange: {},
      startTime: '',
      endTime: '',
    });
  }

  // 搜索参与人
  @autobind
  @logable({ type: 'Click', payload: { name: '搜索参与人', value: '$args[0]' } })
  handleSearchParticipant(keyword) {
    if (_.isEmpty(keyword)) {
      return;
    }
    this.props.getParticipantList({ keyword });
  }

  // 选择参与人
  @autobind
  @logable({ type: 'Click', payload: { name: '选择参与人', value: '$args[0]' } })
  handleSelectParticipant(newParticipant) {
    const { formData } = this.state;
    if (_.isEmpty(newParticipant)
      || _.get(formData, 'participant.participantCode') !== newParticipant.participantCode) {
      this.setState({
        formData: {
          ...formData,
          participant: newParticipant,
        }
      });
      this.props.onChange({ participant: newParticipant });
    }
  }

  @autobind
  renderParticipantAutoCompleteOption(participant) {
    // 渲染参与人下拉列表的选项DOM
    const { participantCode, participantName } = participant;
    const text = `${participantName}（${participantCode}）`;
    return (
      <Option key={participantCode} value={text}>
        <span className={styles.participantAutoCompleteOptionValue} title={text}>{text}</span>
      </Option>
    );
  }

  // 输入外部参与人
  @autobind
  handleOuterPersonChange(e) {
    const value = e.target.value;
    const newParticipant = { participantName: value };
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        participant: newParticipant,
      }
    });
    this.props.onChange({ participant: newParticipant });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '外部客户', value: '$args[0]' } })
  handleExternalCustChange(checked) {
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        outerPersonFlag: checked,
        // 切换外部客户按钮，参与人需要置空
        participant: {},
        participantCode: '',
        participantName: '',
      }
    });
    this.props.onChange({
      outerPersonFlag: checked,
      participant: {},
      participantCode: '',
      participantName: '',
    });
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
      participantStatusErrorMessage,
    } = this.props;
    const {
      formData: {
        orderDate,
        isRoomDisabled = true,
        roomNo,
        roomTitle,
        outerPersonFlag,
        selectedRange,
        defaultRange,
        theme,
        remark,
        participantCode,
        participantName,
      }
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
      help: participantStatusErrorMessage,
    } : null;
    // 内部参与人
    const innerParticipant = participantCode ? `${participantCode}（${participantName}）` : '';
    return (
      <div className={styles.advisorSpaceForm}>
        <Form>
          <InfoTitle head="选择智慧前厅和时间" />
          <div className={styles.roomWrapper}>
            <div className={styles.coloumnHalfWrapper}>
              <div className={styles.coloumn}>
                <InfoCell label="预约日期" required className={styles.advisorInfoCell}>
                  <FormItem>
                    {getFieldDecorator('orderDate', {
                      rules: [{ required: true, message: '请选择预约日期' }],
                      initialValue: !_.isEmpty(orderDate) ? moment(orderDate) : null,
                    })(
                      <DatePicker
                        onChange={this.handleOrderDateChange}
                        placeholder="请选择"
                        disabledDate={this.disabledDate}
                        dropdownClassName="progressSelectDropdown"
                      />
                    )}
                  </FormItem>
                </InfoCell>
              </div>
              <div className={styles.coloumn}>
                <InfoCell label="智慧前厅" required className={styles.advisorInfoCell}>
                  <FormItem {...roomStatusErrorProps}>
                    <ProgressSelect
                      data={roomList}
                      onChange={this.handleRoomChange}
                      value={roomNo}
                      disabled={isRoomDisabled}
                    />
                  </FormItem>
                </InfoCell>
              </div>
            </div>
            {
              !_.isEmpty(roomNo)
                ? (
                  <div className={styles.scheduleWrapper}>
                    <FormItem {...periodStatusErrorProps}>
                      <HtSchedule
                        startTime="09:00"
                        endTime="18:00"
                        onSelected={this.handleScheduleSelect}
                        rowContents={[{ title: roomTitle }]}
                        rowContentStyle={rowContentStyle}
                        cellStyle={cellStyle}
                        disabledCellStyle={disabledCellStyle}
                        selectedCellStyle={selectedCellStyle}
                        selectedRange={selectedRange}
                        defaultRange={defaultRange}
                      />
                      <div className={styles.scheduleLabel}>
                        <div className={styles.scheduleItem}>
                          <i className={styles.unSelected} />
                          <span>可选定</span>
                        </div>
                        <div className={styles.scheduleItem}>
                          <i className={styles.selected} />
                          <span>已预订</span>
                        </div>
                      </div>
                    </FormItem>
                  </div>
                ) : null
            }
          </div>
          <InfoTitle head="填写详细信息" />
          <div className={styles.detailInfo}>
            <InfoCell label="主题" required>
              <div className={`${styles.value} ${styles.theme}`}>
                <FormItem>
                  {getFieldDecorator('theme', {
                    rules: [
                      { required: true, message: '请输入主题' },
                      { whitespace: true, message: '请输入主题' },
                      { max: 50, message: '最多50个字符' }
                    ],
                    initialValue: theme,
                  })(
                    <Input />
                  )}
                </FormItem>
              </div>
            </InfoCell>
            <InfoCell label="参与人" required>
              <div className={`${styles.value} ${styles.participant}`}>
                <FormItem {...participantStatusErrorProps}>
                  {
                      outerPersonFlag
                        ? (
                          <Input
                            placeholder="请输入"
                            onChange={this.handleOuterPersonChange}
                            defaultValue={participantName}
                          />
                        )
                        : (
                          <SimilarAutoComplete
                            style={{ width: '228px', height: '30px' }}
                            placeholder="经纪客户号/客户名称"
                            optionList={participantList}
                            optionKey="participantCode"
                            defaultValue={innerParticipant}
                            onSelect={this.handleSelectParticipant}
                            onSearch={this.handleSearchParticipant}
                            renderOptionNode={this.renderParticipantAutoCompleteOption}
                          />
                        )
                    }
                </FormItem>
                <div className={styles.externalCustomer}>
                  <div className={styles.customerLabel}>外部客户</div>
                  <div className={styles.value}>
                    <Switch
                      checkedChildren="是"
                      unCheckedChildren="否"
                      checked={outerPersonFlag}
                      onChange={this.handleExternalCustChange}
                    />
                  </div>
                </div>
              </div>
            </InfoCell>
            <InfoCell label="备注">
              <div className={`${styles.value} ${styles.remark}`}>
                <FormItem>
                  {getFieldDecorator('remark', {
                    rules: [
                      { max: 100, message: '最多100个字符' }
                    ],
                    initialValue: remark,
                  })(
                    <TextArea />
                  )}
                </FormItem>
              </div>
            </InfoCell>
          </div>
        </Form>
      </div>
    );
  }
}

/*
 * @Author: sunweibin
 * @Date: 2018-08-30 20:17:43
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-09-17 16:07:07
 * @description 临时任务委托表单
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import { autobind } from 'core-decorators';
import { Input } from 'antd';
import DateRangePicker from 'lego-react-date/src';
import { SingleFilter } from 'lego-react-filter/src';

import InfoTitle from '../common/InfoTitle';
import InfoCell from './InfoCell';
import Select from '../common/Select';
import logable from '../../decorators/logable';
import { emp } from '../../helper';
import {
  checkLength,
  DEPUTE_REASON_CHECK_MESSAGE,
  ASSIGNEE_CHECK_MESSAGE,
  PERIOD_CHECK_MESSAGE,
  ASSIGNEE_CHECK_DIFF_MESSAGE,
} from './utilsCheck';

import styles from './deputeForm.less';

const TextArea = Input.TextArea;
// 日志上传的时间字符串格式
const LOG_DEATE_FORMAT = 'YYYY-MM-DD';

export default class DeputeForm extends PureComponent {
  static propTypes = {
    // 判断此组件用于新建页面还是驳回后修改页面，'CREATE'或者'UPDATE'
    action: PropTypes.oneOf(['CREATE', 'UPDATE']).isRequired,
    // 在驳回后修改页面，如果提交了之后，则不允许修改
    disablePage: PropTypes.bool,
    // 申请单详情
    detailInfo: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    // 受托服务部门列表
    deputeOrgList: PropTypes.array.isRequired,
    // 根据部门ID查询受托服务经理
    quryPtyMngList: PropTypes.func.isRequired,
    // 受托服务经理里列表
    deputeEmpList: PropTypes.array.isRequired,
    // 输入格式的校验结果
    checkResult: PropTypes.object,
  }

  static defaultProps = {
    detailInfo: {},
    disablePage: false,
    checkResult: {},
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { checkResult: nextResult } = nextProps;
    const { prevCheckResult } = prevState;
    if (!_.isEqual(nextResult, prevCheckResult)) {
      return {
        checkResult: nextResult,
        prevCheckResult: nextResult,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const formData = this.getInitialState(props);
    this.state = {
      // 整个 Form 表单数据
      formData,
      checkResult: props.checkResult,
    };
    this.wrapRef = React.createRef();
    this.similarAutoCompleteRef = React.createRef();
  }

  @autobind
  getInitialState(props) {
    const { detailInfo = {} } = props;
    const isCreate = this.isCreateApply();
    if (isCreate) {
      return {
        // 默认选择用户的当前登录机构
        assigneeOrgId: emp.getOrgId(),
        assigneeId: '',
        assigneeName: '',
      };
    }
    const {
      deputeReason,
      assigneeId,
      assigneeName,
      assigneeOrgId,
      assigneeTimeStart,
      assigneeTimeEnd,
    } = detailInfo;
    return {
      deputeReason,
      deputeTimeStart: assigneeTimeStart,
      deputeTimeEnd: assigneeTimeEnd,
      assigneeId,
      assigneeName,
      assigneeOrgId,
    };
  }

  @autobind
  getWrapRef() {
    return this.wrapRef.current;
  }

  @autobind
  isCreateApply() {
    // action 判断当前是新建申请 'CREATE' 还是 驳回后修改申请'UPDATE'
    return this.props.action === 'CREATE';
  }

  // 申请的时间开始时间不能早于当前时间
  @autobind
  disabledStart(start) {
    // 因为有时分秒的问题
    return start < moment().add(1, 'days').startOf('day');
  }

  // 申请的时间结束时间必须在选择了开始时间的后面1天开始
  @autobind
  disabledEnd(start, end) {
    // 因为有时分秒的问题
    return start.startOf('day') >= end.startOf('day');
  }

  // 将表单数据推送给父组件
  @autobind
  handleFormDataPush() {
    const { formData } = this.state;
    this.props.onChange(formData);
  }

  @autobind
  handleDeputeReasonChange(e) {
    const { value } = e.target;
    // 需求要求超过1000长度后，不让再输入
    if (checkLength(value, 1000)) {
      return;
    }
    const {
      formData,
      checkResult,
      checkResult: { isCheckedDeputeReason },
    } = this.state;
    if (!isCheckedDeputeReason) {
      this.setState({
        checkResult: {
          ...checkResult,
          isCheckedDeputeReason: true,
        },
      });
    }
    this.setState({
      formData: {
        ...formData,
        deputeReason: value,
      },
    }, this.handleFormDataPush);
  }

  // 选择受托人部门，当部门切换的时候需要将选中的受托服务经理清空
  @autobind
  @logable({ type: 'DropdownSelect', payload: { name: '受托人部门', value: '$args[1]' } })
  handleAssigneeOrgSelect(key, value) {
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        assigneeOrgId: value,
        assigneeId: '',
        assigneeName: '',
      },
    }, this.handleFormDataPush);
    // 清除服务经理
    this.similarAutoCompleteRef.current.clearValue();
  }

  // 选择受托服务经理
  @autobind
  @logable({ type: 'DropdownSelect', payload: { name: '选择受托人', value: '$args[1]' } })
  handlePtyMngIdSelect({ value }) {
    let assigneeId = '';
    let assigneeName = '';
     // 如果传递空对象过来代表删除选中的
    if (!_.isEmpty(value)) {
      // 代表删除选中的
      assigneeId = value.ptyMngId;
      assigneeName = value.ptyMngName;
    }
    const {
      formData,
      checkResult,
      checkResult: { isCheckedAssignee },
    } = this.state;
    if (!isCheckedAssignee) {
      this.setState({
        checkResult: {
          ...checkResult,
          isCheckedAssignee: true,
        },
      });
    }
    this.setState({
      formData: {
        ...formData,
        assigneeId,
        assigneeName,
      },
    }, this.handleFormDataPush);
  }

  // 搜索受托服务经理
  @autobind
  @logable({ type: 'Click', payload: { name: '搜索客户', value: '$args[0]' } })
  handlePtyMngListSearch(keyword) {
    if (_.isEmpty(keyword)) {
      return;
    }
    const { formData: { assigneeOrgId } } = this.state;
    this.props.quryPtyMngList({ keyword, org: assigneeOrgId });
  }

  // 选择委托期限
  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '委托期限',
      min: (instance, args) => moment(args[0].value[0]).format(LOG_DEATE_FORMAT),
      max: (instance, args) => moment(args[0].value[1]).format(LOG_DEATE_FORMAT),
    },
  })
  handleDeputePeriodChange({ value }) {
    const {
      formData,
      checkResult,
      checkResult: { isCheckedPeriod },
    } = this.state;
    if (!isCheckedPeriod) {
      this.setState({
        checkResult: {
          ...checkResult,
          isCheckedPeriod: true,
        },
      });
    }
    this.setState({
      formData: {
        ...formData,
        deputeTimeStart: value[0] || '',
        deputeTimeEnd: value[1] || '',
      },
    }, this.handleFormDataPush);
  }

  // 渲染委托原因、受托人、委托期限的校验结果元素
  @autobind
  renderCheckResultTip(valid, msg) {
    return valid
      ? null
      : (<div className={styles.checkFail}>{msg}</div>);
  }

  render() {
    const {
      disablePage,
      deputeOrgList,
      deputeEmpList,
    } = this.props;
    const {
      formData,
      checkResult: {
        isCheckedDeputeReason,
        isCheckedAssignee,
        isCheckedPeriod,
        isCheckedAssigneeDiff,
      },
    } = this.state;
    // 判断当前组件是否在驳回后修改页面里面
    const isCreate = this.isCreateApply();
    const wrapCls = cx({
      [styles.deputeFormContainer]: true,
      [styles.reject]: !isCreate,
    });

    return (
      <div className={wrapCls} ref={this.wrapRef}>
        <InfoTitle head="委托信息" />
        <div className={styles.modContent}>
          <div className={styles.deputeReasonArea}>
            <div className={styles.label}>
              <span className={styles.required}>*</span>
              <span className={styles.colon}>委托原因:</span>
            </div>
            <div className={styles.textArea}>
              <TextArea
                disabled={disablePage}
                rows={5}
                value={formData.deputeReason || ''}
                onChange={this.handleDeputeReasonChange}
              />
            </div>
          </div>
        </div>
        {this.renderCheckResultTip(isCheckedDeputeReason, DEPUTE_REASON_CHECK_MESSAGE)}
        <div className={styles.modContent}>
          <InfoCell label="受托人" labelWidth={112}>
            <Select
              className={styles.ptyMngOrgSelect}
              disabled={disablePage}
              needShowKey={false}
              width="228px"
              name="accepterOrg"
              optionLabelMapKey="orgName"
              optionValueMapKey="orgId"
              data={deputeOrgList}
              value={formData.assigneeOrgId || ''}
              onChange={this.handleAssigneeOrgSelect}
              getPopupContainer={this.getWrapRef}
            />
            <SingleFilter
              disabled={disablePage}
              defaultLabel="请选择受托人"
              className={styles.assignee}
              useCustomerFilter
              value={[formData.assigneeId, formData.assigneeName]}
              style={{ width: '228px' }}
              placeholder="服务经理工号/姓名"
              data={deputeEmpList}
              dataMap={['ptyMngId', 'ptyMngName']}
              onChange={this.handlePtyMngIdSelect}
              onInputChange={this.handlePtyMngListSearch}
              useLabelInValue
              showSearch
              needItemObj
              menuContainer={this.getWrapRef()}
              dropdownStyle={{
                maxHeight: 324,
                overflowY: 'auto',
                width: 250,
              }}
            />
          </InfoCell>
        </div>
        {this.renderCheckResultTip(isCheckedAssignee, ASSIGNEE_CHECK_MESSAGE)}
        {this.renderCheckResultTip(isCheckedAssigneeDiff, ASSIGNEE_CHECK_DIFF_MESSAGE)}
        <div className={styles.modContent}>
          <InfoCell label="委托期限" labelWidth={112}>
            <DateRangePicker
              disabled={disablePage}
              filterValue={[formData.deputeTimeStart, formData.deputeTimeEnd]}
              onChange={this.handleDeputePeriodChange}
              disabledStart={this.disabledStart}
              disabledEnd={this.disabledEnd}
            />
          </InfoCell>
        </div>
        {this.renderCheckResultTip(isCheckedPeriod, PERIOD_CHECK_MESSAGE)}
      </div>
    );
  }
}

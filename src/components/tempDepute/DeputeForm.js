/*
 * @Author: sunweibin
 * @Date: 2018-08-30 20:17:43
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-09-02 00:14:58
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

import InfoTitle from '../common/InfoTitle';
import InfoCell from './InfoCell';
import SimilarAutoComplete from '../common/similarAutoComplete';
import Select from '../common/Select';
import logable from '../../decorators/logable';
import { emp } from '../../helper';
import {
  checkAcceptor,
  checkDeputeReasonLengthOver1000,
  checkDeputeReason,
  DEPUTE_REASON_CHECK_WARINGS,
  ASSOGNEE_CHECK_WARNINGS,
  PERIOD_CHECK_WARNINGS,
} from './utilsCheck';

import styles from './deputeForm.less';

const TextArea = Input.TextArea;
// 日志上传的时间字符串格式
const LOG_DEATE_FORMAT = 'YYYY-MM-DD';

export default class deputeForm extends PureComponent {
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
  }

  @autobind
  getInitialState(props) {
    console.warn('根据props初始化state:', props);
    // const { detailInfo = {} } = props;
    const isCreate = this.isCreateApply();
    if (isCreate) {
      return {
        // 默认选择用户的当前登录机构
        assigneeOrgId: emp.getOrgId(),
      };
    }
    return {
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
    if (checkDeputeReasonLengthOver1000(value)) {
      return;
    }
    this.handleDeputeReasonBlur();
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        deputeReason: value,
      },
    }, this.handleFormDataPush);
  }

  @autobind
  handleDeputeReasonBlur() {
    const { formData: { deputeReason }, checkResult } = this.state;
    const deputeReasonCheck = checkDeputeReason(deputeReason);
    this.setState({
      checkResult: { ...checkResult, deputeReasonCheck },
    });
  }

  @autobind
  handlePtyMngIdSelectBlur() {
    const { formData: { assigneeId }, checkResult } = this.state;
    const assigneeCheck = checkAcceptor(assigneeId);
    this.setState({
      checkResult: { ...checkResult, assigneeCheck },
    });
  }

  @autobind
  @logable({ type: 'DropdownSelect', payload: { name: '受托人部门', value: '$args[1]' } })
  handleAssigneeOrgSelect(key, value) {
    // 切换部门需要将选中的服务经理删除
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        assigneeOrgId: value,
        assigneeId: '',
      },
    }, this.handleFormDataPush);
  }

  @autobind
  @logable({ type: 'DropdownSelect', payload: { name: '选择受托人', value: '$args[1]' } })
  handlePtyMngIdSelect(assignee) {
    let assigneeId = '';
     // 如果传递空对象过来代表删除选中的
    if (!_.isEmpty(assignee)) {
      // 代表删除选中的
      assigneeId = assignee.ptyMngId;
    }
    this.handlePtyMngIdSelectBlur();
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        assigneeId,
      },
    }, this.handleFormDataPush);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '搜索客户', value: '$args[0]' } })
  handlePtyMngListSearch(keyword) {
    if (_.isEmpty(keyword)) {
      return;
    }
    const { formData: { assigneeOrgId } } = this.state;
    this.props.quryPtyMngList({ keyword, org: assigneeOrgId });
  }

  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '受托期间',
      min: (instance, args) => moment(args[0].value[0]).format(LOG_DEATE_FORMAT),
      max: (instance, args) => moment(args[0].value[1]).format(LOG_DEATE_FORMAT),
    },
  })
  handleDeputePeriodChange({ value }) {
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        deputeTimeStart: value[0] || '',
        deputeTimeEnd: value[1] || '',
      },
    }, this.handleFormDataPush);
  }

  @autobind
  renderPtyMngAutoCompleteOption(ptyMng) {
    // 渲染客户下拉列表的选项DOM
    const { ptyMngId, ptyMngName } = ptyMng;
    const text = `${ptyMngName}（${ptyMngId}）`;
    return (
      <Option key={ptyMngId} value={text} >
        <span className={styles.ptyMngAutoCompleteOptionValue} title={text}>{text}</span>
      </Option>
    );
  }

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
        deputeReasonCheck,
        assigneeCheck,
        periodCheck,
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
                onBlur={this.handleDeputeReasonBlur}
              />
            </div>
          </div>
        </div>
        {this.renderCheckResultTip(deputeReasonCheck, DEPUTE_REASON_CHECK_WARINGS)}
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
            <SimilarAutoComplete
              defaultValue={formData.assigneeId}
              style={{ width: '228px' }}
              placeholder="服务经理工号/姓名"
              optionList={deputeEmpList}
              optionKey="ptyMngId"
              onSelect={this.handlePtyMngIdSelect}
              onSearch={this.handlePtyMngListSearch}
              renderOptionNode={this.renderPtyMngAutoCompleteOption}
              onBlur={this.handlePtyMngIdSelectBlur}
            />
          </InfoCell>
        </div>
        {this.renderCheckResultTip(assigneeCheck, ASSOGNEE_CHECK_WARNINGS)}
        <div className={styles.modContent}>
          <InfoCell label="委托期限" labelWidth={112}>
            <DateRangePicker
              filterValue={[formData.deputeTimeStart, formData.deputeTimeEnd]}
              onChange={this.handleDeputePeriodChange}
            />
          </InfoCell>
        </div>
        {this.renderCheckResultTip(periodCheck, PERIOD_CHECK_WARNINGS)}
      </div>
    );
  }
}

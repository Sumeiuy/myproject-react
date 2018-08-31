/*
 * @Author: sunweibin
 * @Date: 2018-08-30 20:17:43
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-08-31 12:23:45
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
    ptyMngOrgList: PropTypes.array.isRequired,
    // 根据服务经理的部门列表
    queryPtyMngOrgList: PropTypes.func.isRequired,
    // 根据部门ID查询受托服务经理
    quryPtyMngList: PropTypes.func.isRequired,
  }

  static defaultProps = {
    detailInfo: {},
    disablePage: false,
  }

  constructor(props) {
    super(props);
    const formData = this.getInitialState(props);
    this.state = {
      // 整个 Form 表单数据
      formData,
    };
    this.wrapRef = React.createRef();
  }

  componentDidMount() {
    // 初始化进入首先查询一把受托服务经理部门列表
    const { ptyMngOrgList, queryPtyMngOrgList } = this.props;
    if (_.isEmpty(ptyMngOrgList)) {
      queryPtyMngOrgList();
    }
  }

  @autobind
  getInitialState(props) {
    console.warn('根据props初始化state:', props);
    // const { detailInfo = {} } = props;
    const isCreate = this.isCreateApply();
    if (isCreate) {
      return {};
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

  @autobind
  handleDeputeReasonChange(e) {
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        deputeReason: e.target.value,
      },
    });
    this.props.onChange({
      deputeReason: e.target.value,
    });
  }

  @autobind
  @logable({ type: 'DropdownSelect', payload: { name: '受托人部门', value: '$args[1]' } })
  handleAssigneeOrgSelect(key, value) {
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        assigneeOrgId: value,
      },
    });
    this.props.onChange({
      assigneeOrgId: value,
    });
  }

  @autobind
  @logable({ type: 'DropdownSelect', payload: { name: '选择受托人', value: '$args[1]' } })
  handlePtyMngIdSelect(key, value) {
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        assigneeId: value,
      },
    });
    this.props.onChange({
      assigneeId: value,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '搜索客户', value: '$args[0]' } })
  handlePtyMngListSearch(keyword) {
    if (_.isEmpty(keyword)) {
      return;
    }
    this.props.quryPtyMngList({ keyword });
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
  handleDeputePeriodChange(period) {
    console.warn('受托期间：', period);
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

  render() {
    const { disablePage } = this.props;
    const { formData } = this.state;
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
        <div className={styles.modContent}>
          <InfoCell label="受托人" labelWidth={112}>
            <Select
              className={styles.ptyMngOrgSelect}
              disabled={disablePage}
              needShowKey={false}
              width="228px"
              name="accepterOrg"
              optionLabelMapKey="value"
              optionValueMapKey="key"
              data={[]}
              value={formData.assigneeOrgId || ''}
              onChange={this.handleAssigneeOrgSelect}
              getPopupContainer={this.getWrapRef}
            />
            <SimilarAutoComplete
              style={{ width: '228px' }}
              placeholder="服务经理工号/服务经理经理"
              optionList={[]}
              optionKey="ptyMngId"
              onSelect={this.handlePtyMngIdSelect}
              onSearch={this.handlePtyMngListSearch}
              renderOptionNode={this.renderPtyMngAutoCompleteOption}
            />
          </InfoCell>
        </div>
        <div className={styles.modContent}>
          <DateRangePicker
            onChange={this.handleDeputePeriodChange}
          />
        </div>
      </div>
    );
  }
}

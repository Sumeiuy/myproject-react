/**
 * @fileOverview components/customerPool/PerformerViewDetail.js
 * @author wangjunjun
 * @description 执行者视图右侧详情
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Pagination, Form } from 'antd';

import Select from '../../common/Select';
import LabelInfo from '../common/LabelInfo';
import BasicInfo from '../common/BasicInfo';
import ServiceImplementation from './ServiceImplementation';
import EmptyTargetCust from './EmptyTargetCust';
import QuestionnaireSurvey from './QuestionnaireSurvey';

import styles from './performerViewDetail.less';


const PAGE_SIZE = 8;
const PAGE_NO = 1;
// 问卷调查题目测试数据
const data = {
  quesInfoList: [
    {
      optionInfoList: [{ optionId: '51', optionValue: '合理' }, { optionId: '58', optionValue: '不合理' }],
      quesDesp: '我建议XXX',
      quesId: '5',
      quesTypeCode: '1',
      quesTypeValue: '单选',
      quesValue: '此任务触发条件是否合理',
    },
    {
      optionInfoList: [{ optionId: '51', optionValue: '合理' }, { optionId: '58', optionValue: '不合理' }],
      quesDesp: '我建议XXX',
      quesId: '2',
      quesTypeCode: '1',
      quesTypeValue: '单选',
      quesValue: '此任务触发条件是否合理',
    },
    {
      optionInfoList: [{ optionId: '51', optionValue: '合理' }, { optionId: '58', optionValue: '不合理' }],
      quesDesp: '我建议XXX',
      quesId: '3',
      quesTypeCode: '2',
      quesTypeValue: '多选',
      quesValue: '此任务触发条件是否合理',
    },
    {
      optionInfoList: [{ optionId: '51', optionValue: '合理aaaa' }, { optionId: '58', optionValue: '不合理yyyyy' }],
      quesDesp: '我建议XXX',
      quesId: '4',
      quesTypeCode: '2',
      quesTypeValue: '多选',
      quesValue: '此任务触发条件是否合理',
    },
    {
      optionInfoList: [],
      quesDesp: '我建议XXX',
      quesId: '6',
      quesTypeCode: '3',
      quesTypeValue: '文本域',
      quesValue: '此任务触发条件是否合理',
    },
  ],
};

const create = Form.create;
@create()
export default class PerformerViewDetail extends PureComponent {

  static propTypes = {
    basicInfo: PropTypes.object.isRequired,
    isFold: PropTypes.bool,
    dict: PropTypes.object.isRequired,
    parameter: PropTypes.object.isRequired,
    currentId: PropTypes.string.isRequired,
    changeParameter: PropTypes.func.isRequired,
    queryTargetCust: PropTypes.func.isRequired,
    getCustDetail: PropTypes.func.isRequired,
    targetCustList: PropTypes.object.isRequired,
    deleteFileResult: PropTypes.array.isRequired,
    addMotServeRecordSuccess: PropTypes.bool.isRequired,
    form: PropTypes.object.isRequired,
    answersList: PropTypes.object,
    getQueryQues: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isFold: true,
    answersList: {},
  }
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      checkboxData: [],
      radioData: [],
    };
  }

  // 查询目标客户的列表和
  @autobind
  queryTargetCustInfo(obj) {
    const {
      currentId,
      queryTargetCust,
      getCustDetail,
    } = this.props;
    queryTargetCust({
      ...obj,
      missionId: currentId,
    }).then(() => getCustDetail({ missionId: currentId }));
  }

  @autobind
  handlePageChange(pageNo) {
    const {
      parameter: {
        targetCustomerPageSize = PAGE_SIZE,
      targetCustomerState,
      },
      changeParameter,
    } = this.props;
    changeParameter({
      targetCustomerPageNo: pageNo,
      targetCustId: '',
    });
    this.queryTargetCustInfo({
      state: targetCustomerState,
      pageSize: targetCustomerPageSize,
      pageNum: pageNo,
    });
  }

  @autobind
  handleStateChange(key, v) {
    const {
      changeParameter,
    } = this.props;
    changeParameter({
      [key]: v,
      targetCustomerPageSize: PAGE_SIZE,
      targetCustomerPageNo: PAGE_NO,
      targetCustId: '',
    });
    this.queryTargetCustInfo({
      state: v,
      pageSize: PAGE_SIZE,
      pageNum: PAGE_NO,
    });
  }

  /**
   * 添加服务记录成功后重新加载目标客户的列表信息
   */
  @autobind
  reloadTargetCustInfo() {
    const {
      parameter: {
        targetCustomerPageSize = PAGE_SIZE,
      targetCustomerPageNo = PAGE_NO,
      targetCustomerState,
      },
    } = this.props;
    this.queryTargetCustInfo({
      state: targetCustomerState,
      pageSize: targetCustomerPageSize,
      pageNum: targetCustomerPageNo,
    });
  }

  @autobind
  showModal() {
    const { getQueryQues } = this.props;
    getQueryQues({
      // 问卷传参测试
      templateId: '0502',
      pageNum: 1,
      pageSize: 200,
      assessType: 'MOT_EMP_FEEDBACK',
    });
    // 发送请求
    this.setState({
      visible: true,
    });
  }

  @autobind
  handleOk() {
    let isErr = false;
    const { checkboxData, radioData } = this.state;
    const checkedData = _.concat(checkboxData, radioData);
    // console.log('===>', this.questionForm);
    this.props.form.validateFields((err, values) => {
      console.log('values--->', values);
      if (!_.isEmpty(err)) {
        isErr = true;
      } else {
        const params = {
          // 提交问卷传参测试
          answerReqs: checkedData,
          examineetype: 'employee',
          examineeId: '02053703',
          templateId: '0502',
        };
        console.log(params);
      }
    });
    this.setState({
      visible: isErr,
    });
  }
  @autobind
  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  @autobind
  handleCheckboxChange(key) {
    const { checkboxData } = this.state;
    console.log(key, '==>', checkboxData);
    const arr = _.map(key, item => _.split(item, '-'));
    console.log(arr);
    const params = _.flatten(_.map(arr, (item) => {
      const childs = {
        answerId: item[1],
        answerText: item[0],
        quesId: item[2],
      };
      return childs;
    }));
    this.setState({
      checkboxData: params,
    }, () => {
      console.log('checkboxData==>', this.state.checkboxData);
    });
  }
  @autobind
  handleRadioChange(key) {
    const { radioData: initRadio } = this.state;
    const radioData = [{
      quesId: key.target.dataQuesId,
      answerId: key.target.dataId,
      answerText: key.target.value,
    }];
    if (_.isEmpty(initRadio)) {
      this.setState({
        radioData,
      });
    } else {
      let newRadio = [];
      const ques = _.findIndex(initRadio, o => o.quesId === radioData[0].quesId);
      if (ques === -1) {
        newRadio = _.concat(initRadio, radioData);
      } else {
        newRadio = initRadio.splice(ques, 1, radioData[0]);
        newRadio = initRadio;
      }
      this.setState({
        radioData: newRadio,
      });
    }
  }

  render() {
    const {
      basicInfo,
      isFold,
      dict,
      targetCustList,
      parameter: {
        targetCustomerPageNo,
        targetCustomerPageSize,
        targetCustomerState = '',
      },
      form,
      // answersList,
    } = this.props;
    const { visible } = this.state;
    const {
      missionId,
      missionName,
      missionStatusName,
      hasSurvey,
      ...otherProps
    } = basicInfo;
    const { list, page } = targetCustList;
    const { serveStatus } = dict;
    // 根据dict返回的数据，组合成Select组件的所需要的数据结构
    const stateData = serveStatus.map(o => ({
      value: o.key,
      label: o.value,
      show: true,
    }));
    stateData.unshift({
      value: '',
      label: '所有客户',
      show: true,
    });
    const curPageNo = targetCustomerPageNo || page.pageNum;
    const curPageSize = targetCustomerPageSize || page.pageSize;
    return (
      <div className={styles.performerViewDetail}>
        <p className={styles.taskTitle}>
          {`编号${missionId || '--'} ${missionName || '--'}: ${missionStatusName || '--'}`}
          {true ? <a className={styles.survey} onClick={this.showModal}>任务问卷调查</a> : null}
        </p>
        <BasicInfo
          isFold={isFold}
          {...otherProps}
        />
        <div className={styles.serviceImplementation}>
          <LabelInfo value="服务实施" />
          <div className={styles.listControl}>
            <div className={styles.stateWidget}>
              <span className={styles.label}>状态:</span>
              <Select
                name="targetCustomerState"
                value={targetCustomerState}
                data={stateData}
                onChange={this.handleStateChange}
              />
            </div>
            <div className={styles.total}>共 <span>{page.totalCount}</span> 位客户</div>
            <div className={styles.pagination}>
              <Pagination
                size="small"
                current={+curPageNo}
                total={+page.totalCount}
                pageSize={+curPageSize}
                onChange={this.handlePageChange}
                defaultPageSize={PAGE_SIZE}
              />
            </div>
          </div>
          {
            _.isEmpty(list) ?
              <EmptyTargetCust /> :
              <ServiceImplementation
                {...this.props}
                list={list}
                reloadTargetCustInfo={this.reloadTargetCustInfo}
              />
          }
        </div>
        <QuestionnaireSurvey
          ref={ref => this.questionForm = ref}
          form={form}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          onCheckChange={this.handleCheckboxChange}
          onRadioChange={this.handleRadioChange}
          answersList={data}
        />
      </div>
    );
  }
}

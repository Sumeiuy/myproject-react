/**
 * @fileOverview components/customerPool/PerformerViewDetail.js
 * @author wangjunjun
 * @description 执行者视图右侧详情
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Form, message } from 'antd';

import Select from '../../common/Select';
import LabelInfo from '../common/LabelInfo';
import { emp } from '../../../helper';
import ServiceImplementation from './ServiceImplementation';
import EmptyTargetCust from './EmptyTargetCust';
import QuestionnaireSurvey from './QuestionnaireSurvey';
import Pagination from '../../common/Pagination';
import InfoArea from '../managerView/InfoArea';

import styles from './performerViewDetail.less';


const PAGE_SIZE = 10;
const PAGE_NO = 1;
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
    form: PropTypes.object.isRequired,
    addMotServeRecordSuccess: PropTypes.bool.isRequired,
    answersList: PropTypes.object,
    getTempQuesAndAnswer: PropTypes.func.isRequired,
    saveAnswersSucce: PropTypes.bool,
    saveAnswersByType: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isFold: true,
    answersList: {},
    saveAnswersSucce: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      checkboxData: [],
      radioData: [],
      areaTextData: [],
      keyIndex: Number(emp.getId()),
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
    }).then(() => getCustDetail({
      missionId: currentId,
      custId: obj.custId,
    }));
  }

  /**
   * 重新查询目标客户的详情信息
   */
  @autobind
  requeryTargetCustDetail({ custId, callback }) {
    const {
      currentId,
      getCustDetail,
    } = this.props;
    getCustDetail({
      missionId: currentId,
      custId,
      callback,
    });
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
  reloadTargetCustInfo(callback) {
    const {
      parameter: {
        targetCustId,
      },
    } = this.props;
    this.requeryTargetCustDetail({
      custId: targetCustId,
      callback,
    });
  }

  @autobind
  showModal() {
    const { getTempQuesAndAnswer, basicInfo: { templateId } } = this.props;
    getTempQuesAndAnswer({
      // 问卷传参测试
      templateId,
      // 分页信息固定参数
      pageNum: 1,
      pageSize: 200,
      examineeId: emp.getId(),
    }).then(this.handleGetQuesSuccess);
  }

  // 处理请求问卷题目是否成功
  @autobind
  handleGetQuesSuccess() {
    const { answersList } = this.props;
    if (!_.isEmpty(answersList)) {
      this.setState({
        visible: true,
      });
    }
  }

  @autobind
  handleOk() {
    const { saveAnswersByType, form, basicInfo: { templateId } } = this.props;
    const { checkboxData, radioData, areaTextData } = this.state;
    const checkedData = _.concat(_.concat(checkboxData, radioData), areaTextData);
    form.validateFields((err) => {
      if (!_.isEmpty(err)) {
        this.setState({
          visible: true,
          keyIndex: this.state.keyIndex + 1,
        });
      } else {
        const params = {
          // 提交问卷传参测试
          answerReqs: checkedData,
          // 答题者类型参数固定
          examineetype: 'employee',
          examineeId: emp.getId(),
          templateId,
        };
        saveAnswersByType(params).then(this.handleSaveSuccess);
      }
    });
  }

  // 处理问卷提交成功
  @autobind
  handleSaveSuccess() {
    const { saveAnswersSucce } = this.props;
    let isShow = false;
    if (!saveAnswersSucce) {
      isShow = true;
      message.error('提交失败！');
    } else {
      message.error('提交成功！');
    }
    this.setState({
      visible: isShow,
    });
  }

  // 关闭modal
  @autobind
  handleCancel() {
    this.setState({
      visible: false,
      keyIndex: this.state.keyIndex + 1,
    });
  }

  // 处理选中答案数据
  @autobind
  handleCheckboxChange(key) {
    const { checkboxData } = this.state;
    let initCheck = checkboxData;
    // +-+ 在CheckBox value中拼接字符，为获取改答案answerId和改问题quesId
    const arr = _.map(key, item => _.split(item, '+-+'));
    const params = _.flatten(_.map(arr, (item) => {
      const childs = {
        answerId: item[1],
        answerText: item[0],
        quesId: item[2],
      };
      return childs;
    }));
    initCheck = _.concat(checkboxData, params);
    initCheck = _.uniqBy(initCheck, 'answerId', 'quesId');
    this.setState({
      checkboxData: initCheck,
    });
  }

  @autobind
  handleRadioChange(key) {
    const { radioData } = this.state;
    const initRadio = radioData;
    const checkedData = [{
      quesId: key.target.dataQuesId,
      answerId: key.target.value,
      answerText: key.target.dataVale,
    }];
    this.handleRepeatData(initRadio, checkedData, 'radioData');
  }

  // 处理问卷选中重复答案
  @autobind
  handleRepeatData(initData, checkedData, stv) {
    if (_.isEmpty(initData)) {
      this.setState({
        [stv]: checkedData,
      });
    } else {
      let newRadio = [];
      const ques = _.findIndex(initData, o => o.quesId === checkedData[0].quesId);
      if (ques === -1) {
        newRadio = _.concat(initData, checkedData);
      } else {
        newRadio = initData.splice(ques, 1, checkedData[0]);
        newRadio = initData;
      }
      this.setState({
        [stv]: newRadio,
      });
    }
  }

  @autobind
  handleAreaText(e) {
    const { areaTextData } = this.state;
    const initAreaText = areaTextData;
    const params = [{
      quesId: e.target.getAttribute('data'),
      answerText: e.target.value,
    }];
    this.handleRepeatData(initAreaText, params, 'areaTextData');
  }

  render() {
    const {
      basicInfo,
      dict,
      targetCustList,
      parameter: {
        targetCustomerPageNo,
        targetCustomerPageSize,
        targetCustomerState = '',
      },
      form,
      answersList,
    } = this.props;
    const { visible, keyIndex } = this.state;
    const { list, page } = targetCustList;
    const { serveStatus = [] } = dict || {};
    // 根据dict返回的数据，组合成Select组件的所需要的数据结构
    const stateData = (serveStatus || []).map(o => ({
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
    const paginationOption = {
      curPageNum: curPageNo,
      totalRecordNum: page.totalCount,
      curPageSize,
      onPageChange: this.handlePageChange,
      isShowSizeChanger: false,
    };

    const {
      missionId,
      missionName,
      missionStatusName,
      hasSurvey,
      triggerTime,
      endTime,
      missionTarget,
      servicePolicy,
    } = basicInfo;

    const basicInfoData = [{
      id: 'date',
      key: '任务有效期 :',
      value: `${triggerTime || '--'} ~ ${endTime || '--'}`,
    },
    {
      id: 'target',
      key: '任务目标 :',
      value: missionTarget || '--',
    },
    {
      id: 'policy',
      key: '服务策略 :',
      value: servicePolicy || '--',
    }];
    // hasSurvey
    return (
      <div className={styles.performerViewDetail}>
        <p className={styles.taskTitle}>
          {`编号${missionId || '--'} ${missionName || '--'}: ${missionStatusName || '--'}`}
          {hasSurvey ? <a className={styles.survey} onClick={this.showModal}>任务问卷调查</a> : null}
        </p>
        <InfoArea
          data={basicInfoData}
          headLine={'基本信息'}
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
            <div className={styles.pagination}>
              <Pagination
                {...paginationOption}
              />
            </div>
            {/* <div className={styles.total}>共 <span>{page.totalCount}</span> 位客户</div> */}
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
          onAreaText={this.handleAreaText}
          answersList={answersList}
          key={keyIndex}
        />
      </div>
    );
  }
}

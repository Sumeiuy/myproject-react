/* eslint-disable import/no-anonymous-default-export */
/**
 * @Author: hongguangqing
 * @Description: 执行者视图 model
 * @Date: 2018-08-20 13:15:45
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-08-21 16:57:13
 */
import _ from 'lodash';
import moment from 'moment';
import warning from 'warning';
import { performerView as api, customerPool as custApi } from '../../api';
import {
  STATE_COMPLETED_NAME,
  STATE_COMPLETED_CODE,
  defaultPerformerViewCurrentTab,
  dateFormat,
} from '../../routes/taskList/config';
import { regxp } from '../../helper';

const EMPTY_OBJ = {};
const EMPTY_LIST = [];

const PAGE_SIZE = 6;
const PAGE_NO = 1;

// 执行者视图头部过滤客户
const SEARCH_CUSTOMER_FOR_PAGE_HEADER = 'pageHeader';
// 执行者视图右侧过滤客户
const SEARCH_CUSTOMER_FOR_RIGHT_DETAIL = 'rightDetail';
// 资产降序排列
const ASSET_DESC = 'desc';
// 默认的服务实施的参数
const defaultParameter = {
  state: [],
  rowId: '',
  assetSort: ASSET_DESC,
  activeIndex: '1',
  currentCustomer: {},
  preciseInputValue: '1',
};

export default {
  namespace: 'performerView',
  state: {
    // 记录详情中的参数
    parameter: defaultParameter,
    // 任务详情中基本信息
    taskDetailBasicInfo: EMPTY_OBJ,
    // 任务详情中目标客户列表信息
    targetCustList: {
      list: EMPTY_LIST,
      page: {
        pageNum: PAGE_NO,
        pageSize: PAGE_SIZE,
        totalCount: 0,
      },
    },
    // 任务详情中目标客户列表当前选中的详情信息
    targetCustDetail: EMPTY_OBJ,
    // 客户uuid
    custUuid: '',
    deleteFileResult: [],
    taskList: EMPTY_OBJ,
    // 任务反馈字典
    taskFeedbackList: [],
    currentMotServiceRecord: {},
    answersList: {},
    isSubmitSurveySucceed: false,
    // 任务反馈
    missionFeedbackData: [],
    // 任务反馈已反馈总数
    missionFeedbackCount: 0,
    // 执行者视图添加服务记录的附件记录
    attachmentList: [],
    // 执行者视图头部查询到的客户列表
    customerList: [],
    // 执行者视图右侧查询到的客户列表
    custListForServiceImplementation: [],
    // 涨乐财富通服务方式下的客户反馈列表
    custFeedbackList: [],
    // 涨乐财富通服务方式下的审批人列表
    zhangleApprovalList: [],
    // 执行者视图当前的选中的tab的key值, 默认服务实施
    performerViewCurrentTab: defaultPerformerViewCurrentTab,
    // 服务结果进度
    serviceProgress: EMPTY_OBJ,
    custFeedBack: EMPTY_LIST,
    // 客户明细
    custDetail: EMPTY_OBJ,
    // 查询的服务经理列表
    serverManagerList: EMPTY_LIST,
    // 获取任务相关的投资建议模板列表
    templateList: [],
    // 翻译选中的投资建议模板结果
    templateResult: {},
    // 客户名下其他代办任务
    otherTaskList: EMPTY_LIST,
    // 客户名下其他代办任务是否请求成功
    fetchOtherTaskListStatus: false,
    // MOT回访任务可分配人员的列表
    allotEmpList: [],
    // 回访任务分配结果
    allotEmpResult: '',
  },
  reducers: {
    changeParameterSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        parameter: payload,
      };
    },
    clearParameter(state) {
      const excludeStateParameter = _.omit(defaultParameter, 'state');
      return {
        ...state,
        parameter: {
          ...state.parameter,
          ...excludeStateParameter,
        },
      };
    },
    getTaskDetailBasicInfoSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        taskDetailBasicInfo: payload,
      };
    },
    queryTargetCustSuccess(state, action) {
      // 后端接口返回 { page: null, list: null } 做的处理
      const {
        page = { pageNum: PAGE_NO, pageSize: PAGE_SIZE, totalCount: 0 },
        list = EMPTY_LIST,
      } = action.payload;
      return {
        ...state,
        targetCustList: {
          list,
          page,
        },
      };
    },
    queryTargetCustDetailSuccess(state, action) {
      return {
        ...state,
        targetCustDetail: action.payload,
      };
    },
    queryCustUuidSuccess(state, action) {
      return {
        ...state,
        custUuid: action.payload,
      };
    },
    ceFileDeleteSuccess(state, action) {
      return {
        ...state,
        deleteFileResult: action.payload,
      };
    },
    getTaskListSuccess(state, action) {
      const { payload: { resultData = EMPTY_OBJ } } = action;
      const { page = EMPTY_OBJ, viewBaseInfoList = EMPTY_LIST } = resultData || EMPTY_OBJ;
      return {
        ...state,
        taskList: {
          page,
          resultData: viewBaseInfoList,
        },
      };
    },
    getServiceTypeSuccess(state, action) {
      const { payload = {} } = action;
      // payload后端有可能给null导致页面空白
      warning(payload !== null, '任务反馈数据不能为null');
      return {
        ...state,
        taskFeedbackList: payload ? [payload] : [],
      };
    },
    addMotServeRecordSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        currentMotServiceRecord: { id: payload },
      };
    },
    getTempQuesAndAnswerSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        answersList: payload,
      };
    },
    saveAnswersByTypeSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        isSubmitSurveySucceed: payload === 'success',
      };
    },
    countAnswersByTypeSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        missionFeedbackData: payload || [],
      };
    },
    countExamineeByTypeSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        missionFeedbackCount: payload || 0,
      };
    },
    queryFileListSuccess(state, action) {
      return {
        ...state,
        attachmentList: action.payload,
      };
    },
    queryCustomerSuccess(state, action) {
      const { payload: { custBriefInfoDTOList } } = action;
      return {
        ...state,
        customerList: custBriefInfoDTOList || [],
      };
    },
    queryCustomerForServiceImplementationSuccess(state, action) {
      const { payload: { custBriefInfoDTOList } } = action;
      return {
        ...state,
        custListForServiceImplementation: custBriefInfoDTOList || [],
      };
    },
    queryCustFeedbackList4ZLFinsSuccess(state, action) {
      const { payload: { custFeedbackOptions } } = action;
      return {
        ...state,
        custFeedbackList: custFeedbackOptions,
      };
    },
    queryApprovalList4ZLFinsSuccess(state, action) {
      const { payload = [] } = action;
      return {
        ...state,
        zhangleApprovalList: payload,
      };
    },
    modifyLocalTaskList(state, action) {
      const { resultData } = state.taskList;
      const { missionId } = action.payload;
      const newList = _.map(resultData, (item) => {
        // 添加服务记录时服务状态选择的时完成，完成的状态码时30
        if (item.id === missionId) {
          // 添加成功一条服务状态为完成的记录，则该条数据的已完成数量加一
          const curentDoneFlowNum = item.doneFlowNum + 1;
          // 已完成数量和总数量相等
          if (curentDoneFlowNum === item.flowNum) {
            // 未到期：当前日期小于结束日期
            if (!moment().isAfter(item.processTime, 'day')) {
              // 当前选中任务项的已完成数量和总数量相等且任务未过期时，将本地存储的任务列表中的此条任务状态修改为已完成，且此条数据的已完成数量加一
              return {
                ...item,
                statusName: STATE_COMPLETED_NAME,
                statusCode: STATE_COMPLETED_CODE,
                doneFlowNum: curentDoneFlowNum,
              };
            }
          } else {
            // 当前选中任务项的已完成数量和总数量不相等时，将本地存储的任务列表中的此条任务的已完成数量加一
            return { ...item, doneFlowNum: curentDoneFlowNum };
          }
        }
        return item;
      });
      return {
        ...state,
        taskList: {
          ...state.taskList,
          resultData: newList,
        },
      };
    },
    // 清空已经查询出来的客户数据
    // 执行者视图右侧搜索客户
    clearCustListForServiceImplementation(state) {
      return {
        ...state,
        custListForServiceImplementation: EMPTY_LIST,
      };
    },
    resetMotServiceRecord(state) {
      return {
        ...state,
        currentMotServiceRecord: {},
      };
    },
    // 执行者视图中tab的切换
    changePerformerViewTab(state, action) {
      return {
        ...state,
        performerViewCurrentTab: action.payload,
      };
    },
    queryExecutorFlowStatusSuccess(state, action) {
      const { payload: serviceProgress } = action;
      return {
        ...state,
        serviceProgress,
      };
    },
    queryExecutorFeedBackSuccess(state, action) {
      const { payload: custFeedBack } = action;
      return {
        ...state,
        custFeedBack,
      };
    },
    queryExecutorDetailSuccess(state, action) {
      const { payload: custDetail } = action;
      return {
        ...state,
        custDetail,
      };
    },
    getSearchServerPersonListSuccess(state, action) {
      return {
        ...state,
        serverManagerList: action.payload,
      };
    },
    // 清除服务经理列表数据
    clearServiceManagerList(state, action) {
      const { payload } = action;
      return {
        ...state,
        searchServerPersonList: payload,
      };
    },
    getTemplateListSuccess(state, action) {
      const { payload = {} } = action;
      return {
        ...state,
        templateList: payload.list || [],
      };
    },
    translateTemplateSuccess(state, action) {
      const { payload = {} } = action;
      return {
        ...state,
        templateResult: payload,
      };
    },
    getOtherTaskListSuccess(state, action) {
      const { payload = EMPTY_OBJ } = action;
      const {
        list = EMPTY_LIST,
        fetchOtherTaskListStatus,
      } = payload;
      return {
        ...state,
        otherTaskList: list,
        fetchOtherTaskListStatus,
      };
    },
    queryAllotEmpListSuccess(state, action) {
      const { payload: { employList = [] } } = action;
      return {
        ...state,
        allotEmpList: employList,
      };
    },
    dispatchTaskToEmpSucess(state, action) {
      const { payload = '' } = action;
      return {
        ...state,
        allotEmpResult: payload,
      };
    },
    // 批量添加服务记录表单数据修改时同步到redux里的数据
    changeBatchServiceRecordForm(state, action) {
      const { payload = EMPTY_OBJ } = action;
      const { index, key, value } = payload;
      const { otherTaskList } = state;
      const newOtherTaskList = _.cloneDeep(otherTaskList);
      newOtherTaskList[index][key] = value;
      return {
        ...state,
        otherTaskList: newOtherTaskList,
      };
    },
  },
  effects: {
    // 执行者视图、管理者视图、创建者视图公共列表
    * getTaskList({ payload }, { call, put }) {
      const listResponse = yield call(api.queryTaskList, payload);
      yield put({
        type: 'getTaskListSuccess',
        payload: listResponse,
      });
    },

    * changeParameter({ payload }, { select, put }) {
      const prevParameter = yield select(state => state.performerView.parameter);
      yield put({
        type: 'changeParameterSuccess',
        payload: {
          ...prevParameter,
          ...payload,
        },
      });
      // 当客户列表选中的客户流水变化时，清除打电话显示服务记录的标志
      yield put({
        type: 'app/resetServiceRecordInfo',
      });
    },

    // 执行者视图的详情基本信息
    * getTaskDetailBasicInfo({ payload }, { call, put }) {
      const { isClear = true, ...otherPayload } = payload;
      // 左侧列表项被点击时，清除执行者视图服务实施客户列表的当前选中客户状态信息和筛选值、页码
      if (isClear) {
        // 清除查询上次目标客户列表的条件
        yield put({ type: 'clearParameter' });
        // 当客户列表选中的客户流水变化时，清除打电话显示服务记录的标志
        yield put({
          type: 'app/resetServiceRecordInfo',
        });
      }
      // 获取该任务的任务反馈
      yield put({
        type: 'getServiceType',
        payload: { pageNum: 1, pageSize: 100000, mssnId: payload.taskId },
      });
      const { resultData } = yield call(api.queryTaskDetailBasicInfo, otherPayload);
      if (resultData) {
        yield put({
          type: 'getTaskDetailBasicInfoSuccess',
          payload: resultData,
        });
      }
    },

    // 执行者视图的详情目标客户列表
    * queryTargetCust({ payload }, { call, put }) {
      const { isGetFirstItemDetail = true, eventId, ...others } = payload;
      const { resultData } = yield call(api.queryTargetCust, others);
      if (resultData) {
        yield put({
          type: 'queryTargetCustSuccess',
          payload: resultData,
        });
        const { list = EMPTY_LIST } = resultData;
        // 返回的列表数据不为空，默认再去查询第一条数据的详情
        if (!_.isEmpty(list) && isGetFirstItemDetail) {
          const firstItem = list[0] || EMPTY_OBJ;
          yield put({
            type: 'queryTargetCustDetail',
            payload: {
              missionId: payload.missionId,
              custId: firstItem.custId,
              missionFlowId: firstItem.missionFlowId,
              eventId,
            },
          });
        }
      }
    },
    // 根据目标客户列表的当前选中项的custId查询详情
    // 此处接口依赖列表接口返回的数据，列表接口中有数据时才能去查详情，
    // 列表接口中的没有数据时，先查询列表接口
    * queryTargetCustDetail({ payload }, { call, put }) {
      // 清空附件记录
      yield put({
        type: 'queryFileListSuccess',
        payload: [],
      });
      const { resultData } = yield call(api.queryTargetCustDetail, payload);
      if (resultData) {
        // 每次重新请求客户详情的时候都重新查询该客户名下其他代办任务
        const condition = {
          custId: resultData.custId,
          eventId: resultData.eventId,
          flowId: resultData.missionFlowId,
        };
        const otherTaskListPayload = {
          list: EMPTY_LIST,
          fetchOtherTaskListStatus: false,
        };
        // 每一次查询其他代办任务可能会接口失败，此时会保留上一次的数据，所以要清空上一次查询其他代办任务列表的数据
        yield put({
          type: 'getOtherTaskListSuccess',
          payload: otherTaskListPayload,
        });
        yield put({
          type: 'getOtherTaskList',
          payload: condition,
        });
        yield put({
          type: 'queryTargetCustDetailSuccess',
          payload: resultData,
        });
        // 请求uuid
        yield put({
          type: 'queryCustUuid',
        });
        // 记录信息中attachmentRecord不为空时，根据attachmentRecord 去查询附件信息
        if (resultData.attachmentRecord) {
          const { resultData: fileList }
            = yield call(custApi.ceFileList, { attachment: resultData.attachmentRecord });
          yield put({
            type: 'queryFileListSuccess',
            payload: fileList,
          });
        }
      }
    },
    // 添加服务记录
    * addMotServeRecord({ payload }, { call, put }) {
      yield put({ type: 'resetMotServiceRecord' });
      // 因为针对 MOT 回访类型任务需要调用与普通任务不一样的接口，所以在传递的请求参数中，
      // 添加 isMotReturnVisitTask 来控制
      const { isMotReturnVisitTask, ...resetPayload } = payload;
      let response = {};
      if (isMotReturnVisitTask) {
        response = yield call(api.addMotReturnVisitServiceRecord, resetPayload);
      } else {
        response = yield call(api.addMotServeRecord, resetPayload);
      }
      const { code, resultData } = response;
      if (code === '0') {
        yield put({
          type: 'addMotServeRecordSuccess',
          payload: resultData,
        });
      }
    },
    // 上传文件之前，先查询uuid
    * queryCustUuid({ payload = {} }, { call, put }) {
      const { resultData } = yield call(api.queryCustUuid, payload);
      yield put({
        type: 'queryCustUuidSuccess',
        payload: resultData,
      });
    },
    // 删除文件
    * ceFileDelete({ payload }, { call, put }) {
      const { resultData } = yield call(api.ceFileDelete, payload);
      const { attaches = [] } = resultData;
      yield put({
        type: 'ceFileDeleteSuccess',
        payload: attaches,
      });
    },
    * getServiceType({ payload }, { call, put }) {
      const response = yield call(api.getServiceType, payload);
      if (response.msg === 'OK') {
        yield put({
          type: 'getServiceTypeSuccess',
          payload: response.resultData,
        });
      }
    },
    * getTempQuesAndAnswer({ payload }, { call, put }) {
      const response = yield call(api.getTempQuesAndAnswer, payload);
      yield put({
        type: 'getTempQuesAndAnswerSuccess',
        payload: response.resultData,
      });
    },
    * saveAnswersByType({ payload }, { call, put }) {
      const response = yield call(api.saveAnswersByType, payload);
      yield put({
        type: 'saveAnswersByTypeSuccess',
        payload: response.resultData,
      });
    },
    * countAnswersByType({ payload }, { call, put }) {
      const { resultData } = yield call(api.countAnswersByType, payload);
      yield put({
        type: 'countAnswersByTypeSuccess',
        payload: resultData,
      });
    },
    * countExamineeByType({ payload }, { call, put }) {
      const { resultData } = yield call(api.countExamineeByType, payload);
      yield put({
        type: 'countExamineeByTypeSuccess',
        payload: resultData,
      });
    },
    // 执行者视图头部根据姓名或经纪客户号查询客户
    * queryCustomer({ payload }, { put }) {
      yield put({
        type: 'searchCustomer',
        payload,
        callType: SEARCH_CUSTOMER_FOR_PAGE_HEADER,
      });
    },

    // 因为put是异步的，所以将request抽离出来，根据callType来put action
    // 执行者视图头部根据姓名或经纪客户号查询客户
    // 执行者视图右侧根据姓名或经纪客户号查询客户
    * searchCustomer({ payload, callType }, { call, put }) {
      const { resultData } = yield call(api.queryCustomer, payload);
      if (callType === SEARCH_CUSTOMER_FOR_PAGE_HEADER) {
        yield put({
          type: 'queryCustomerSuccess',
          payload: resultData,
        });
      } else if (callType === SEARCH_CUSTOMER_FOR_RIGHT_DETAIL) {
        yield put({
          type: 'queryCustomerForServiceImplementationSuccess',
          payload: resultData,
        });
      }
    },

    // 执行者视图右侧根据姓名或经纪客户号查询客户
    * queryCustomerForServiceImplementation({ payload }, { put }) {
      yield put({
        type: 'searchCustomer',
        payload,
        callType: SEARCH_CUSTOMER_FOR_RIGHT_DETAIL,
      });
    },

    // 查询涨乐财富通服务方式下的客户反馈列表
    * queryCustFeedbackList4ZLFins({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryCustFeedbackList, payload);
      yield put({
        type: 'queryCustFeedbackList4ZLFinsSuccess',
        payload: resultData,
      });
    },

    // 查询涨乐财富通服务方式下的审批人列表
    * queryApprovalList4ZLFins({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryApproval, payload);
      yield put({
        type: 'queryApprovalList4ZLFinsSuccess',
        payload: resultData,
      });
    },
    // 获取服务结果进度
    * queryExecutorFlowStatus({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryExecutorFlowStatus, payload);
      yield put({
        type: 'queryExecutorFlowStatusSuccess',
        payload: resultData,
      });
    },
    // 获取客户反馈
    * queryExecutorFeedBack({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryExecutorFeedBack, payload);
      yield put({
        type: 'queryExecutorFeedBackSuccess',
        payload: resultData,
      });
    },
    // 获取客户明细
    * queryExecutorDetail({ payload }, { call, put, select }) {
      // redux中保存的之前的数据
      const oldCustDetail = yield select(state => state.performerView.custDetail);
      const { list: oldList } = oldCustDetail;
      // 调取接口获取新的数据
      const { resultData } = yield call(api.queryExecutorDetail, payload);
      const { list, page } = resultData;
      // 对null数据做对应的处理以便使用...
      const custDetailOldList = oldList || [];
      const newList = list || [];
      // 若page.pageNum为1则此时只需要把接口请求的数据放到redux的state中
      // 若page.pageNum不为1则此时需要将接口请求的数据与原来redux中的数据进行拼接
      let newResultData = resultData;
      if (page.pageNum !== 1) {
        newResultData = {
          list: [...custDetailOldList, ...newList],
          page,
        };
      }
      yield put({
        type: 'queryExecutorDetailSuccess',
        payload: newResultData,
      });
    },
    // 服务经理列表数据
    getSearchPersonList: [
      function* getSearchPersonList({ payload }, { call, put }) {
        const { resultData = EMPTY_OBJ } = yield call(custApi.getSearchServerPersonelList, payload);
        if (resultData) {
          const { servicePeopleList = EMPTY_LIST } = resultData;
          yield put({
            type: 'getSearchServerPersonListSuccess',
            payload: servicePeopleList,
          });
        }
      }, { type: 'takeLatest' }],
    // 根据任务类型获取相应的模板列表
    * getTemplateList({ payload }, { call, put }) {
      yield put({
        type: 'getTemplateListSuccess',
        payload: [],
      });
      const { resultData } = yield call(api.getTemplateList, payload);
      yield put({
        type: 'getTemplateListSuccess',
        payload: resultData,
      });
    },

    // 翻译模板
    * translateTemplate({ payload }, { call, put }) {
      yield put({
        type: 'translateTemplateSuccess',
        payload: {},
      });
      const { resultData } = yield call(api.translateTemplate, payload);
      yield put({
        type: 'translateTemplateSuccess',
        payload: resultData,
      });
    },
    // 获取客户名下其他代办任务
    * getOtherTaskList({ payload }, { call, put }) {
      const { resultData } = yield call(api.getOtherTaskList, payload);
      const newResultData = resultData.map(item => ({
        ...item,
        // 去除任务提示字段中的html标签和换行符
        hint: (item.hint || '').replace(regxp.htmlTags, '').replace(regxp.returnLine, ''),
        // 去除任务提示字段中的html标签和换行符
        contents: (item.contents || '').replace(regxp.htmlTags, '').replace(regxp.returnLine, ''),
        // 当前任务是否选中
        isChecked: false,
        // 所选一级反馈code
        serveCustFeedBack: '',
        // 所选一级反馈code
        serveCustFeedBack2: '',
        // 反馈时间
        feedBackTime: moment().format(dateFormat),
        // 上传附件的uuid
        uuid: '',
        // 回访结果
        visitResult: '',
        // 失败原因
        visitFailureDesc: '',
      }));
      const otherTaskListPayload = {
        list: newResultData,
        fetchOtherTaskListStatus: true,
      };
      yield put({
        type: 'getOtherTaskListSuccess',
        payload: otherTaskListPayload,
      });
    },

    // 获取当前针对MOT回访类型任务可分配的的人员列表
    * queryAllotEmpList({ payload }, { call, put }) {
      yield put({
        type: 'queryAllotEmpListSuccess',
        payload: {},
      });
      const { resultData } = yield call(api.queryAllotEmpList, payload);
      yield put({
        type: 'queryAllotEmpListSuccess',
        payload: resultData,
      });
    },

    // 将MOT 回访任务分配给相关人员
    * dispatchTaskToEmp({ payload }, { call, put }) {
      yield put({
        type: 'dispatchTaskToEmpSucess',
        payload: '',
      });
      const { resultData } = yield call(api.dispatchTaskToEmp, payload);
      yield put({
        type: 'dispatchTaskToEmpSucess',
        payload: resultData,
      });
    },
    // 批量添加服务记录
    * saveBatchAddServiceRecord({ payload }, { call }) {
      yield call(api.saveBatchAddServiceRecord, payload);
    },
  },
  subscriptions: {
  },
};

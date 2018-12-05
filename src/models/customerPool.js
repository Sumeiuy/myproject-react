/* eslint-disable import/no-anonymous-default-export */
/**
 * @file models/customerPool.js
 *  目标客户池模型管理
 * @author wangjunjun
 */
import _ from 'lodash';
import queryString from 'query-string';
import { customerPool as api, common as commonApi } from '../api';
import { emp, url } from '../helper';
import { toastM } from '../utils/sagaEffects';
import { ALL_SERVE_SOURCE } from '../routes/customerPool/config';

// 首页客户可用标签分页的页码和每页条数
const INITIAL_CUSTLABEL_PAGENO = 1;
const INITIAL_CUSTLABEL_PAGESIZE = 20;
// 我的待办默认pageSize
const MY_TODO_PAGESIZE = 10000;

function matchRouteAndexec(pathname, params, routeCallbackObj) {
  _.forOwn(routeCallbackObj, (value, key) => {
    if (url.matchRoute(key, pathname)) {
      routeCallbackObj[key](params);
      return false;
    }
    return true;
  });
}

// 后端反馈首页查询客户可用标签不好做分页，所以前端做处理
function custLabelListPaging({
  list,
  pageNo = INITIAL_CUSTLABEL_PAGENO,
  pageSize = INITIAL_CUSTLABEL_PAGESIZE,
}) {
  const start = pageNo === 1 ? 0 : (pageNo - 1) * pageSize;
  const end = pageNo === 1 ? pageSize : pageNo * pageSize;
  return {
    list: list.slice(start, end),
    page: {
      pageNo,
      totalCount: list.length,
      pageSize,
    },
  };
}

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
// const LIST_MAX = 1e4;
const INITIAL_PAGE_NUM = 1;
const INITIAL_PAGE_TEN_SIZE = 10;
// 题目类型，暂时写死，以后可能需要改成从接口获取，可能有多个
const assessType = 'MOT_EMP_FEEDBACK';

export default {
  namespace: 'customerPool',
  state: {
    custCount: [], // 经营指标中的新增客户数指标
    information: {}, // 资讯
    performanceIndicators: EMPTY_OBJECT, // 投顾指标
    managerIndicators: EMPTY_OBJECT, // 经营指标
    custAnalyticsIndicators: EMPTY_OBJECT,
    // 存放从服务端获取的全部代办数据
    todolist: [],
    // 存放筛选后数据
    todolistRecord: [],
    // 组织机构树
    custRange: [],
    // 时间周期：本年、本季、本月
    cycle: [],
    process: {},
    empInfo: {},
    // 客户列表中对应的每个客户的近6个月的收益
    monthlyProfits: {},
    hotWdsList: [],
    hotPossibleWdsList: [],
    // 客户列表搜索的热词
    custListHotPossibleWdsList: [],
    // 目标客户列表数据
    custList: [],
    // 目标客户列表页码
    custPage: {
      pageSize: 10,
      pageNo: 1,
      total: 0,
    },
    cusgroupList: [],
    cusgroupPage: {
      pageSize: 0,
      pageNo: 0,
      total: 0,
    },
    searchHistoryVal: '',
    cusGroupSaveResult: '',
    createTaskResult: {},
    updateTaskResult: {},
    cusGroupSaveMessage: '',
    resultgroupId: '',
    incomeData: [], // 净收入
    custContactData: {}, // 客户联系方式
    serviceRecordData: {}, // 服务记录
    custEmail: {},
    // 分组维度，客户分组列表
    customerGroupList: {},
    // 指定分组下的客户列表
    groupCustomerList: {},
    // 客户分组历史搜索列表
    customerHistoryWordsList: [],
    // 客户分组是否清除历史搜索成功
    isClearCustomerHistorySuccess: false,
    // 客户分组历史搜索值，点击过按钮
    customerSearchHistoryVal: '',
    // 客户分组热词列表
    customerHotPossibleWordsList: [],
    // 编辑，新增客户分组结果
    operateGroupResult: '',
    // 删除分组结果
    deleteGroupResult: '',
    // 删除分组下客户结果
    deleteCustomerFromGroupResult: {},
    // 360服务记录查询数据
    serviceLogData: [],
    // 360服务记录数据，这里有几个冗余的数据，需要后期优化
    serviceLogList: [],
    // 是否是最后一条服务记录
    isLastServiceLog: false,
    // 360服务记录查询更多数据
    serviceLogMoreData: [],
    // 预览客户细分数据
    priviewCustFileData: {},
    // 存储的任务流程数据
    storedTaskFlowData: {},
    // 当前选中tab
    currentTab: '1',
    // 提交任务流程结果
    submitTaskFlowResult: '',
    // 可查询服务人员列表
    searchServerPersonList: EMPTY_LIST,
    // 列表页的服务营业部
    serviceDepartment: EMPTY_OBJECT,
    // 标签圈人
    circlePeopleData: [],
    peopleOfLabelData: {},
    // 审批人列表
    approvalList: [],
    // 存储自建任务数据
    storedCreateTaskData: {},
    // 任务列表-任务详情基本信息
    taskBasicInfo: {},
    // 文件下载文件列表数据
    filesList: [],
    // 问卷调查模板Id
    templateId: 0,
    // 一级指标数据
    indicatorData: [],
    // 当前rukou
    currentEntry: 0,
    // 产品列表
    productList: [],
    // 精选组合
    jxGroupProductList: [],
    // 所有标签列表
    tagList: [],
    // 审批流程按钮
    approvalBtn: {},
    // 审批按钮提交成功
    submitApporvalResult: {},
    // 查询客户的数量限制或者是否都是本人名下的客户
    sendCustsServedByPostnResult: {
      custNumsIsExceedUpperLimit: false,
      sendCustsServedByPostn: false,
    },
    // 查询是否都是本人名下的客户
    custServedByPostnResult: true,
    // 瞄准镜的筛选项
    sightingTelescopeFilters: {},
    allSightingTelescopeFilters: [],
    // 客户分组批量导入客户解析客户列表
    batchCustList: {},
    // 当前添加的服务记录的信息
    currentCommonServiceRecord: {},
    // 持仓产品的详情
    holdingProducts: {},
    // 添加通话记录关联服务记录是否成功
    isAddCallRecordSuccess: false,
    // 首页所有可用客户标签
    custLabelList: EMPTY_LIST,
    // 前端处理过的带分页的客户标签数据
    pagingCustLabelData: EMPTY_OBJECT,
    // 订购组合产品-持仓证券列表
    holdingSecurityData: EMPTY_OBJECT,
    // 客户列表持仓行业数据
    industryList: EMPTY_LIST,
    // 客户列表中持仓行业的详情
    industryDetail: EMPTY_OBJECT,
    // 客户列表自定义标签
    definedLabelsInfo: EMPTY_LIST,
    // 申请列表
    applyList: EMPTY_OBJECT,
    // 审批列表
    approveList: EMPTY_OBJECT,
    // 发起人下拉框数据
    initiator: EMPTY_LIST,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        // 监听location的配置对象
        // 函数名称为路径匹配字符
        // 如匹配则执行相应的函数，只会执行第一个匹配的函数
        // 所以是有序的
        const routeCallbackObj = {
          serviceLog(param) {
            const params = param;
            // 默认搜索内容为空
            const { pageSize, serveDateToPaged, keyword = '' } = params;
            if (_.isEmpty(pageSize)) params.pageSize = null;
            if (_.isEmpty(serveDateToPaged)) params.serveDateToPaged = null;
            params.pageNum = 1; // 默认显示第一页
            dispatch({
              type: 'getServiceLog',
              payload: {
                ...params,
                serveSource: params.serveSource === ALL_SERVE_SOURCE ? '' : params.serveSource,
                keyword: !_.isEmpty(keyword) ? decodeURIComponent(keyword) : '',
              },
              loading: true,
            });
          },
          customerGroupManage(params) {
            const { curPageNum, curPageSize, keyWord = null } = params;
            dispatch({
              type: 'getCustomerGroupList',
              payload: {
                pageNum: curPageNum || INITIAL_PAGE_NUM,
                pageSize: curPageSize || INITIAL_PAGE_TEN_SIZE,
                keyWord,
              },
              loading: true,
            });
          },
          customerGroup(params) {
            const { curPageNum, curPageSize, keyWord = null } = params;
            dispatch({
              type: 'customerGroupList',
              payload: {
                pageNum: curPageNum || INITIAL_PAGE_NUM,
                pageSize: curPageSize || INITIAL_PAGE_TEN_SIZE,
                empId: emp.getId(),
                keyWord,
              },
              loading: true,
            });
          },
          todo(params) {
            const { keyword, taskType } = params;
            if (keyword) {
              dispatch({
                type: 'search',
                payload: keyword,
                loading: true,
              });
              return;
            }
            if (taskType === 'MY_TODO') {
              dispatch({
                type: 'getToDoList',
                loading: true,
                payload: {
                  pageNum: INITIAL_PAGE_NUM,
                  pageSize: MY_TODO_PAGESIZE,
                }
              });
            }
          },
        };
        const matchRouteAndCallback = matchRouteAndexec.bind(this, pathname, query);
        matchRouteAndCallback(routeCallbackObj);
      });
    },
  },

  effects: {
    // 投顾绩效
    * getCustCount({ payload }, { call, put }) {  //eslint-disable-line
      const response = yield call(api.getCustCount, payload);
      yield put({
        type: 'getCustCountSuccess',
        payload: response,
      });
    },
    // 投顾绩效
    * getPerformanceIndicators({ payload }, { call, put }) {  //eslint-disable-line
      const response = yield call(api.getPerformanceIndicators, payload);
      yield put({
        type: 'getPerformanceIndicatorsSuccess',
        payload: response,
      });
    },
    // 经营指标）
    * getManagerIndicators({ payload }, { call, put }) {  //eslint-disable-line
      const response = yield call(api.getManagerIndicators, payload);
      yield put({
        type: 'getManagerIndicatorsSuccess',
        payload: response,
      });
    },

    * getCustAnalyticsIndicators({ payload }, { call, put }) {  //eslint-disable-line
      const response = yield call(api.getCustAnalyticsIndicators, payload);
      yield put({
        type: 'getCustAnalyticsIndicatorsSuccess',
        payload: response,
      });
    },
    // 资讯列表和详情
    * getInformation({ payload }, { call, put }) {  //eslint-disable-line
      const response = yield call(api.getInformation, payload);
      yield put({
        type: 'getInformationSuccess',
        payload: response,
      });
    },
    // 代办流程任务列表
    * getToDoList({ payload }, { call, put }) {  //eslint-disable-line
      const response = yield call(api.getToDoList, payload);
      yield put({
        type: 'getToDoListSuccess',
        payload: response,
      });
    },
    // 获取客户范围
    * getCustomerScope({ payload }, { call, put }) {
      const resultData = yield call(api.getCustRangeAll);
      yield put({
        type: 'getCustomerScopeSuccess',
        payload: resultData,
      });
    },
    // (首页总数)
    * getToBeDone({ payload }, { call, put }) {
      const queryNumbers = yield call(api.getQueryNumbers, payload);
      yield put({
        type: 'getWorkFlowTaskCountSuccess',
        payload: { queryNumbers },
      });
    },
    // 代办流程任务搜索
    * search({ payload }, { put, select }) {
      const todolist = yield select(state => state.customerPool.todolist);
      yield put({
        type: 'searchSuccess',
        payload: todolist.filter(v => v.subject.indexOf(payload) > -1),
      });
    },
    // 获取客户列表
    * getCustomerList({ payload }, { call, put }) {
      const response = yield call(api.getCustomerList, payload);
      yield put({
        type: 'getCustomerListSuccess',
        payload: response,
      });
    },
    // 获取客户列表6个月收益率
    * getCustIncome({ payload }, { call, put }) {
      // yield put({
      //   type: 'getCustIncomeReq',
      // });
      const { resultData: { monthlyProfits } } = yield call(api.getCustIncome, payload);
      yield put({
        type: 'getCustIncomeSuccess',
        payload: {
          ...payload,
          monthlyProfits
        },
      });
    },
    // 默认推荐词及热词推荐列表及历史搜索数据
    * getHotWds({ payload }, { call, put }) {
      const response = yield call(api.getHotWds, payload);
      yield put({
        type: 'getHotWdsSuccess',
        payload: { response },
      });
    },
    // 联想的推荐热词列表
    getHotPossibleWds: [
      function* getHotPossibleWds({ payload }, { call, put }) {
        const response = yield call(api.getHotPossibleWds, payload);
        yield put({
          // 由于头部公共搜索组件和客户列表搜索组件共存的情况，所以要用不同的字段区分
          type: payload.fromCustList
            ? 'getHotPossibleWdsByCustListSuccess'
            : 'getHotPossibleWdsSuccess',
          payload: { response },
        });
      }, { type: 'takeLatest' }],
    // 获取客户分组列表信息
    * customerGroupList({ payload }, { call, put }) {
      if (!_.isEmpty(payload)) {
        const response = yield call(api.customerGroupList, payload);
        yield put({
          type: 'getGroupListSuccess',
          payload: response,
        });
      }
    },
    // 添加客户到现有分组
    * addCustomerToGroup({ payload }, { call, put }) {
      if (!_.isEmpty(payload)) {
        const response = yield call(api.saveCustGroupList, payload);
        yield put({
          type: 'addCusToGroupSuccess',
          payload: {
            groupId: payload.groupId,
            result: response.resultData,
          },
        });
      }
    },
    // 添加客户到新的分组
    * createCustGroup({ payload }, { call, put }) {
      if (!_.isEmpty(payload)) {
        const { resultData } = yield call(api.createCustGroup, payload);
        yield put({
          type: 'addCusToGroupSuccess',
          payload: {
            result: resultData,
          },
        });
      }
    },
    // 客户分组批量导入客户解析客户列表
    * queryBatchCustList({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryBatchCustList, payload);
      yield put({
        type: 'queryBatchCustListSuccess',
        payload: { resultData },
      });
    },
    // 自建任务提交
    * createTask({ payload }, { call, put }) {
      const createTaskResult = yield call(api.createTask, payload);
      yield put({
        type: 'createTaskSuccess',
        payload: { createTaskResult },
      });
    },
    // 自建任务编辑后，重新提交
    * updateTask({ payload }, { call, put }) {
      const updateTaskResult = yield call(api.updateTask, payload);
      yield put({
        type: 'updateTaskSuccess',
        payload: { updateTaskResult },
      });
    },
    // 获取净创收数据
    * getIncomeData({ payload }, { call, put }) {
      const response = yield call(api.queryKpiIncome, payload);
      const { resultData } = response;
      yield put({
        type: 'getIncomeDataSuccess',
        payload: resultData,
      });
    },
    // 获取个人和机构联系方式
    * getCustContact({ payload }, { call, put, select }) {
      const custContactData = yield select(state => state.customerPool.custEmail);
      const custId = payload.custId;
      let resultData = null;
      if (!_.isEmpty(custContactData[custId])) {
        resultData = custContactData[custId];
      } else {
        const response = yield call(api.queryCustContact, payload);
        resultData = response.resultData;
      }
      yield put({
        type: 'getCustContactSuccess',
        payload: {
          resultData,
          custId
        },
      });
      // 唤起电话联系弹窗时，获取自建任务平台的服务类型、任务反馈字典，为打电话做准备
      yield put({
        type: 'app/getMotCustfeedBackDict',
        payload: {
          pageNum: 1,
          pageSize: 10000,
          type: 2
        },
      });
    },
    * getCustEmail({ payload }, { call, put, select }) {
      const custEmailData = yield select(state => state.customerPool.custContactData);
      const { custId } = payload;
      let resultData = null;
      if (!_.isEmpty(custEmailData[custId])) {
        resultData = custEmailData[custId];
      } else {
        const response = yield call(api.queryCustContact, payload);
        resultData = response.resultData;
      }
      yield put({
        type: 'getCustEmailSuccess',
        payload: {
          resultData,
          custId
        },
      });
    },
    // 获取最近五次服务记录
    * getServiceRecord({ payload }, { call, put }) {
      const response = yield call(api.queryRecentServiceRecord, payload);
      const { resultData } = response;
      const { custId } = payload;
      let attachment = null;
      if (!_.isEmpty(resultData)) {
        const { uuid } = resultData[0];
        attachment = uuid;
      }
      if (!_.isEmpty(attachment)) {
        const fileListRes = yield call(api.ceFileList, { attachment });
        const { resultData: fileResultData } = fileListRes;
        yield put({
          type: 'getServiceRecordSuccess',
          payload: {
            resultData,
            custId,
            fileResultData
          },
        });
      } else {
        yield put({
          type: 'getServiceRecordSuccess',
          payload: {
            resultData,
            custId
          },
        });
      }
    },
    // 列表页添加服务记录
    * addCommonServeRecord({ payload }, { call, put }) {
      yield put({
        type: 'resetServeRecord',
      });
      const { noHints = false, ...otherPayload } = payload;
      const res = yield call(api.addCommonServeRecord, otherPayload);
      if (res.code === '0' && res.resultData !== 'failure') {
        // 添加成功后关闭添加窗口
        yield put({
          type: 'app/toggleServiceRecordModal',
          payload: false,
        });
        // 打电话后自动生成服务记录时，不需要弹出提示，其他情况需要提示
        if (!noHints) {
          yield put({
            type: 'toastM',
            message: '添加服务记录成功',
            duration: 2,
          });
        }
        yield put({
          type: 'addServeRecordSuccess',
          payload: res,
        });
      }
    },
    // 获取客户分组
    * getCustomerGroupList({ payload }, { call, put }) {
      const response = yield call(api.queryCustomerGroupList, payload);
      const { resultData } = response;
      yield put({
        type: 'getCustomerGroupListSuccess',
        payload: resultData,
      });
    },
    // 获取分组客户
    * getGroupCustomerList({ payload }, { call, put }) {
      const response = yield call(api.queryGroupCustomerList, payload);
      const { resultData } = response;
      yield put({
        type: 'getGroupCustomerListSuccess',
        payload: resultData,
      });
    },
    // 分组客户下联想的推荐热词列表
    * getCustomerHotPossibleWds({ payload }, { call, put }) {
      const response = yield call(api.queryPossibleCustList, payload);
      const { resultData } = response;
      yield put({
        type: 'getCustomerHotPossibleWdsSuccess',
        payload: resultData,
      });
    },
    // 新增，编辑客户分组
    * operateGroup({ payload }, { call, put }) {
      const {
        request, request: { groupId }, keyWord, pageNum, pageSize
      } = payload;
      const response = yield call(api.operateGroup, request);
      const { resultData } = response;
      let message;
      yield put({
        type: 'operateGroupSuccess',
        payload: resultData,
      });
      if (groupId) {
        // 更新
        message = '更新分组成功';
      } else {
        message = '新增分组成功';
      }
      yield put({
        type: 'toastM',
        message,
        duration: 2,
      });
      // 成功之后，更新分组信息
      yield put({
        type: 'getCustomerGroupList',
        payload: {
          pageNum: pageNum || INITIAL_PAGE_NUM,
          pageSize: pageSize || INITIAL_PAGE_TEN_SIZE,
          keyWord,
        },
      });
      if (groupId) {
        // 成功之后，更新分组下客户信息
        yield put({
          type: 'getGroupCustomerList',
          payload: {
            pageNum: INITIAL_PAGE_NUM,
            pageSize: INITIAL_PAGE_TEN_SIZE,
            groupId,
          },
        });
      }
    },
    * toastM({ message, duration }) {
      yield toastM(message, duration);
    },
    // 删除客户分组
    * deleteGroup({ payload }, { call, put }) {
      const {
        request, keyWord, pageNum, pageSize
      } = payload;
      const response = yield call(api.deleteGroup, request);
      const { resultData } = response;
      yield put({
        type: 'deleteGroupSuccess',
        payload: resultData,
      });
      yield put({
        type: 'toastM',
        message: '删除分组成功',
        duration: 2,
      });
      // 删除成功之后，更新分组信息
      yield put({
        type: 'getCustomerGroupList',
        payload: {
          pageNum: pageNum || INITIAL_PAGE_NUM,
          pageSize: pageSize || INITIAL_PAGE_TEN_SIZE,
          keyWord,
        },
      });
    },
    * deleteCustomerFromGroup({ payload }, { call, put }) {
      const response = yield call(api.deleteCustomerFromGroup, payload);
      const {
        custId, groupId, keyWord, curPageNum, curPageSize
      } = payload;
      const { resultData } = response;
      yield put({
        type: 'deleteCustomerFromGroupSuccess',
        payload: {
          resultData,
          custId,
          groupId
        },
      });
      yield put({
        type: 'toastM',
        message: '删除分组下客户成功',
        duration: 2,
      });
      // 删除成功之后，更新分组下客户信息
      yield put({
        type: 'getGroupCustomerList',
        payload: {
          pageNum: INITIAL_PAGE_NUM,
          pageSize: INITIAL_PAGE_TEN_SIZE,
          groupId,
        },
      });
      // 删除成功之后，更新分组信息
      yield put({
        type: 'getCustomerGroupList',
        payload: {
          pageNum: curPageNum || INITIAL_PAGE_NUM,
          pageSize: curPageSize || INITIAL_PAGE_TEN_SIZE,
          keyWord,
        },
      });
    },
    // 360服务记录查询
    * getServiceLog({ payload }, { call, put }) {
      const response = yield call(api.queryAllServiceRecord, payload);
      const { resultData } = response;
      let attachment = null;
      if (!_.isEmpty(resultData)) {
        const { uuid } = resultData[0];
        attachment = uuid;
      }
      if (!_.isEmpty(attachment)) {
        const fileListRes = yield call(api.ceFileList, { attachment });
        const { resultData: fileResultData } = fileListRes;
        yield put({
          type: 'getServiceLogSuccess',
          payload: { resultData, fileResultData },
        });
      } else {
        yield put({
          type: 'getServiceLogSuccess',
          payload: { resultData },
        });
      }
    },
    * getSearchServerPersonList({ payload }, { call, put }) {
      if (!payload.keyword) {
        // 和之前的用户行为(输入空时，搜索结果为预置数据项)，保持一致
        yield put({
          type: 'getSearchServerPersonListSuccess',
          payload: [
            {
              ptyMngName: '所有人',
              ptyMngId: ''
            },
            {
              ptyMngName: '我的',
              ptyMngId: emp.getId()
            },
          ],
        });
      } else {
        const { resultData = EMPTY_OBJECT } = yield call(api.getSearchServerPersonelList, payload);
        if (resultData) {
          const { servicePeopleList = EMPTY_LIST } = resultData;
          yield put({
            type: 'getSearchServerPersonListSuccess',
            payload: servicePeopleList,
          });
        }
      }
    },
    getSearchPersonList: [
      function* getSearchPersonList({ payload }, { call, put }) {
        const { resultData = EMPTY_OBJECT } = yield call(api.getSearchServerPersonelList, payload);
        if (resultData) {
          const { servicePeopleList = EMPTY_LIST } = resultData;
          yield put({
            type: 'getSearchServerPersonListSuccess',
            payload: servicePeopleList,
          });
        }
      }, { type: 'takeLatest' }],
    // 360服务记录查询更多服务
    * getServiceLogMore({ payload }, { call, put }) {
      const response = yield call(api.queryAllServiceRecord, payload);
      const { resultData } = response;
      yield put({
        type: 'getServiceLogMoreSuccess',
        payload: { resultData },
      });
    },
    // 文件下载文件列表数据
    * getCeFileList({ payload }, { call, put }) {
      const response = yield call(api.ceFileList, payload);
      const { resultData } = response;
      yield put({
        type: 'getCeFileListSuccess',
        payload: { resultData },
      });
    },
    // 预览客户细分导入数据
    * previewCustFile({ payload }, { call, put }) {
      const response = yield call(api.previewCustFile, payload);
      const { resultData } = response;
      yield put({
        type: 'priviewCustFileSuccess',
        payload: resultData,
      });
    },
    // 根据权限获取组织机构树
    * getCustRangeByAuthority({ payload }, { call, put }) {
      const resultData = yield call(api.getCustRangeByAuthority);
      yield put({
        type: 'getCustRangeByAuthoritySuccess',
        payload: resultData,
      });
    },
    // 标签圈人
    * getLabelInfo({ payload }, { call, put }) {
      const response = yield call(api.queryLabelInfo, payload);
      const { resultData } = response;
      yield put({
        type: 'getLabelInfoSuccess',
        payload: { resultData },
      });
    },
    // 获取所有的可用标签
    * getTagList({ payload }, { call, put }) {
      const response = yield call(api.queryTagList, payload);
      const { resultData } = response;
      yield put({
        type: 'getTagListSuccess',
        payload: { resultData },
      });
    },
    // 标签圈人-id查询客户列表
    * getLabelPeople({ payload }, { call, put }) {
      const response = yield call(api.getCustomerList, payload);
      const { resultData: { custListVO } } = response;
      if (response.code === '0') {
        yield put({
          type: 'getLabelPeopleSuccess',
          payload: custListVO,
        });
      }
    },
    // 提交任务流程
    * submitTaskFlow({ payload }, { call, put }) {
      const response = yield call(api.createTask, payload);
      const { resultData } = response;
      yield put({
        type: 'submitTaskFlowSuccess',
        payload: resultData,
      });
      // 弹出提交成功提示信息
      yield put({
        type: 'toastM',
        message: '提交任务成功',
        duration: 2,
      });
      // 提交成功之后，清除taskFlow数据
      yield put({
        type: 'clearTaskFlowData',
      });
      // 提交成功之后，清除tab
      yield put({
        type: 'resetActiveTab',
      });
    },
    // 获取审批人列表
    * getApprovalList({ payload }, { call, put }) {
      const response = yield call(api.queryFlowStepInfo, payload);
      const { resultData = EMPTY_OBJECT } = response;
      const { flowButtons: [{ flowAuditors }] } = resultData;

      yield put({
        type: 'getApprovalListSuccess',
        payload: flowAuditors,
      });
    },
    // 获取任务列表-任务详情基本信息
    * getTaskBasicInfo({ payload }, { call, put }) {
      const response = yield call(api.queryBasicInfo, payload);
      const { resultData } = response;
      yield put({
        type: 'getTaskBasicInfoSuccess',
        payload: { resultData },
      });
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
      const { attaches = EMPTY_LIST } = resultData;
      yield put({
        type: 'ceFileDeleteSuccess',
        payload: attaches,
      });
    },
    // 根据问题IdList生成模板id
    * generateTemplateId({ payload }, { call, put }) {
      const { resultData } = yield call(api.generateTemplateId, {
        ...payload,
        assessType
      });
      yield put({
        type: 'generateTemplateIdSuccess',
        payload: resultData,
      });
    },
    // 查询指标数据
    * queryIndicatorData({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryIndicatorData, payload);
      yield put({
        type: 'queryIndicatorDataSuccess',
        payload: resultData,
      });
    },
    // 搜索产品列表
    queryProduct: [
      function* queryProduct({ payload }, { call, put }) {
        const { resultData } = yield call(api.queryProduct, payload);
        yield put({
          type: 'queryProductDataSuccess',
          payload: resultData,
        });
      }, { type: 'takeLatest' }],
    queryJxGroupProduct: [
      function* queryJxGroupProduct({ payload }, { call, put }) {
        const { resultData } = yield call(api.queryJxGroupProduct, payload);
        yield put({
          type: 'queryJxGroupProductDataSuccess',
          payload: resultData,
        });
      }, { type: 'takeLatest' }],
    // 审批流程获取按钮
    * getApprovalBtn({ payload }, { call, put }) {
      const response = yield call(api.queryApprovalBtn, payload);
      const { resultData } = response;
      yield put({
        type: 'getApprovalBtnSuccess',
        payload: { resultData },
      });
    },
    // 审批按钮提交
    * submitApproval({ payload }, { call, put }) {
      const submitApporvalResult = yield call(api.submitApproval, payload);
      yield put({
        type: 'submitApprovalSuccess',
        payload: submitApporvalResult,
      });
    },
    // 查询导入的客户、标签圈人下的客户、客户列表选择的客户、客户分组下的客户是否超过了1000个或者是否是我名下的客户
    * isSendCustsServedByPostn({ payload }, { call, put }) {
      const { resultData } = yield call(api.isSendCustsServedByPostn, payload);
      yield put({
        type: 'isSendCustsServedByPostnSuccess',
        payload: resultData,
      });
    },
    // 查询客户是否是我名下的客户
    * isCustServedByPostn({ payload }, { call, put }) {
      const { resultData } = yield call(api.isCustServedByPostn, payload);
      yield put({
        type: 'isCustServedByPostnSuccess',
        payload: resultData,
      });
    },
    // 序列化
    * getFiltersOfSightingTelescopeSequence({ payload }, { call, put, select }) {
      function* getFiltersOfSightingTelescopewithKey(key) {
        const { resultData } = yield call(commonApi.getFiltersOfSightingTelescope, {
          prodId: key,
        });
        return {
          key,
          list: resultData.object || {},
        };
      }
      const allSightingTelescopeFilters = yield select(
        state => state.customerPool.allSightingTelescopeFilters
      );

      const { sightingTelescopeList } = payload;
      let resultData = [];

      const reqestSightingTelescopes = _.filter(
        sightingTelescopeList, key => !_.some(allSightingTelescopeFilters, item => item.key === key)
      );

      if (!_.isEmpty(reqestSightingTelescopes)) {
        resultData = yield _.map(
          reqestSightingTelescopes, key => getFiltersOfSightingTelescopewithKey(key)
        );
      }
      resultData = allSightingTelescopeFilters.concat(resultData);
      yield put({
        type: 'getFiltersOfSightingTelescopeSequenceSuccess',
        payload: resultData,
      });
    },
    // 获取瞄准镜的筛选条件
    * getFiltersOfSightingTelescope({ payload }, { call, put }) {
      const { resultData } = yield call(commonApi.getFiltersOfSightingTelescope, payload);
      yield put({
        type: 'getFiltersOfSightingTelescopeSuccess',
        payload: resultData,
      });
    },
    // 根据持仓产品的id查询对应的详情
    * queryHoldingProduct({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryHoldingProduct, payload);
      yield put({
        type: 'queryHoldingProductSuccess',
        payload: {
          ...payload,
          resultData
        },
      });
    },
    // 添加电话记录，关联打电话自动生成的服务记录
    * addCallRecord({ payload }, { call, put }) {
      const { resultData } = yield call(commonApi.addCallRecord, payload);
      yield put({
        type: 'addCallRecordSuccess',
        payload: resultData,
      });
    },
    // 首页查询所有可用客户标签列表
    * queryCustLabelList({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryCustLabelList, payload);
      yield put({
        type: 'queryCustLabelListSuccess',
        payload: resultData,
      });
    },
    // 客户列表-组合产品订购客户查询持仓证券重合度
    * queryHoldingSecurityRepetition({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryHoldingSecurityRepetition, payload);
      const newResultData = {
        key: `${payload.custId}_${payload.combinationCode}`,
        value: resultData,
      };
      yield put({
        type: 'queryHoldingSecurityRepetitionSuccess',
        payload: newResultData,
      });
    },
    // 查询客户列表持仓行业过滤器的数据
    * queryIndustryList({ payload }, { call, put }) {
      const { code, resultData } = yield call(api.queryIndustryList, payload);
      if (code === '0') {
        yield put({
          type: 'queryIndustryListSuccess',
          payload: resultData,
        });
      }
    },
    // 查询持仓行业详情
    * queryHoldingIndustryDetail({ payload }, { call, put }) {
      const { code, resultData } = yield call(api.queryHoldingIndustryDetail, payload);
      if (code === '0') {
        yield put({
          type: 'queryHoldingIndustryDetailSuccess',
          payload: {
            ...payload,
            resultData: resultData.detail
          },
        });
      }
    },
    // 查询自定义标签
    * queryDefinedLabelsInfo({ payload }, { call, put }) {
      const { resultData } = yield call(api.queryDefinedLabelsInfo, payload);
      const finalResultData = _.reduce(
        resultData,
        (flattened, labelList) => flattened.concat(labelList.children),
        [],
      );
      yield put({
        type: 'queryDefinedLabelsInfoSuccess',
        payload: finalResultData,
      });
    },
    // 获取申请列表
    * getApplyList({ payload }, { call, put }) {
      const resultData = yield call(api.getApplyList, payload);
      yield put({
        type: 'getApplyListSuccess',
        payload: resultData,
      });
    },
    // 获取审批列表
    * getApproveList({ payload }, { call, put }) {
      const resultData = yield call(api.getApproveList, payload);
      yield put({
        type: 'getApproveListSuccess',
        payload: resultData,
      });
    },
    // 获取发起人下拉框
    * getInitiator({ payload }, { call, put }) {
      const resultData = yield call(api.getInitiator, payload);
      yield put({
        type: 'getInitiatorSuccess',
        payload: resultData,
      });
    },
  },
  reducers: {
    ceFileDeleteSuccess(state, action) {
      return {
        ...state,
        deleteFileResult: action.payload,
      };
    },
    queryCustUuidSuccess(state, action) {
      return {
        ...state,
        custUuid: action.payload,
      };
    },
    getCustCountSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        custCount: resultData,
      };
    },
    getPerformanceIndicatorsSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        performanceIndicators: resultData || EMPTY_OBJECT,
      };
    },
    getManagerIndicatorsSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        managerIndicators: resultData || EMPTY_OBJECT,
      };
    },
    getCustAnalyticsIndicatorsSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        custAnalyticsIndicators: resultData || EMPTY_OBJECT,
      };
    },
    getInformationSuccess(state, action) {
      const { payload: { resultData } } = action;
      // 记录页码对应的列表数据
      return {
        ...state,
        information: resultData,
      };
    },
    getToDoListSuccess(state, action) {
      const { payload: { resultData: { empWorkFlowList } } } = action;
      empWorkFlowList.forEach((item) => {
        item.task = {  //eslint-disable-line
          text: item.subject,
          dispatchUri: item.dispatchUri,
          flowClass: item.flowClass,
        };
      });
      return {
        ...state,
        todolist: empWorkFlowList,
        todolistRecord: empWorkFlowList,
      };
    },
    searchSuccess(state, action) {
      return {
        ...state,
        todolistRecord: action.payload,
        todoPage: {
          curPageNum: 1,
        },
      };
    },
    // 客户池用户范围
    getCustomerScopeSuccess(state, action) {
      const { payload: { resultData } } = action;
      let custRange = [];
      if (resultData) {
        custRange = [
          {
            id: resultData.id,
            name: resultData.name,
            level: resultData.level
          },
          ...resultData.children,
        ];
      }
      return {
        ...state,
        custRange,
      };
    },
    // (首页总数)
    getWorkFlowTaskCountSuccess(state, action) {
      const { payload: { queryNumbers } } = action;
      const process = queryNumbers.resultData;
      return {
        ...state,
        process,
      };
    },
    // 默认推荐词及热词推荐列表
    getHotWdsSuccess(state, action) {
      const { payload: { response } } = action;
      const hotWdsList = response.resultData;
      return {
        ...state,
        hotWdsList,
      };
    },
    // 联想的推荐热词列表
    getHotPossibleWdsSuccess(state, action) {
      const { payload: { response } } = action;
      const { possibleWdsList } = response.resultData;
      // 返回的数据的primaryKey不能重复
      return {
        ...state,
        hotPossibleWdsList: _.uniqBy(possibleWdsList, 'primaryKey'),
      };
    },
    // 客户列表使用的的推荐热词列表
    getHotPossibleWdsByCustListSuccess(state, action) {
      const { payload: { response } } = action;
      const { possibleWdsList } = response.resultData;
      // 返回的数据的primaryKey不能重复
      return {
        ...state,
        custListHotPossibleWdsList: _.uniqBy(possibleWdsList, 'primaryKey'),
      };
    },
    getCustomerListSuccess(state, action) {
      const { payload: { resultData: { custListVO } } } = action;
      if (!custListVO) {
        return {
          ...state,
          custList: [],
          custPage: {
            pageSize: 10,
            pageNo: 1,
            total: 0,
          },
        };
      }
      const custPage = {
        pageSize: custListVO.pageSize,
        pageNo: Number(custListVO.curPageNum),
        total: custListVO.totalCount,
      };
      return {
        ...state,
        custList: custListVO.custList,
        custPage,
      };
    },
    getCustIncomeSuccess(state, action) {
      const { payload: { custNumber, monthlyProfits } } = action;
      return {
        ...state,
        monthlyProfits: {
          ...state.monthlyProfits,
          [custNumber]: monthlyProfits,
        },
      };
    },
    // 获取客户分组列表
    getGroupListSuccess(state, action) {
      const { payload: { resultData } } = action;
      const {
        custGroupDTOList, curPageNum, pageSize, totalRecordNum
      } = resultData;
      if (!resultData) {
        return {
          ...state,
          cusgroupList: [],
          cusgroupPage: {
            curPageNum,
            pageSize,
            totalRecordNum,
          },
        };
      }

      return {
        ...state,
        cusgroupList: custGroupDTOList,
        cusgroupPage: {
          curPageNum,
          pageSize,
          totalRecordNum,
        },
        cusGroupSaveResult: '',
      };
    },
    // 保存搜索内容
    saveSearchVal(state, action) {
      const { payload: { searchVal } } = action;
      return {
        ...state,
        searchHistoryVal: searchVal,
      };
    },
    // 添加到现有分组保存成功
    addCusToGroupSuccess(state, action) {
      const { payload: { groupId, result } } = action;
      return {
        ...state,
        resultgroupId: groupId,
        cusGroupSaveResult: result,
      };
    },
    // 客户分组批量导入客户解析客户列表
    queryBatchCustListSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        batchCustList: resultData,
      };
    },
    // 自建任务提交
    createTaskSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        createTaskResult: payload,
      };
    },
    // 自建任务编辑后，重新提交
    updateTaskSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        updateTaskResult: payload,
      };
    },
    // 获取净创收数据成功
    getIncomeDataSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        incomeData: !_.isEmpty(payload) ? payload : [],
      };
    },
    // 获取联系方式成功
    getCustContactSuccess(state, action) {
      const { payload: { resultData, custId } } = action;
      return {
        ...state,
        custContactData: {
          [custId]: resultData,
        },
      };
    },
    // custEmail获取成功
    getCustEmailSuccess(state, action) {
      const { payload: { resultData, custId } } = action;
      return {
        ...state,
        custEmail: {
          [custId]: resultData,
        },
      };
    },
    // 获取服务记录成功
    getServiceRecordSuccess(state, action) {
      const { payload: { resultData, custId, fileResultData } } = action;
      return {
        ...state,
        serviceRecordData: {
          [custId]: resultData,
        },
        filesList: fileResultData,
      };
    },
    addServeRecordSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        currentCommonServiceRecord: { id: payload.resultData },
      };
    },
    resetServeRecord(state) {
      return {
        ...state,
        currentCommonServiceRecord: {},
      };
    },
    // 获取客户分组成功
    getCustomerGroupListSuccess(state, action) {
      const { payload } = action;
      const { custGroupDTOList = EMPTY_LIST, totalRecordNum } = payload;

      return {
        ...state,
        customerGroupList: {
          page: {
            // 后台返回的一直是null，所以不要了
            // curPageNum,
            // pageSize,
            totalRecordNum,
          },
          resultData: custGroupDTOList || EMPTY_LIST,
        },
      };
    },
    // 获取指定分组客户成功
    getGroupCustomerListSuccess(state, action) {
      const { payload } = action;
      const { totalRecordNum, groupCustDTOList = EMPTY_LIST } = payload;

      return {
        ...state,
        groupCustomerList: {
          page: {
            // 后台返回的一直是null，所以不要了
            // curPageNum,
            // pageSize,
            totalRecordNum,
          },
          resultData: groupCustDTOList || EMPTY_LIST,
        },
      };
    },
    // 分组客户下的历史搜索列表
    getCustomerHistoryWdsListSuccess(state, action) {
      const { payload: { history: { resultData: { historyWdsList } } } } = action;
      return {
        ...state,
        customerHistoryWordsList: historyWdsList,
      };
    },
    // 清除分组客户下历史搜索列表
    clearCustomerSearchHistoryListSuccess(state, action) {
      const { payload: { clearHistoryState: { clearState } } } = action;
      return {
        ...state,
        isClearCustomerHistorySuccess: clearState,
      };
    },
    // 分组客户下保存搜索内容
    saveCustomerSearchVal(state, action) {
      const { payload: { searchVal } } = action;
      return {
        ...state,
        customerSearchHistoryVal: searchVal,
      };
    },
    // 分组客户下联想的推荐热词列表
    getCustomerHotPossibleWdsSuccess(state, action) {
      const { payload } = action;
      const { custList } = payload;
      // 构造成联想列表识别的
      const finalPossibleHotCust = _.map(custList, item => ({
        id: item.brokerNumber,
        labelNameVal: item.brokerNumber,
        labelDesc: item.custName,
        ...item,
      }));

      return {
        ...state,
        customerHotPossibleWordsList: finalPossibleHotCust,
      };
    },
    // 新增、编辑分组成功
    operateGroupSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        // success
        operateGroupResult: payload,
        // 成功
        cusGroupSaveResult: payload,
      };
    },
    // 删除分组成功
    deleteGroupSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        // success
        deleteGroupResult: payload,
      };
    },
    // 删除分组下的客户成功
    deleteCustomerFromGroupSuccess(state, action) {
      const { payload: { resultData, custId, groupId } } = action;
      return {
        ...state,
        // success
        // 以groupId和custId来做主键
        deleteCustomerFromGroupResult: {
          [`${groupId}_${custId}`]: resultData,
        },
      };
    },
    // 360服务记录查询成功
    getServiceLogSuccess(state, action) {
      const { payload: { resultData, fileResultData } } = action;
      let responseList = [];
      if (!_.isEmpty(resultData)) {
        responseList = resultData;
      }
      return {
        ...state,
        serviceLogData: resultData,
        serviceLogList: responseList,
        filesList: fileResultData,
        isLastServiceLog: false,
      };
    },
    // 文件下载文件列表
    getCeFileListSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        filesList: resultData,
      };
    },
    getSearchServerPersonListSuccess(state, action) {
      return {
        ...state,
        searchServerPersonList: action.payload,
      };
    },
    // 360服务记录查询更多服务成功, 这里的代码需要修正
    getServiceLogMoreSuccess(state, action) {
      const { payload: { resultData } } = action;
      let responseList = [];
      if (!_.isEmpty(resultData)) {
        responseList = resultData;
      }
      return {
        ...state,
        serviceLogList: _.concat(state.serviceLogList, responseList),
        serviceLogMoreData: resultData,
        isLastServiceLog: _.isEmpty(resultData),
      };
    },
    // 获取客户细分列表成功
    priviewCustFileSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        priviewCustFileData: payload,
      };
    },
    // 存储任务流程数据
    saveTaskFlowData(state, action) {
      const { payload } = action;
      return {
        ...state,
        storedTaskFlowData: payload,
      };
    },
    // 清除任务流程数据
    clearTaskFlowData(state, action) {
      const { payload = {} } = action;
      return {
        ...state,
        storedTaskFlowData: payload,
      };
    },
    // 存储自建任务数据
    saveCreateTaskData(state, action) {
      const { payload } = action;
      return {
        ...state,
        storedCreateTaskData: payload,
      };
    },
    // 清除自建任务数据
    clearCreateTaskData(state, action) {
      const { payload = {} } = action;
      const { storedCreateTaskData } = state;
      storedCreateTaskData[`${payload}`] = {};
      return {
        ...state,
        storedCreateTaskData,
      };
    },
    getCustRangeByAuthoritySuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        serviceDepartment: resultData,
      };
    },
    // 标签圈人成功
    getLabelInfoSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        circlePeopleData: resultData,
      };
    },
    // 获取全部标签信息成功
    getTagListSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        tagList: resultData,
      };
    },
    // 标签圈人-id客户列表查询
    getLabelPeopleSuccess(state, action) {
      const { payload } = action;
      const emptyData = {
        totalCount: 0,
        pageSize: 10,
        beginIndex: 1,
        curPageNum: 1,
        totalPage: 1,
        custList: [],
      };
      return {
        ...state,
        peopleOfLabelData: payload || emptyData,
      };
    },
    // 保存当前选中tab
    saveCurrentTab(state, action) {
      const { payload } = action;
      return {
        ...state,
        currentTab: payload,
      };
    },
    // 保存当前选中的客户选择类型
    saveCurrentEntry(state, action) {
      const { payload } = action;
      return {
        ...state,
        currentEntry: payload,
      };
    },
    // 清除保存的tab
    resetActiveTab(state) {
      return {
        ...state,
        currentTab: '1',
      };
    },
    // 提交任务流程成功
    submitTaskFlowSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        submitTaskFlowResult: payload,
      };
    },
    // 获取审批人列表成功
    getApprovalListSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        approvalList: payload,
      };
    },
    // 清除当前提交结果
    clearSubmitTaskFlowResult(state) {
      return {
        ...state,
        submitTaskFlowResult: '',
      };
    },
    // 获取任务列表-任务详情基本信息成功
    getTaskBasicInfoSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        taskBasicInfo: resultData,
      };
    },
    // 生成问卷模板id成功
    generateTemplateIdSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        templateId: payload,
      };
    },
    // 查询指标数据
    queryIndicatorDataSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        indicatorData: payload,
      };
    },
    // 查询产品列表成功
    queryProductDataSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        productList: payload,
      };
    },
    queryJxGroupProductDataSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        jxGroupProductList: payload,
      };
    },
    clearJxGroupProductData(state, action) {
      const { payload } = action;
      return {
        ...state,
        jxGroupProductList: payload,
      };
    },
    clearProductData(state, action) {
      const { payload } = action;
      return {
        ...state,
        productList: payload,
      };
    },
    clearSearchPersonList(state, action) {
      const { payload } = action;
      return {
        ...state,
        searchServerPersonList: payload,
      };
    },
    // 审批流程获取按钮成功
    getApprovalBtnSuccess(state, action) {
      const { payload: { resultData } } = action;
      return {
        ...state,
        approvalBtn: resultData,
      };
    },
    // 审批按钮提交成功
    submitApprovalSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        submitApporvalResult: payload,
      };
    },
    // 查询客户的数量限制或者是否都是本人名下的客户
    isSendCustsServedByPostnSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        sendCustsServedByPostnResult: payload || {},
      };
    },
    // 查询客户是否都是本人名下的客户
    isCustServedByPostnSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        custServedByPostnResult: payload,
      };
    },
    getFiltersOfSightingTelescopeSuccess(state, action) {
      const { payload: { object } } = action;
      return {
        ...state,
        sightingTelescopeFilters: object || {},
      };
    },
    getFiltersOfSightingTelescopeSequenceSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        allSightingTelescopeFilters: payload,
      };
    },
    // 审批成功更新代办数据
    updateTodoList(state, action) {
      const { flowId } = action;
      // 保存了首次加载时从服务器获取的全部数据和筛选后的数据，都给更新了
      const todolist = _.filter(state.todolist, val => val.flowId !== flowId);
      const todolistRecord = _.filter(state.todolistRecord, val => val.flowId !== flowId);
      return {
        ...state,
        todolist,
        todolistRecord,
      };
    },
    queryHoldingProductSuccess(state, action) {
      const { payload: { prdtHold, custId, resultData } } = action;
      return {
        ...state,
        holdingProducts: {
          ...state.holdingProducts,
          [`${custId}${prdtHold}`]: resultData,
        },
      };
    },
    addCallRecordSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        isAddCallRecordSuccess: payload.success,
      };
    },
    // 获取首页可用客户列表
    queryCustLabelListSuccess(state, action) {
      const { payload } = action;
      return {
        ...state,
        custLabelList: payload,
        pagingCustLabelData: custLabelListPaging({
          list: payload,
          pageNo: INITIAL_CUSTLABEL_PAGENO,
          pageSize: INITIAL_CUSTLABEL_PAGESIZE,
        }),
      };
    },
    // 首页客户客户列表数据分页处理
    custLabelListPaging(state, action) {
      const { payload: { pageNo, pageSize } } = action;
      return {
        ...state,
        pagingCustLabelData: custLabelListPaging({
          list: state.custLabelList,
          pageNo,
          pageSize,
        }),
      };
    },
    queryHoldingSecurityRepetitionSuccess(state, action) {
      const { payload } = action;
      const { holdingSecurityData } = state;
      return {
        ...state,
        holdingSecurityData: {
          ...holdingSecurityData,
          [payload.key]: payload.value,
        },
      };
    },
    queryIndustryListSuccess(state, action) {
      const { payload = EMPTY_LIST } = action;
      return {
        ...state,
        industryList: payload,
      };
    },
    queryHoldingIndustryDetailSuccess(state, action) {
      const { payload: { industryId, custId, resultData } } = action;
      // 在集合里面添加一个industryNameCode，存的是已经组合在一起的name/code，方便页面中展示
      const currentList = _.map(resultData, item => ({
        ...item,
        industryNameCode: `${item.name}/${item.code}`
      }));
      return {
        ...state,
        industryDetail: {
          ...state.industryDetail,
          [`${custId}_${industryId}`]: currentList,
        },
      };
    },
    queryDefinedLabelsInfoSuccess(state, action) {
      const { payload = EMPTY_LIST } = action;
      return {
        ...state,
        definedLabelsInfo: payload,
      };
    },
    // 获取申请列表成功
    getApplyListSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        applyList: resultData,
      };
    },
    // 获取审批列表成功
    getApproveListSuccess(state, action) {
      const { payload: { resultData = {} } } = action;
      return {
        ...state,
        approveList: resultData,
      };
    },
    // 发起人下拉框
    getInitiatorSuccess(state, action) {
      const { payload: { resultData: { empInfo = [] } } } = action;
      return {
        ...state,
        initiator: empInfo,
      };
    }
  },
};

import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';

const EXECUTOR = 'executor'; // 执行者视图
const INITIATOR = 'initiator'; // 创造者视图
const CONTROLLER = 'controller'; // 管理者视图

const SYSTEMCODE = '102330'; // 理财平台系统编号

const STATE_ALL_CODE = 'all'; // 任务状态 为所有状态时的对应的code
const STATE_PROCESSING_CODE = '10'; // 审批中编号
const STATE_REJECT_CODE = '20'; // 驳回编号
const STATE_CLOSE_CODE = '30'; // 终止编号
const STATE_WAITEXECUTE_CODE = '40'; // 等待执行编号
const STATE_EXECUTE_CODE = '50'; // 执行中编号
const STATE_RESULTTRACK_CODE = '60'; // 结果跟踪编号
const STATE_FINISHED_CODE = '70'; // 结束编号
const STATE_COMPLETED_CODE = '80'; // 已完成编号

const STATE_COMPLETED_NAME = '已完成'; // 已完成显示文字

// 降序排序
const SORT_DESC = 'desc';
// 升序排序
const SORT_ASC = 'asc';
// 执行方式
const EXECUTION_MODE = {
  sortType: 'executionModeSort',
  name: '执行方式',
  defaultDirection: SORT_DESC,
};
// 创建时间
const CREATE_TIME = {
  sortType: 'createTimeSort',
  name: '创建时间',
  defaultDirection: SORT_DESC,
};
// 执行者视图中开始时间排序，传给后端的参数和创建时间相同
const START_TIME = {
  sortType: 'createTimeSort',
  name: '开始时间',
  defaultDirection: SORT_DESC,
};
// 结束时间
const END_TIME = {
  sortType: 'endTimeSort',
  name: '结束时间',
  defaultDirection: SORT_ASC,
};
// 排序组件的数据
const SORT_DATA = [EXECUTION_MODE, START_TIME, END_TIME];

// 各个视图默认的排序
const DEFAULTSORT_VIEW = {
  [EXECUTOR]: EXECUTION_MODE,
  [INITIATOR]: CREATE_TIME,
  [CONTROLLER]: END_TIME,
};

// 管理者视图
const STATUS_MANAGER_VIEW = [
  STATE_EXECUTE_CODE,
  STATE_RESULTTRACK_CODE,
  STATE_FINISHED_CODE,
];
// 执行者视图
const STATUS_EXECUTOR_VIEW = [
  STATE_EXECUTE_CODE,
  STATE_RESULTTRACK_CODE,
  STATE_FINISHED_CODE,
  STATE_COMPLETED_CODE,
];

// 视图之间的切换
const chooseMissionView = [
  {
    show: true,
    label: '我执行的任务',
    value: 'executor',
  },
  {
    show: true,
    label: '我部门的任务',
    value: 'controller',
  },
  {
    show: true,
    label: '我创建的任务',
    value: 'initiator',
  },
];

// 添加服务记录时，入参服务状态完成的编号,
const POSTCOMPLETED_CODE = '30';

const currentDate = moment();
const beforeCurrentDate60Days = moment(currentDate).subtract(59, 'days');
const afterCurrentDate60Days = moment(currentDate).add(59, 'days');

// 请求左侧任务列表需要的入参，可能是动态入参的，但是所有需要的入参都在这里配置
const QUERY_PARAMS = [
  // 选择任务视图
  'missionViewType',
  // 登录人工号
  'empId',
  // 机构id
  'orgId',
  // 任务创建者
  'creator',
  // 类型
  'type',
  // 状态
  'status',
  // 创建时间开始点
  'createTimeStart',
  // 创建时间结束点
  'createTimeEnd',
  // 触发时间开始点
  'triggerTimeStart',
  // 触发时间结束点
  'triggerTimeEnd',
  // 结束时间开始点
  'endTimeStart',
  // 结束时间结束点
  'endTimeEnd',
  // 任务名称，支持模糊查询
  'missionName',
  // 经纪客户号
  'custId',
  // 执行类型
  'executeType',
  // 分页条目
  'pageSize',
  // 当前分页
  'pageNum',
  // 服务经理id
  'ptyMngId',
];

// 更多按钮的菜单数据，配置顺序需要与上面的一致
const moreFilterData = [
  {
    value: '客户',
    key: 'custId',
    filterOption: ['custId', 'custName'],
    type: ['executor'],
  },
  {
    value: '创建者',
    key: 'creatorId',
    filterOption: ['creatorId', 'creatorName'],
    type: ['controller', 'executor'],
  },
  {
    value: '触发时间',
    key: 'triggerTime',
    filterOption: ['triggerTimeStart', 'triggerTimeEnd'],
    type: ['controller', 'executor'],
  },
  {
    value: '结束时间',
    key: 'endTime',
    filterOption: ['endTimeStart', 'endTimeEnd'],
    type: ['controller'],
  },
];

// 当左侧列表或fsp中左侧菜单被折叠或者展开时，当前的服务实施列表的pageSize
// 全部都展开时
const SMALL_PAGESIZE = 6;
// FSP左侧菜单折叠放9个
const MEDIUM_PAGESIZE = 9;
// 任务列表折叠起来放10个
const LARGE_PAGESIZE = 10;
// 全部都折叠起来放12个
const EXTRALARGE_PAGESIZE = 12;

// 执行者视图详情中tab的默认项，默认服务实施
const defaultPerformerViewCurrentTab = 'serviceImplementation';

// 服务实施服务状态过滤器默认的状态码
const defaultServiceState = ['10', '20'];

export {
  EXECUTOR,
  INITIATOR,
  CONTROLLER,
  chooseMissionView,
  currentDate,
  beforeCurrentDate60Days,
  afterCurrentDate60Days,
  dateFormat,
  STATE_PROCESSING_CODE,
  STATE_REJECT_CODE,
  STATE_CLOSE_CODE,
  STATE_WAITEXECUTE_CODE,
  STATE_EXECUTE_CODE,
  STATE_RESULTTRACK_CODE,
  STATE_FINISHED_CODE,
  STATE_COMPLETED_CODE,
  STATE_COMPLETED_NAME,
  STATUS_MANAGER_VIEW,
  STATUS_EXECUTOR_VIEW,
  SYSTEMCODE,
  POSTCOMPLETED_CODE,
  STATE_ALL_CODE,
  CREATE_TIME,
  END_TIME,
  QUERY_PARAMS,
  moreFilterData,
  SMALL_PAGESIZE,
  MEDIUM_PAGESIZE,
  LARGE_PAGESIZE,
  EXTRALARGE_PAGESIZE,
  defaultPerformerViewCurrentTab,
  defaultServiceState,
  SORT_DATA,
  SORT_DESC,
  SORT_ASC,
  DEFAULTSORT_VIEW,
};

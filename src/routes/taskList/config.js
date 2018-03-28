import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';

const EXECUTOR = 'executor'; // 执行者视图
const INITIATOR = 'initiator'; // 创造者视图
const CONTROLLER = 'controller'; // 管理者视图

const SYSTEMCODE = '102330'; // 理财平台系统编号

const PROCESSING_STATE = '10'; // 审批中
const REJECT_STATE = '20'; // 驳回
const CLOSE_STATE = '30'; // 终止
const WAITEXECUTE_STATE = '40'; // 等待执行
const EXECUTE_STATE = '50'; // 执行中
const RESULT_TRACK_STATE = '60'; // 结果跟踪
const FINISHED_STATE = '70'; // 结束
const COMPLETED_STATE = '80'; // 已完成
const MANAGER_VIEW_STATUS = [
  EXECUTE_STATE,
  RESULT_TRACK_STATE,
  FINISHED_STATE,
];

const chooseMissionView = [
  {
    show: true,
    label: '我创建的任务',
    value: 'initiator',
  },
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
];

const currentDate = moment(new Date());
const beforeCurrentDate60Days = moment(currentDate).subtract(60, 'days');
const afterCurrentDate60Days = moment(currentDate).add(60, 'days');

export default {
  EXECUTOR,
  INITIATOR,
  CONTROLLER,
  chooseMissionView,
  currentDate,
  beforeCurrentDate60Days,
  afterCurrentDate60Days,
  dateFormat,
  PROCESSING_STATE,
  REJECT_STATE,
  CLOSE_STATE,
  EXECUTE_STATE,
  RESULT_TRACK_STATE,
  WAITEXECUTE_STATE,
  FINISHED_STATE,
  COMPLETED_STATE,
  MANAGER_VIEW_STATUS,
  SYSTEMCODE,
};

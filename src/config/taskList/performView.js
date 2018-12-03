/**
 * @Author: sunweibin
 * @Date: 2018-08-09 10:45:27
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-09-12 12:00:54
 * @description 执行者视图下的相关配置项
 */
import _ from 'lodash';

// MOT 回访类任务类型的 eventId集合
const MOT_RETURN_TASK_EVENT_IDS = ['1000821', '1000822'];
// MOT 回访类型任务回访结果
export const MOT_RETURN_VISIT_WORK_RESULT_SUCCESS = '成功';
export const MOT_RETURN_VISIT_WORK_RESULT_LOST = '失败';

// 由于投顾签约的 MOT 回访类任务对应的 EVENT_ID 值有多个
// 所以需要提供一个函数进行判断是否 MOT 回访类任务
export const isMOTReturnTypeTask = eventId => _.includes(MOT_RETURN_TASK_EVENT_IDS, eventId);

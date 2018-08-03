/*
 * @Description:
 * @Author: WangJunjun
 * @Date: 2018-07-17 15:59:13
 * @Last Modified by: WangJunJun
 * @Last Modified time: 2018-08-02 17:36:50
 */

import { task } from '../config';
import { defaultServiceState } from '../../../../routes/taskList/config';

const EMPTY_LIST = [];

export function getServiceState(code) {
  // 任务状态为 结束 时，服务状态全部选中，否则，默认选中 未开始 和 处理中 两个筛选项
  const state = task.isFinished(code) ? EMPTY_LIST : defaultServiceState;
  return state;
}

export default {};

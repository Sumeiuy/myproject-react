/*
 * @Description:
 * @Author: WangJunjun
 * @Date: 2018-07-17 15:59:13
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-07-17 17:08:51
 */

import _ from 'lodash';
import { task } from '../config';
import { defaultServiceState } from '../../../../routes/taskList/config';


export function getServiceState(code, dict) {
  // 任务状态为 结束 时，服务状态全部选中，否则，默认选中 未开始 和 处理中 两个筛选项
  const serviceState = _.map(dict.serveStatus, item => item.key);
  const state = task.isFinished(code) ? serviceState : defaultServiceState;
  return state;
}

export default {};

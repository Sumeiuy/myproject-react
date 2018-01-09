/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-14 13:26:52
 * @Last Modified by:   xuxiaoqin
 * @Last Modified time: 2017-11-14 13:26:52
 * 校验表单内容
 */

import { Mention, message } from 'antd';
import _ from 'lodash';

const { toString } = Mention;

export default {};

export const validateFormContent = (target, name, descriptor) => {
  const origin = descriptor.value;

  return {
    ...descriptor,
    value(...args) {
      if (_.isEmpty(args)) {
        return false;
      }
      const { templetDesc, executionType, taskType, taskSubType, isFormError } = args[0];
      let isShowErrorInfo = false;
      let isShowErrorExcuteType = false;
      let isShowErrorTaskType = false;
      let isShowErrorTaskSubType = false;
      if (toString(templetDesc).length < 10) {
        isShowErrorInfo = true;
        this.setState({
          isShowErrorInfo: true,
        });
      }
      if (_.isEmpty(executionType) || executionType === '请选择' || executionType === '暂无数据') {
        this.setState({
          isShowErrorExcuteType: true,
        });
        isShowErrorExcuteType = true;
      }
      if (_.isEmpty(taskType) || taskType === '请选择' || taskType === '暂无数据') {
        this.setState({
          isShowErrorTaskType: true,
        });
        isShowErrorTaskType = true;
      }
      if (_.isEmpty(taskSubType) || taskSubType === '请选择' || taskSubType === '暂无数据') {
        this.setState({
          isShowErrorTaskSubType: true,
        });
        isShowErrorTaskSubType = true;
      }
      if (isFormError
        || isShowErrorInfo
        || isShowErrorExcuteType
        || isShowErrorTaskType
        || isShowErrorTaskSubType) {
        message.error('请填写任务基本信息');
        return false;
      }
      origin.apply(this, args);
      return true;
    },
  };
};

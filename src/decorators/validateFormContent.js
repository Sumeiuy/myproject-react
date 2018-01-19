/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-14 13:26:52
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-01-19 17:00:33
 * 校验表单内容
 */

import { message } from 'antd';
import _ from 'lodash';

export default {};

export const validateFormContent = (target, name, descriptor) => {
  const origin = descriptor.value;

  return {
    ...descriptor,
    value(...args) {
      if (_.isEmpty(args)) {
        return false;
      }
      const {
        executionType,
        taskType,
        isFormError,
        taskName,
        timelyIntervalValue,
        serviceStrategySuggestion,
      } = args[0];
      let isShowErrorExcuteType = false;
      let isShowErrorTaskType = false;
      let isShowErrorIntervalValue = false;
      let isShowErrorStrategySuggestion = false;
      let isShowErrorTaskName = false;
      const regxp = /^\+?[1-9][0-9]*$/;
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
      if (!regxp.test(timelyIntervalValue)
        || Number(timelyIntervalValue) <= 0
        || Number(timelyIntervalValue) > 365) {
        this.setState({
          isShowErrorIntervalValue: true,
        });
        isShowErrorIntervalValue = true;
      }
      if (_.isEmpty(taskName)
        || taskName.length > 30) {
        this.setState({
          isShowErrorTaskName: true,
        });
        isShowErrorTaskName = true;
      }
      if (_.isEmpty(serviceStrategySuggestion)
        || serviceStrategySuggestion.length < 10
        || serviceStrategySuggestion.length > 300) {
        this.setState({
          isShowErrorStrategySuggestion: true,
        });
        isShowErrorStrategySuggestion = true;
      }
      if (isFormError
        || isShowErrorIntervalValue
        || isShowErrorStrategySuggestion
        || isShowErrorTaskName
        || isShowErrorExcuteType
        || isShowErrorTaskType) {
        message.error('请填写任务基本信息');
        return false;
      }
      // 校验通过，去掉错误提示
      this.setState({
        isShowErrorTaskSubType: false,
        isShowErrorTaskType: false,
        isShowErrorExcuteType: false,
        isShowErrorIntervalValue: false,
        isShowErrorStrategySuggestion: false,
        isShowErrorTaskName: false,
      });
      origin.apply(this, args);
      return true;
    },
  };
};

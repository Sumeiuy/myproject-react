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
      const { templetDesc, executionType, taskType, isFormError } = args[0];
      let isShowErrorInfo = false;
      let isShowErrorExcuteType = false;
      let isShowErrorTaskType = false;
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
      if (isFormError || isShowErrorInfo || isShowErrorExcuteType || isShowErrorTaskType) {
        message.error('请填写任务基本信息');
        return false;
      }
      origin.apply(this, args);
      return true;
    },
  };
};

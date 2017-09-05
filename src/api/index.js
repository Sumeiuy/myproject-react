import report from './report';
import feedback from './feedback';
import permission from './permission';
import apiCreator from '../utils/apiCreator';

const api = apiCreator();

export default {
  // 暴露api上的几个底层方法: get / post
  ...api,
  report: report(api),
  feedback: feedback(api),
  permission: permission(api),
};

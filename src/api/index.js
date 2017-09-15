import apiCreator from '../utils/apiCreator';
import report from './report';
import feedback from './feedback';

const api = apiCreator();

export default {
  // 暴露api上的几个底层方法: get / post
  ...api,
  report: report(api),
  feedback: feedback(api),
};


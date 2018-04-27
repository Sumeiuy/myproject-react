/**
 * @Description: PC电话拨号页面
 * @Author: maoquan
 * @Date: 2018-04-11 20:22:50
 * @Last Modified by: maoquan@htsc.com
 * @Last Modified time: 2018-04-27 21:23:39
 */

import { connect } from 'dva';
import Phone from './Phone';

const mapStateToProps = state => ({
  config: state.telephoneNumberManage.config,
});

const mapDispatchToProps = {
  getConfig: () => ({
    type: 'telephoneNumberManage/getConfig',
  }),
};

export default connect(mapStateToProps, mapDispatchToProps)(Phone);

/**
 * @Author: sunweibin
 * @Date: 2018-04-13 10:53:23
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-28 11:17:12
 * @description 此处使用dva的connect包装下Home.js
 */
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { dva } from '../../helper';
import generateMapStateToProps from './mapStateToProps';
import generateMapDispatchToProps from './mapDispatchProps';

import Home from './Home';

// 使用helper里面封装的生成effects的方法
const effect = dva.generateEffect;
// 生成mapDispatchToprops
const mapDispatchToProps = generateMapDispatchToProps({ routerRedux, effect });
// 生成mapStateToprops
const mapStateToProps = generateMapStateToProps();

export default connect(mapStateToProps, mapDispatchToProps)(Home);

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import store from 'store';
import { connect } from 'dva';
import { Prompt } from 'dva/router';
import _ from 'lodash';
import { fspRoutes } from '../../../src/config';
import api from '../../../src/api';
import Loading from '../../layouts/Loading';

import styles from './fspComponent.less';

import { os } from '../../../src/helper';

import { BLOCK_JSP_TEST_ELEM, checkJSPValue } from './config';

const mapStateToProps = state => ({
  isBlocking: state.global.isBlocking,
});

const mapDispatchToProps = {};

function findRoute(pathname) {
  return os.findBestMatch(pathname, fspRoutes, 'path');
}

@connect(mapStateToProps, mapDispatchToProps)
export default class FSPComponent extends PureComponent {

  static propTypes = {
    isBlocking: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    const { location: { pathname, search, state } } = props;
    this.getRouteConfig(pathname, search, state);
    this.getFspData({ isinitial: true });
    this.state = {
      loading: true,
    };
    this.timeoutId = setTimeout(() => this.setState({ loading: false }), 1000);
    // 重写eb的closeTab方法，之所以在这里重写，是因为别的地方无法成功覆盖
    window.eb.utils.closeTab = window.closeTabForEB;
  }

  componentDidUpdate(prevProps) {
    const { location: prevLocation } = prevProps;
    const { location: { pathname, search, state = {} } } = this.props;
    const {
      pathname: prevPathname,
      search: prevSearch,
      state: prevState = {},
    } = prevLocation;

    if (
      pathname !== prevPathname ||
      search !== prevSearch ||
      state.url !== prevState.url
    ) {
      this.getRouteConfig(pathname, search, state);
      this.getFspData({ isinitial: false });
      this.timeoutId = setTimeout(() => this.setState({ loading: false }), 1000);
    }
  }

  componentWillUnmount() {
    return this.timeoutId && clearTimeout(this.timeoutId);
  }

  @autobind
  onLoad() {
    this.setState({
      loading: false,
    });
  }

  @autobind
  getRouteConfig(pathname, search, state) {
    const routeConfig = findRoute(pathname);
    if (search && _.isString(routeConfig.url)) {
      routeConfig.url = routeConfig.url.replace(/\?.*/, search);
    }
    const localUrl = store.get(pathname);
    this.url = !localUrl ? routeConfig.url : localUrl;
    this.action = routeConfig.action;
    // 设置fsp页面容器的id，这个属性因为fsp原因，暂时需要
    this.containerId = routeConfig.containerId;
    // 修正后端接口，因为有些接口为动态接口
    if (state && state.url) {
      this.url = state.url;
      store.set(pathname, state.url);
    }
  }

  @autobind
  getFspData({ isinitial }) {
    // 如果请求的是html文档
    if (this.action === 'loadInTab') {
      if (!isinitial) {
        this.setState({
          loading: true,
        });
      }
      // 请求html数据并进行插入
      api
        .getFspData(this.url)
        .then((data) => {
          // 这里之所以使用juery来处理，是因为浏览器在识别innerHTML嵌套插入script元素时，不能正确识别
          // 所以使用juery方法提前将字符串处理为node元素
          const node = $(data);

          // 由于上面获取的node元素可能为数组，原生DOM插入方法不支持直接插入多个node元素
          // 所以这里同样借助juery的方法
          const jqelem = $(this.elem);
          jqelem.empty();
          jqelem.attr('id', this.containerId);
          jqelem.append(node);
          this.setState({
            loading: false,
          });
        });
    } else {
      new Promise((resolve, reject) => {
        setTimeout(function () {
          resolve();
        }, 0);
      }).then(() => {
        this.setState({
          loading: !this.state.loading,
        });
      });
    }
  }

  // 跳转前确认处理
  @autobind
  handlePrompt(location) {
    const { location: { pathname } } = this.props;
    const testSuit = _.find(BLOCK_JSP_TEST_ELEM, item => item.pathname === pathname);
    if (testSuit) {
      if (checkJSPValue(testSuit.test)) {
        return true;
      }
      return '当前表单内容不会保存, 请确认是否离开当前页面';
    } else if (window.shouldNotBlock) {
      window.shouldNotBlock = false;
      return true;
    }
    if (location.pathname === pathname) {
      return false;
    }
    return '当前表单内容不会保存, 请确认是否离开当前页面';
  }

  render() {
    return (
      <div className={styles.fspContainer}>
        <Loading loading={this.state.loading} />
        {
          this.action === 'loadInTab' ?
            <div className={styles.fspContent} ref={ref => this.elem = ref} /> :
            <iframe title={this.url} className={styles.iframe} onLoad={this.onLoad} src={this.url} frameBorder="0">
              你的浏览器不支持iframe,请升级或者更换浏览器
            </iframe>
        }
        <Prompt
          when={this.props.isBlocking}
          message={this.handlePrompt}
        />
      </div>
    );
  }
}

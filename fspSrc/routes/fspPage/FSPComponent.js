import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import store from 'store';
import { Prompt } from 'dva/router';
import _ from 'lodash';
import { fspRoutes } from '../../../src/config';
import api from '../../../src/api';
import Loading from '../../layouts/Loading';

import styles from './fspComponent.less';

import { os } from '../../../src/helper';

import { BLOCK_JSP_TEST_ELEM, checkJSPValue } from './config';

function findRoute(pathname) {
  return os.findBestMatch(pathname, fspRoutes, 'path');
}

export default class FSPComponent extends PureComponent {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    const { location: { pathname, state } } = props;
    this.getRouteConfig(pathname, state);
    this.getFspData({ isinitial: true });
    this.state = {
      loading: true,
      isBlocking: false,
    };
    this.timeoutId = setTimeout(() => this.setState({ loading: false }), 10000);
  }

  componentDidMount() {
    const { router } = this.context;
    this.historyListen = router.history.listen(({ pathname }) => {
      if (_.find(BLOCK_JSP_TEST_ELEM, item => item.pathname === pathname)) {
        this.setState({
          isBlocking: true,
        });
      }
    });
  }

  componentDidUpdate(prevProps) {
    const { location: { pathname, state } } = prevProps;
    const { location } = this.props;
    if (location.pathname !== pathname || location.state !== state) {
      this.getRouteConfig(location.pathname, location.state);
      this.getFspData({ isinitial: false });
      this.timeoutId = setTimeout(() => this.setState({ loading: false }), 10000);
    }
  }

  componentWillUnmount() {
    if (this.historyListen) {
      this.historyListen();
    }
    return this.timeoutId && clearTimeout(this.timeoutId);
  }

  @autobind
  onLoad() {
    this.setState({
      loading: false,
    });
  }

  @autobind
  getRouteConfig(pathname, state) {
    const routeConfig = findRoute(pathname);
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
            <iframe className={styles.iframe} onLoad={this.onLoad} src={this.url} frameBorder="0">
              你的浏览器不支持iframe,请升级或者更换浏览器
            </iframe>
        }
        <Prompt
          when={this.state.isBlocking}
          message={this.handlePrompt}
        />
      </div>
    );
  }
}

FSPComponent.propTypes = {
  location: PropTypes.object.isRequired,
};

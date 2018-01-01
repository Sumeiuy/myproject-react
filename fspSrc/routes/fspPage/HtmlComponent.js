import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { fspRoutes } from '../../../src/config';
import api from '../../../src/api';

import Loading from '../../layouts/Loading';

export default class HtmlComponent extends PureComponent {
  constructor(props) {
    super(props);
    const { location: { pathname, state } } = props;
    let { url } = _.find(fspRoutes, obj => pathname.indexOf(obj.path) !== -1);
    if (state && state.url) {
      url = state.url;
    }
    this.state = {
      loading: true,
    };

    // 请求html数据并进行插入
    api
      .getFspData(url)
      .then((data) => {
        // 这里之所以使用juery来处理，是因为浏览器在识别innerHTML嵌套插入script元素时，不能正确识别
        // 所以使用juery方法提前将字符串处理为node元素
        const node = $(data);

        // 由于上面获取的node元素可能为数组，原生DOM插入方法不支持直接插入多个node元素
        // 所以这里同样借助juery的方案
        const elem = $(this.elem);
        elem.append(node);
        this.setState({
          loading: false,
        });
      });
  }

  render() {
    return (
      <div>
        <Loading loading={this.state.loading} />
        <div ref={ref => this.elem = ref} />
      </div>
    );
  }
}

HtmlComponent.propTypes = {
  location: PropTypes.object.isRequired,
};


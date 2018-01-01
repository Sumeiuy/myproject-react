// 由于内联式脚本无法成功运行，这里的代码经过重写
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { fspRoutes } from '../../../src/config';
import Loading from '../../layouts/Loading';

export default class IframeComponent extends PureComponent {
  constructor(props) {
    super(props);
    const { location: { pathname, state } } = props;
    let { url } = _.find(fspRoutes, obj => pathname.indexOf(obj.path) !== -1);
    if (state && state.url) {
      url = state.url;
    }
    this.url = url;
    this.state = {
      loading: true,
    };
  }

  @autobind
  onLoad() {
    this.setState({
      loading: false,
    });
  }

  render() {
    return (
      <div>
        <Loading loading={this.state.loading} />
        <iframe onLoad={this.onload} src={this.url} frameBorder="0">
          你的浏览器不支持iframe,请升级或者更换浏览器
        </iframe>
      </div>
    );
  }
}

IframeComponent.propTypes = {
  location: PropTypes.object.isRequired,
};


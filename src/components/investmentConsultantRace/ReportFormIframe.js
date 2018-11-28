/*
 * @Author: WangJunjun
 * @Date: 2018-05-08 18:03:14
 * @Last Modified by: maoquan@htsc.com
 * @Last Modified time: 2018-05-18 20:09:06
 *
 * src：文件的路径；
 * name:框架的名字，用来进行识别。
 * width、height："内部框架"区域的宽与高；
 *
 * reportlet: 本参数为报表访问链接，由报表中心提供。
 * platform: 为该系统对接用户， 由报表中心提供指定。
 * userLogin: 为对应平台的登录用户，由对应系统平台进行设置并传给报表中心。
 * key: 固定值，由报表中心提供。
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import md5 from 'md5';
import { emp, url } from '../../helper';

export default class ReportFormIframe extends React.Component {

  constructor(props) {
    super(props);
    this.state = { height: props.height };
  }

  componentDidMount() {
    this.setIframeHeight();
    window.addEventListener('resize', this.setIframeHeight);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setIframeHeight);
  }

  /**
   * 设置iframe的高度
   */
  @autobind
  setIframeHeight() {
    if (this.props.height === 'auto') {
      const iframeNodeRect = this.iframeNode.getBoundingClientRect();
      const browerHeight = document.body.offsetHeight || document.documentElement.offsetHeight;
      this.setState({ height: browerHeight - iframeNodeRect.top });
    }
  }

  render() {
    const {
      name,
      src,
      width,
      reportlet,
      platform,
      userLogin,
      key,
    } = this.props;
    const { height } = this.state;
    const timestamp = parseInt(Date.now() / 28800000, 10);
    const sign = md5(`${reportlet}${platform}${userLogin}${timestamp}${key}`);
    const query = {
      reportlet,
      userId: emp.getId(),
      platform,
      userLogin,
      sign,
    };
    const srcUrl = `${src}?${url.stringify(query)}`;
    const iframeProps = _.omit(this.props, 'userLogin');
    return (
      <iframe
        {...iframeProps}
        ref={ref => this.iframeNode = ref}
        name={name}
        src={srcUrl}
        width={width}
        height={height}
        title="reportFormIframe"
      />
    );
  }
}

ReportFormIframe.propTypes = {
  name: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  reportlet: PropTypes.string,
  platform: PropTypes.string,
  userLogin: PropTypes.string,
  key: PropTypes.string,
};

ReportFormIframe.defaultProps = {
  width: '100%',
  height: 'auto',
  reportlet: 'FSP/tgjs.cpt',
  platform: 'FSP',
  userLogin: 'FSP',
  key: '6f8cda41e3ce45318c4bad855f2abb37',
};

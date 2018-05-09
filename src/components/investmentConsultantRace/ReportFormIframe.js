/*
 * @Author: WangJunjun
 * @Date: 2018-05-08 18:03:14
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-05-09 14:14:38
 *
 * src：文件的路径；
 * name:框架的名字，用来进行识别。
 * width、height："内部框架"区域的宽与高；
 * scrolling:当SRC的指定的HTML文件在指定的区域不显不完时，滚动选项，如果设置为no，则不出现滚动条；如为 auto：则自动出现滚动条；如为yes，则显示;
 * frameBorder：区域边框的宽度，为了让“内部框架“与邻近的内容相融合，常设置为0。
 * align: [ top | middle | bottom | left | right ] 对齐方式
 * marginwidth=Pixels 左右空出宽度
 * marginheight=Pixels 上下空出的高度
 * longdesc: uri描述
 * border：指定浮动帧边框的厚度，取值为正整数和0，单位为像素。为了将浮动帧与页面无缝结合，border一般等于0
 * frameborder 是否显示边框（0无边框 1有边框）
 *
 * reportlet: 本参数为报表访问链接，由报表中心提供。
 * platform: 为该系统对接用户， 由报表中心提供指定。
 * userLogin: 为对应平台的登录用户，由对应系统平台进行设置并传给报表中心。
 * key: 固定值，由报表中心提供。
 */

import React from 'react';
import PropTypes from 'prop-types';
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

  componentWillUnMount() {
    window.removeEventListener('resize', this.setIframeHeight);
  }

  /**
   * 设置iframe的高度
   */
  @autobind
  setIframeHeight() {
    if (this.props.height === 'restHeight') {
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
      align,
      scrolling,
      marginWidth,
      marginHeight,
      longdesc,
      border,
      frameBorder,
      reportlet,
      platform,
      userLogin,
      key,
    } = this.props;
    const { height } = this.state;
    const sign = md5(`${reportlet}${platform}${userLogin}${Date.now() / 28800000}${key}`);
    const query = {
      reportlet,
      userId: emp.getId(),
      platform,
      userLogin,
      sign,
    };
    const srcUrl = `${src}?${url.stringify(query)}`;
    return (
      <iframe
        ref={ref => this.iframeNode = ref}
        name={name}
        src={srcUrl}
        width={width}
        height={height}
        align={align}
        scrolling={scrolling}
        marginWidth={marginWidth}
        marginHeight={marginHeight}
        longdesc={longdesc}
        border={border}
        frameBorder={frameBorder}
      />
    );
  }
}

ReportFormIframe.propTypes = {
  name: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  align: PropTypes.string,
  scrolling: PropTypes.string,
  marginWidth: PropTypes.string,
  marginHeight: PropTypes.string,
  longdesc: PropTypes.string,
  border: PropTypes.string,
  frameBorder: PropTypes.string,
  reportlet: PropTypes.string,
  platform: PropTypes.string,
  userLogin: PropTypes.string,
  key: PropTypes.string,
};

ReportFormIframe.defaultProps = {
  width: '100%',
  height: 'restHeight',
  align: 'top',
  scrolling: 'auto',
  marginWidth: '0',
  marginHeight: '0',
  longdesc: '',
  border: '0',
  frameBorder: '0',
  reportlet: 'bap/tgjs.cpt',
  platform: 'FSP',
  userLogin: 'FSP',
  key: '6f8cda41e3ce45318c4bad855f2abb37',
};

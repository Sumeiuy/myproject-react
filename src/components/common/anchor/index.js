/* eslint-disable */
/** 搬运至antd/Anchor,解决导航时改变hash的问题,所以不做代码检查 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import AnchorLink from 'antd/lib/anchor/AnchorLink';
import { Affix } from 'antd';
import { fspContainer } from '../../../config';

const fsp = document.querySelector(fspContainer.container);
import AnchorHelper, { getDefaultTarget } from './anchorHelper';
import './index.less';

export default class Anchor extends PureComponent {

  static Link = AnchorLink

  static propTypes = {
    target: PropTypes.element,
    prefixCls: PropTypes.string,
    offsetTop: PropTypes.number,
    bounds: PropTypes.number,
    className: PropTypes.string,
    affix: PropTypes.bool,
    showInkInFixed: PropTypes.bool,
  }

  static defaultProps = {
    prefixCls: 'ant-anchor',
    affix: true,
    showInkInFixed: false,
  };

  static childContextTypes = {
    anchorHelper: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeAnchor: null,
      animated: true,
    };
    this.anchorHelper = new AnchorHelper();
  }

  handleScroll = () => {
    this.setState({
      activeAnchor: this.anchorHelper.getCurrentAnchor(this.props.offsetTop, this.props.bounds),
    });
  }

  getChildContext() {
    return {
      anchorHelper: this.anchorHelper,
    };
  }

  componentDidMount() {
    this.handleScroll();
    this.updateInk();
    // 搬了antd/Anchor判断是否在fsp中，控制scroll
    if (fsp) {
      this.scrollEvent = $(fsp).on('scroll', this.handleScroll);
    } else {
      this.scrollEvent = addEventListener((this.props.target || getDefaultTarget)(), 'scroll', this.handleScroll);
    }
    
  }

  componentWillUnmount() {
    if (this.scrollEvent) {
      this.scrollEvent.remove();
    }
  }

  componentDidUpdate() {
    if (!this._avoidInk) {
      this.updateInk();
    }
  }

  updateInk = () => {
    const activeAnchor = this.anchorHelper.getCurrentActiveAnchor();
    if (activeAnchor) {
      this.refs.ink.style.top = `${activeAnchor.offsetTop + activeAnchor.clientHeight / 2 - 4.5}px`;
    }
  }

  clickAnchorLink = (href, component) => {
    this._avoidInk = true;
    this.refs.ink.style.top = `${component.offsetTop + component.clientHeight / 2 - 4.5}px`;
    this.anchorHelper.scrollTo(href, this.props.offsetTop, getDefaultTarget, () => {
      this._avoidInk = false;
    });
  }

  renderAnchorLink = (child) => {
    const { href } = child.props;
    const { type } = child;
    if (type.__ANT_ANCHOR_LINK && href) {
      this.anchorHelper.addLink(href);
      return React.cloneElement(child, {
        onClick: this.clickAnchorLink,
        prefixCls: this.props.prefixCls,
        bounds: this.props.bounds,
        affix: this.props.affix || this.props.showInkInFixed,
        offsetTop: this.props.offsetTop,
      });
    }
    return child;
  }

  render() {
    const { prefixCls, offsetTop, style, className = '', affix, showInkInFixed } = this.props;
    const { activeAnchor, animated } = this.state;
    const inkClass = classNames({
      [`${prefixCls}-ink-ball`]: true,
      animated,
      visible: !!activeAnchor,
    });

    const wrapperClass = classNames({
      [`${prefixCls}-wrapper`]: true,
    }, className);

    const anchorClass = classNames(prefixCls, {
      'fixed': !affix && !showInkInFixed,
    });

    const anchorContent = (
      <div className={wrapperClass} style={style}>
        <div className={anchorClass}>
          <div className={`${prefixCls}-ink`} >
            <span className={inkClass} ref="ink" />
          </div>
          {React.Children.toArray(this.props.children).map(this.renderAnchorLink)}
        </div>
      </div>
    );

    return !affix ? anchorContent : (
      <Affix offsetTop={offsetTop}>
        {anchorContent}
      </Affix>
    );
  }
}

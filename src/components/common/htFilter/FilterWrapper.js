/**
 * @file test/List.js
 * @author maoquan(maoquan@htsc.com)
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Dropdown, Button, Menu } from 'antd';
import _ from 'lodash';
import styles from './filterWrapper.less';

function getContentShowOnButton(filterValue) {
  if (_.isArray(filterValue)) {
    return filterValue.join('，');
  }
  return filterValue;
}

export default class FilterWrapper extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    filterName: PropTypes.string.isRequired, // 过滤器的显示名称
    filterValue: // 过滤器的当前显示值数组，支持多选
      PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.element]).isRequired,
    MenuComponent: PropTypes.func.isRequired, // 过滤器菜单内部的组件
    MenuProps: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    dropdownStyle: PropTypes.object,
    isAlwaysVisible: PropTypes.bool,
    isCloseable: PropTypes.bool,
    isMoreButton: PropTypes.bool,
    defaultVisible: PropTypes.bool,
    disabled: PropTypes.bool,
    isFormFilter: PropTypes.bool,
  }


  static defaultProps = {
    className: '',
    isAlwaysVisible: false,
    isCloseable: false,
    isMoreButton: false,
    defaultVisible: false,
    disabled: false,
    onClose: () => {},
    dropdownStyle: { maxHeight: 324, overflowY: 'auto', zIndex: 1 },
    isFormFilter: false,
  }

  state = {
    visible: this.props.defaultVisible,
    hidden: false,
    isError: false,
  }

  componentDidMount() {
    if (this.elem) {
      this.elem.addEventListener('mousewheel', this.handleMousewheel);
      this.elem.addEventListener('DOMMouseScroll', this.handleMousewheel);
    }
  }

  componentWillUnmount() {
    if (this.elem) {
      this.elem.removeEventListener('mousewheel', this.handleMousewheel);
      this.elem.removeEventListener('DOMMouseScroll', this.handleMousewheel);
    }
  }

  getPopupContainer = () => this.elem

  handleMousewheel(e) {
    if (e.stopPropagation) {
      e.stopPropagation(); // 阻止滚轮滚动事件冒泡，不触发fsp的自定义滚动条
    }
    if (e.cancelBubble) {
      e.cancelBubble = true;
    }
    // console.log('.....................', e);
  }
  handleMenuClick = () => {
    this.setState({ visible: false });
  }

  handleVisibleChange = (flag) => {
    this.setState({ visible: flag });
  }

  handleClickClose = () => {
    this.setState({ hidden: true });
    this.props.onClose();
  }

  handlMenuInvisible = () => {
    this.setState({ visible: false });
  }

  handlMenuVisible = () => {
    this.setState({ visible: true });
  }

  // 扩展传给内部MenuComponent的onChange方法
  handleMenuChange = (value, options = {}) => {
    const { onChange } = this.props.MenuProps;
    if (onChange) {
      if (options.isUnValid) {
        this.setState({
          isError: true,
        });
      } else {
        this.setState({
          isError: false,
        });
        onChange(value);
      }

      if (options.inVisible) {
        this.handlMenuInvisible();
      }
    }
  }


  render() {
    const {
      visible,
    } = this.state;

    const contentShowOnButton = getContentShowOnButton(this.props.filterValue);

    const { onChange, ...restProps } = this.props.MenuProps;

    const menu = (
      <Menu
        className={styles.menu}
        style={this.props.dropdownStyle}
        onClick={this.props.isAlwaysVisible ? null : this.handleMenuClick}
      >
        <Menu.Item>
          <this.props.MenuComponent
            {...restProps}
            onChange={this.handleMenuChange}
            handlMenuVisible={this.handlMenuVisible}
          />
        </Menu.Item>
      </Menu>
    );

    const filterContainerClasses = classNames({
      [styles.filterContainer]: true,
      [this.props.className]: true,
      [styles.hidden]: this.state.hidden,
    });

    const labelCls = classNames({
      [styles.errorIcon]: true,
      [styles.show]: this.state.isError,
      'ht-iconfont ht-icon-jinggao1': true,
    });

    const menuCls = classNames({
      [styles.menuContainer]: true,
      [styles.moreMenuContainer]: this.props.isMoreButton,
    });

    return (
      <div className={filterContainerClasses}>
        <Dropdown
          overlay={menu}
          trigger={['click']}
          getPopupContainer={this.getPopupContainer}
          visible={visible}
          onVisibleChange={this.handleVisibleChange}
          placement="bottomLeft"
        >
          <div className={styles.filterWrapper}>
            <Button aria-expanded={this.state.visible} disabled={this.props.disabled}>
              {
                this.props.isFormFilter ?
                  <div className={styles.contentShowOnButton}>
                    {this.props.filterValue}
                  </div> :
                  <div className={styles.contentShowOnButton}>
                    <span><i className={labelCls} />{this.props.filterName}{this.props.isMoreButton ? '' : ':'}</span>
                    <span
                      className={styles.valueShowOnButton}
                      title={contentShowOnButton}
                    >
                      {contentShowOnButton}
                    </span>
                  </div>
              }
              <div className={`${styles.downIcon} ht-svg-xiangxia`} />
            </Button>
            <div
              style={this.props.isCloseable ? {} : { display: 'none' }}
              className={`${styles.closeIcon} ht-iconfont ht-icon-guanbi1`}
              onClick={this.handleClickClose}
            />
            <div className={menuCls} ref={ref => this.elem = ref} />
          </div>
        </Dropdown>
      </div>
    );
  }
}

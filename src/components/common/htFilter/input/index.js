import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import styles from './input.less';

export default class HtInput extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    onChange: () => {},
  }

  state = {
    inputValue: '',
    isShowCloseIcon: false,
  }

  handleInputChange = (e) => {
    if (e.target.value) {
      this.setState({
        inputValue: e.target.value,
        isShowCloseIcon: true,
      });
    } else {
      this.setState({
        inputValue: '',
        isShowCloseIcon: false,
      });
    }
    this.props.onChange(e.target.value);
  }

  handleClickIcon = () => {
    this.setState({
      inputValue: '',
      isShowCloseIcon: false,
    });
  }

  render() {
    const { className, ...restProps } = this.props;
    return (
      <div className={`${styles.input} ${className}`}>
        <Input
          value={this.state.inputValue}
          {...restProps}
          onChange={this.handleInputChange}
        />
        {this.state.isShowCloseIcon ?
          <span
            className={`${styles.closeIcon} ht-iconfont ht-icon-guanbi1`}
            onClick={this.handleClickIcon}
          /> :
          <span className={`${styles.searchIcon} ht-iconfont ht-icon-sousuo`} />
        }
      </div>
    );
  }
}


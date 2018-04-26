/**
 * @Description: PC电话拨号页面
 * @Author: hongguangqing
 * @Date: 2018-04-11 20:22:50
 * @Last Modified by: maoquan@htsc.com
 * @Last Modified time: 2018-04-26 12:39:39
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';

import Phone from '../../components/common/phone';
import withRouter from '../../decorators/withRouter';

const mapStateToProps = () => ({

});

const mapDispatchToProps = {
  togglePhoneDialog: query => ({
    type: 'app/togglePhoneDialog',
    payload: query || false,
  }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class PhoneHome extends PureComponent {
  static propTypes = {
    togglePhoneDialog: PropTypes.func.isRequired,
  }

  @autobind
  handleClick() {

  }

  @autobind
  handleEnd(data) {
    console.log('Home:', '电话挂断', data);
  }

  render() {
    return (
      <Phone
        onClick={this.handleClick}
        onEnd={this.handleEnd}
        number="18905163020"
        custType="per"
      />
    );
  }
}

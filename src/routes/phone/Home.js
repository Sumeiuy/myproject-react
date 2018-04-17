/**
 * @Description: PC电话拨号页面
 * @Author: hongguangqing
 * @Date: 2018-04-11 20:22:50
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-04-16 21:32:31
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
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

  render() {
    const { togglePhoneDialog } = this.props;
    return (
      <div>
        <Phone
          onTogglePhoneDialog={togglePhoneDialog}
          phoneNum="17766097715"
          custType="per"
        />
      </div>
    );
  }
}

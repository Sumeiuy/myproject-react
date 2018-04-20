/**
 * @Description: PC电话拨号弹框
 * @Author: hongguangqing
 * @Date: 2018-04-11 20:22:50
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-04-16 21:06:02
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import styles from './index.less';

export default class PhoneDialog extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    phoneNum: PropTypes.string.isRequired,
    custType: PropTypes.string.isRequired,
    onTogglePhoneDialog: PropTypes.func.isRequired,
  }

  // 点击叉号关闭拨打电话的弹框方法来关闭弹框
  @autobind
  closePhoneDialog() {
    this.props.onTogglePhoneDialog(false);
  }

  render() {
    const { visible, phoneNum, custType } = this.props;
    const srcUrl = `https://crm.htsc.com.cn:2443/phone/index.html?phoneNum=${phoneNum}&custType=${custType}&auto=${visible}`;
    const rawHTML = {
      __html: `<iframe src=${srcUrl} width="300" height="400" scrolling="no" frameBorder="0" allow="microphone" />`,
    };
    return (
      <div>
        {
          visible ?
            <div className={styles.phoneDialogBox} >
              <div dangerouslySetInnerHTML={rawHTML} />
              <div className={styles.closeIcon} onClick={this.closePhoneDialog}>×</div>
            </div>
            :
            null
        }
      </div>
    );
  }
}

/*
 * @Author: zhangjun
 * @description 首页推荐弹窗
 * @Date: 2018-08-14 20:58:45
 * @Last Modified by: maoquan@htsc.com
 * @Last Modified time: 2018-09-08 13:50:04
 */
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import store from 'store';

import logable from '../../decorators/logable';
import { permission } from '../../helper';
import CommonModal from '../common/biz/CommonModal';
import RecommendList from './RecommendList';
import { FUNCTION_INTRODUCTION_PAGE, FIRST_ENTER_HOMEPAGE } from './config';
import styles from './recommendModal.less';

export default class recommendModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  componentDidMount() {
    // 第一次渲染完判断是否是第一次进入首页,第一次进入显示弹窗推荐
    this.setVisible();
  }

  // 判断是否是第一次进入首页
  @autobind
  setVisible() {
    const firstEnterHomePage = store.get(FIRST_ENTER_HOMEPAGE);
    if (!firstEnterHomePage && permission.isGrayFlag()) {
      this.setState({ modalVisible: true });
      store.set(FIRST_ENTER_HOMEPAGE, 'NO');
    }
  }

  @autobind
  closeModal() {
    this.setState({ modalVisible: false });
  }

  // 打开新功能介绍页面
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '了解更多',
    },
  })
  toFunctionIntroductionPage() {
    window.open(FUNCTION_INTRODUCTION_PAGE);
  }
  render() {
    const { modalVisible } = this.state;
    return (
      <CommonModal
        title="理财服务平台V3.3功能发布"
        modalKey="recommendModal"
        closeModal={this.closeModal}
        wrapClassName={styles.recommendModal}
        needBtn={false}
        visible={modalVisible}
        maskClosable={false}
      >
        <RecommendList />
        <div className={styles.learnMoreButton} onClick={this.toFunctionIntroductionPage}>
          了解更多
        </div>
      </CommonModal>
    );
  }
}

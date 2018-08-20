/*
 * @Author: zhangjun
 * @description 首页推荐弹窗
 * @Date: 2018-08-14 20:58:45
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-08-17 15:38:32
 */
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';

import logable from '../../decorators/logable';
import CommonModal from '../common/biz/CommonModal';
import RecommendList from './RecommendList';
import { FUNCTION_INTRODUCTION_PAGE } from './config';
import styles from './recommendModal.less';

export default class recommendModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
    };
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
        title="理财服务平台更新日志（9/1）"
        modalKey="recommendModal"
        closeModal={this.closeModal}
        wrapClassName={styles.recommendModal}
        needBtn={false}
        visible={modalVisible}
      >
        <RecommendList />
        <div className={styles.learnMoreButton} onClick={this.toFunctionIntroductionPage}>
          了解更多
        </div>
      </CommonModal>
    );
  }
}

/*
 * @Author: zhangjun
 * @description 首页推荐弹窗
 * @Date: 2018-08-14 20:58:45
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-08-17 14:35:47
 */
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import logable from '../../decorators/logable';
import CommonModal from '../common/biz/CommonModal';
import Icon from '../common/Icon';
import styles from './recommendModal.less';
import { NEWVERSIONTITLE, NEWVERSIONDESCRIBE, TASKTITLE, TASKDESCRIBE } from './config';

export default class recommendModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
      recommendList: [{
        key: 0,
        type: 'shangxian',
        title: NEWVERSIONTITLE,
        describe: NEWVERSIONDESCRIBE,
      }, {
        key: 1,
        type: 'piliangfenxiang',
        title: TASKTITLE,
        describe: TASKDESCRIBE,
      }],
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
    window.open('/fspa/spy/functionIntroduction/html/functionIntroductionV3.1.180802.html');
  }
  render() {
    const { modalVisible, recommendList } = this.state;
    const recommendListData = _.map(recommendList, item => (
      <div className={styles.recommendItem} key={item.key}>
        <Icon type={item.type} className={styles.icon} />
        <div className={styles.recommendContent}>
          <span className={styles.recommendTitle}>{item.title}</span>
          <p className={styles.recommendDesc}>{item.describe}</p>
        </div>
      </div>
    ));
    return (
      modalVisible ? (
        <CommonModal
          title="理财服务平台更新日志（8/18）"
          modalKey="recommendModal"
          closeModal={this.closeModal}
          wrapClassName={styles.recommendModal}
          footer={null}
          visible
        >
          <div className={styles.recommendList}>
            {recommendListData}
          </div>
          <div className={styles.learnMoreButton} onClick={this.toFunctionIntroductionPage}>
            了解更多
          </div>
        </CommonModal>
      ) : null
    );
  }
}

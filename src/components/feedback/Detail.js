/**
 * @file components/feedback/Home.js
 *  问题反馈
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import { Row, Col, Modal } from 'antd';
import ProblemHandling from './ProblemHandling';
import styles from './detail.less';

export default class FeedBack extends PureComponent {
  state = {
    ModalText: 'Content of the modal',
    visible: false,
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    this.setState({
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  }
  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  }
  render() {
    const { visible, confirmLoading } = this.state;
    console.log('--------', visible);
    return (
      <div className={styles.detail_box}>
        <h1 className={styles.bugtitle}>【问题】FSP/100001</h1>
        <Row>
          <Col span="10">
            <div className={styles.imgbox}>
              <img src="" alt="" />
            </div>
          </Col>
          <Col span="14">
            <div id={styles.detail_module} className={styles.module}>
              <div className={styles.mod_header}>
                <h2 className={styles.toogle_title}>问题详情</h2>
              </div>
              <div className={styles.mod_content}>
                <ul className={styles.property_list}>
                  <li className={styles.item}>
                    <div className={styles.wrap}>
                      <strong className={styles.name}>模块：</strong>
                      <span className={styles.value}>任务中心</span>
                    </div>
                  </li>
                  <li className={styles.item}>
                    <div className={styles.wrap}>
                      <strong className={styles.name}>反馈时间：</strong>
                      <span className={styles.value}>2017/03/23</span>
                    </div>
                  </li>
                  <li className={styles.item}>
                    <div className={styles.wrap}>
                      <strong className={styles.name}>系统版本号：</strong>
                      <span className={styles.value}>1.0.0</span>
                    </div>
                  </li>
                  <li className={styles.item}>
                    <div className={styles.wrap}>
                      <strong className={styles.name}>状态：</strong>
                      <span className={styles.value}>解决中</span>
                    </div>
                  </li>
                  <li className={styles.item}>
                    <div className={styles.wrap}>
                      <strong className={styles.name}>问题类型：</strong>
                      <span className={styles.value}>无</span>
                    </div>
                  </li>
                  <li className={styles.item}>
                    <div className={styles.wrap}>
                      <strong className={styles.name}>处理方法：</strong>
                      <span className={styles.value}>无</span>
                    </div>
                  </li>
                  <li className={styles.item}>
                    <div className={styles.wrap}>
                      <strong className={styles.name}>经办人：</strong>
                      <span className={styles.value}>赵云龙</span>
                    </div>
                  </li>
                  <li className={styles.item}>
                    <div className={styles.wrap}>
                      <strong className={styles.name}>Jira编号：</strong>
                      <span className={styles.value}>无</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div id={styles.descriptionmodule} className={styles.module}>
              <div className={styles.mod_header}>
                <h2 className={styles.toogle_title}>描述</h2>
              </div>
              <div className={styles.mod_content}>
                <div className={styles.des_txt}>
                  最好能看到流失客户的信息，方便及时维护流失客户信息，最好能看到流失客户的信息，方便及时维护流失客户信息，最好能看到流失客户的信息，方便及时维护流失客户信息。
                </div>
                <div className={styles.btn_dv}>
                  <a onClick={this.showModal}>处理问题</a>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <div id={styles.peoplemodule} className={styles.module}>
          <div className={styles.mod_header}>
            <h2 className={styles.toogle_title}>反馈用户</h2>
          </div>
          <div className={styles.mod_content}>
            <ul className={styles.property_list}>
              <li className={styles.item}>
                <div className={styles.wrap}>
                  <div className={styles.info_dv}>
                    <span>经纪业务总部</span><span>王溪</span><span>2017-1-3 11:30</span>
                  </div>
                  <div className={styles.txt}>
                    此问题业务已确认解决。
                  </div>
                </div>
              </li>
              <li className={styles.item}>
                <div className={styles.wrap}>
                  <div className={styles.info_dv}>
                    <span>经纪业务总部</span><span>王溪</span><span>2017-1-3 11:30</span>
                  </div>
                  <div className={styles.txt}>
                    此问题业务已确认解决。
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <Modal
          title="Title"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <ProblemHandling />
        </Modal>
      </div>
    );
  }
}


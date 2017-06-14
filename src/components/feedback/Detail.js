/**
 * @file components/feedback/Home.js
 *  问题反馈
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import { Row, Col, Button } from 'antd';
import ProblemHandling from './ProblemHandling';
import styles from './detail.less';

export default class FeedBack extends PureComponent {
  state = {
    visible: false,
    title: '处理问题',
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleCancel = () => {
    this.setState({ visible: false });
  }
  handleCreate = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      console.log(err);
      if (err) {
        console.log(11);
        return;
      }
      console.log('Received values of form: ', values);
      form.resetFields();
      this.setState({ visible: false });
    });
  }
  saveFormRef = (form) => {
    this.form = form;
  }
  render() {
    return (
      <div className={styles.detail_box}>
        <div className={styles.inner}>
          <h1 className={styles.bugtitle}>【问题】FSP/100001</h1>
          <div className={styles.row_box}>
            <Row gutter={16}>
              <Col span="16">
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
                      <Button onClick={this.showModal}>处理问题</Button>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span="8">
                <div className={styles.imgbox}>
                  <img src="" alt="" />
                </div>
              </Col>
            </Row>
          </div>
          <div id={styles.peoplemodule} className={styles.module}>
            <div className={styles.mod_header}>
              <h2 className={styles.toogle_title}>反馈用户</h2>
            </div>
            <div className={styles.mod_content}>
              <ul className={styles.property_list}>
                <li className={styles.item}>
                  <div className={styles.wrap}>
                    <strong className={styles.name}>员工号：</strong>
                    <span className={styles.value}>673920</span>
                  </div>
                </li>
                <li className={styles.item}>
                  <div className={styles.wrap}>
                    <strong className={styles.name}>用户：</strong>
                    <span className={styles.value}>王强</span>
                  </div>
                </li>
                <li className={styles.item}>
                  <div className={styles.wrap}>
                    <strong className={styles.name}>部门：</strong>
                    <span className={styles.value}>南京市建邺区中山中山中山中32222222山东路营业部</span>
                  </div>
                </li>
                <li className={styles.item}>
                  <div className={styles.wrap}>
                    <strong className={styles.name}>联系电话：</strong>
                    <span className={styles.value}>13827382927</span>
                  </div>
                </li>
                <li className={styles.item}>
                  <div className={styles.wrap}>
                    <strong className={styles.name}>邮箱：</strong>
                    <span className={styles.value}>wangqiang@htsc.com.cn</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div id={styles.processing} className={styles.module}>
            <div className={styles.mod_header}>
              <h2 className={styles.toogle_title}>处理记录</h2>
            </div>
            <div className={styles.mod_content}>
              <ul className={styles.record_list}>
                <li className={styles.item}>
                  <div className={styles.wrap}>
                    <div className={styles.txt}>
                      此问题业务已确认解决。
                    </div>
                    <div className={styles.info_dv}>
                      <span>经纪业务总部</span><span>王溪</span><span>2017-1-3 11:30</span>
                    </div>
                  </div>
                </li>
                <li className={styles.item}>
                  <div className={styles.wrap}>
                    <div className={styles.txt}>
                      此问题业务已确认解决。
                    </div>
                    <div className={styles.info_dv}>
                      <span>经纪业务总部</span><span>王溪</span><span>2017-1-3 11:30</span>
                    </div>
                  </div>
                </li>
              </ul>
              <div className={styles.remarks_box}>
                <Button icon="edit">备注</Button>
              </div>
            </div>
          </div>
          <ProblemHandling
            ref={this.saveFormRef}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
          />
        </div>
      </div>
    );
  }
}


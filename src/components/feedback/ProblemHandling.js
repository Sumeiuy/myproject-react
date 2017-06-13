/**
 * @file feedback/ProblemHandling.js
 *  问题反馈-解决弹窗
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Select, Row, Col, Input, Form, Modal } from 'antd';
import { createForm } from 'rc-form';
import './problemHandling.less';

@createForm()
export default class ProblemHandling extends PureComponent {
  static propTypes = {
    popContent: PropTypes.string,
    title: PropTypes.string,
    form: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    width: PropTypes.string,
  }
  static defaultProps = {
    popContent: ' ',
    title: '问题反馈',
    width: '620',
  }
  render() {
    const FormItem = Form.Item;
    const Option = Select.Option;
    const { visible, title, onCancel, onCreate, width } = this.props;
    // const { getFieldDecorator } = form;
    return (
      <Modal
        title={title}
        visible={visible}
        onOk={onCreate}
        onCancel={onCancel}
        width={width}
        className="problemwrap"
      >
        <div className="problembox">
          <div className="pro_title">
            <i>!</i>处理问题表示对此问题做出判断处理。
          </div>
          <div className="list_box">
            <Form>
              <Row>
                <Col span="4"><div className="label">问题标签：</div></Col>
                <Col span="19" offset={1}>
                  <FormItem>
                    <Select defaultValue="使用方法" style={{ width: 220 }} onChange={this.handleChange}>
                      <Option value="使用方法">使用方法</Option>
                      <Option value="改进建议">改进建议</Option>
                      <Option value="产品规格限制">产品规格限制</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="4"><div className="label">状态：</div></Col>
                <Col span="19" offset={1}>
                  <FormItem>
                    <Select defaultValue="转技术部" style={{ width: 220 }}>
                      <Option value="转技术部">转技术部</Option>
                      <Option value="待确认">待确认</Option>
                      <Option value="关闭">关闭</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="4"><div className="label">经办人：</div></Col>
                <Col span="19" offset={1}>
                  <FormItem>
                    <Select defaultValue="信息技术部运维人员" style={{ width: 220 }}>
                      <Option value="信息技术部运维人员">信息技术部运维人员</Option>
                      <Option value="金基业务总部运维人员">金基业务总部运维人员</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="4"><div className="label">处理意见：</div></Col>
                <Col span="19" offset={1}>
                  <FormItem>
                    <Input type="textarea" rows={5} style={{ width: '100%' }} />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="4"><div className="label">附件：</div></Col>
                <Col span="19" offset={1}>
                  <img src="" alt="附件" />
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Modal>
    );
  }
}


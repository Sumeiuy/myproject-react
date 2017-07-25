/**
 * @file history/PickIndicators.js
 *  历史指标-挑选指标
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Modal } from 'antd';
import { createForm } from 'rc-form';
import { autobind } from 'core-decorators';
import './pickIndicators.less';

@createForm()
export default class PickIndicators extends PureComponent {
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
    title: '挑选指标（挑选您想要查看的指标名称，最少选择4项，最多选择9项）',
    width: '620px',
  }

  constructor(props) {
    super(props);
    return true;
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }

  // 数据提交
  @autobind
  handleSubChange() {
    const { form, onCreate } = this.props;
    onCreate(form);
  }

  render() {
    const {
      onCancel,
      visible,
      title,
      width,
    } = this.props;
    return (
      <Modal
        title={title}
        visible={visible}
        onOk={this.handleSubChange}
        onCancel={onCancel}
        width={width}
        className="problemwrap"
        okText="提交"
      >
        <div className="problembox react-app">
          1
        </div>
      </Modal>
    );
  }
}


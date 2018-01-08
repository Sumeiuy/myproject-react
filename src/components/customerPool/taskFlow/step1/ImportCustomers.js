/**
 * @file customerPool/createTask/ImportCustomers.js
 *  客户池-自建任务表单-导入客户
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { Form, Input } from 'antd';

import Header from './Header';
import CustomerSegment from '../CustomerSegment';

import styles from './importCustomers.less';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 20,
  },
};

@Form.create()
export default class ImportCustomers extends PureComponent {

  static propTypes = {
    visible: PropTypes.bool,
    switchTo: PropTypes.func,
    onPreview: PropTypes.func.isRequired,
    priviewCustFileData: PropTypes.object.isRequired,
    storedTaskFlowData: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
  }

  static defaultProps = {
    visible: false,
    switchTo: () => {},
  }

  render() {
    const {
      visible,
      switchTo,
      onPreview,
      priviewCustFileData,
      storedTaskFlowData,
    } = this.props;
    const cls = classnames({
      [styles.hide]: !visible,
    });
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={cls}>
        <div className={styles.header}>
          <Header
            title="导入客户"
            switchTarget="瞄准镜圈人"
            onClick={switchTo}
          />
        </div>
        <div className={styles.importCustomersContent}>
          <CustomerSegment
            ref={ref => (this.customerSegmentRef = ref)}
            onPreview={onPreview}
            priviewCustFileData={priviewCustFileData}
            storedData={storedTaskFlowData}
          />
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="客户来源说明："
            >
              {getFieldDecorator('source', {
                rules: [{
                  required: true, message: '请填写对筛选客户的来源说明',
                }],
              })(
                <Input.TextArea
                  placeholder="对筛选客户的来源说明"
                  autosize={{ minRows: 3, maxRows: 5 }}
                />,
                )}
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

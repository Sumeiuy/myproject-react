/**
 * @Descripter: 自定义客户标签
 * @Author: K0170179
 * @Date: 2018/7/2
 */
import React, { PureComponent } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { SingleFilter } from 'lego-react-filter';

import Table from '../../common/commonTable';
import styles from './customerLabel.less';

const FormItem = Form.Item;
const dataSource = [{
  type: '标签类型1',
  name: '逗比1号',
  desc: '标签描述111111111111111111111111111111',
  created: '哔哔1',
  related: true,
  id: '1',
}, {
  type: '标签类型2',
  name: '逗比2号',
  desc: '标签描述5555555555555555555555555555555',
  created: '哔哔2',
  related: false,
  id: '2',
}, {
  type: '标签类型3',
  name: '逗比3号',
  desc: '标签描述2222222222222222222222222222222',
  created: '哔哔3',
  related: true,
  id: '3',
}, {
  type: '标签类型4',
  name: '逗比4号',
  desc: '标签描述33333333333333333333333',
  created: '哔哔4',
  related: true,
  id: '4',
}, {
  type: '标签类型5',
  name: '逗比5号',
  desc: '标签描述444444444444444444444444444444444444',
  created: '哔哔5',
  related: true,
  id: '5',
}];

@Form.create()
export default class LabelManager extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      typeVisible: true,
    };
  }

  getCustomerLabelItem({ value = {} }) {
    return value.value;
  }

  getClumneTitle() {
    return ([{
      key: 'type',
      value: '标签类型',
    },
    {
      key: 'name',
      value: '标签名称',
    },
    {
      key: 'desc',
      value: '标签描述',
    },
    {
      key: 'created',
      value: '创建人',
    },
    {
      key: 'related',
      value: '操作',
      render: () => (
        <div>删除</div>
      ),
    }]);
  }

  // 新建标签类型 ----start
  @autobind
  handleCreateType() {
    this.setState({
      typeVisible: true,
    });
  }

  @autobind
  handleCreateTypeReturn() {
    this.setState({
      typeVisible: false,
    });
  }

  @autobind
  handleCreateTypeSubmit() {
    this.props.form.validateFields((error, values) => {
      if (!error) {
        setTimeout(() => {
          this.props.form.setFields({
            labelType: {
              value: values.labelType,
              errors: [new Error('添加的标签类型已存在，请重新输入')],
            },
          });
        }, 500);
      } else {
        console.log('error', error, values);
      }
    });
  }
  // 新建标签类型 ----end

  render() {
    const { typeVisible } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 3 },
      },
      wrapperCol: {
        sm: { span: 20 },
      },
    };

    return (
      <div className={styles.customerLabelWrap}>
        <div className={styles.tip}>自定义客户标签，用于管理岗人员在此创建标签，标签必须保持唯一性，采用先到先得的规则，标签一旦创建对所有人可见。</div>
        <div className={styles.operationWrap}>
          <div>
            <SingleFilter
              data={dataSource}
              value="1"
              dataMap={['id', 'name']}
              getOptionItemValue={this.getCustomerLabelItem}
              defaultLabel="不限"
              filterName="标签类型"
              showSearch
            />
          </div>
          <div className={styles.operationRight}>
            <Button icon="plus">新建类型</Button>
            <Button icon="plus" type="primary">新建标签</Button>
          </div>
        </div>
        <div className={styles.customerLabelList}>
          <Table
            pageData={{
              curPageNum: 1,
              curPageSize: 10,
              totalRecordNum: 1,
            }}
            listData={dataSource}
            titleColumn={this.getClumneTitle()}
            columnWidth={['12%', '15%', '48%', '10%', '5%']}
            needPagination
          />
        </div>
        <Modal
          title="新增标签类型"
          wrapClassName={styles.addLabelType}
          width={540}
          visible={typeVisible}
          footer={[
            <Button
              key="back"
              onClick={this.handleCreateTypeReturn}
            >返回</Button>,
            <Button
              key="submit"
              type="primary"
              loading={false}
              onClick={this.handleCreateTypeSubmit}
            >确认</Button>,
          ]}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="名称"
            >
              {getFieldDecorator('labelType', {
                rules: [{
                  required: true, message: '请输入标签名称',
                }],
              })(
                <Input />,
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

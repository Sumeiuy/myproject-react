/**
 * @file feedback/Remark.js
 *  问题反馈-备注
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Input, Form, Button } from 'antd';
import { createForm } from 'rc-form';
import classnames from 'classnames';
import './remark.less';

const FormItem = Form.Item;
@createForm()
export default class Remark extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    visible: PropTypes.bool,
    form: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
  }
  static defaultProps = {
    id: '0',
    visible: false,
  }
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { visible: preVisible } = this.props;
    const { visible } = nextProps;
    if (preVisible !== visible) {
      console.log({ visible }, '---------');
      this.setState({
        isShow: visible,
      });
    }
  }
  render() {
    const { onCancel, onCreate, form } = this.props;
    const { isShow } = this.state;
    const { getFieldDecorator } = form;
    const remarkVisible = classnames({
      remarkbox: true,
      isShow,
    });
    return (
      <div id="remak" className={remarkVisible}>
        <h3>备注</h3>
        <div className="formbox">
          <Form layout="vertical">
            <FormItem>
              {getFieldDecorator('remarkContent')(
                <Input type="textarea" rows={5} style={{ width: '100%' }} />,
              )}
            </FormItem>
            <div className="remarkbtn_dv">
              <Button type="primary" onClick={onCancel}>取消</Button>
              <Button onClick={onCreate}>提交</Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}


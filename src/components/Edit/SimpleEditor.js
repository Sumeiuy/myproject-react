/**
 * @description 简单的修改编辑器
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import classnames from 'classnames';
import { createForm } from 'rc-form';
import { autobind } from 'core-decorators';
import { Form } from 'antd';

import Icon from '../common/Icon';
import styles from './SimpleEditor.less';

const FormItem = Form.Item;

@createForm()
export default class SimpleEditor extends PureComponent {
  static propTypes = {
    editable: PropTypes.bool,
    originalValue: PropTypes.string.isRequired,
    style: PropTypes.object,
    children: PropTypes.element,
    editorValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
    editorName: PropTypes.string,
    form: PropTypes.object.isRequired,
  }

  static defaultProps = {
    editable: true,
    style: {},
    children: null,
    editorName: '',
    editorValue: '' || [],
  }

  constructor(props) {
    super(props);
    const { originalValue } = props;
    this.state = {
      value: originalValue,
      editing: false,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.exitEditState, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.exitEditState);
  }

  @autobind
  enterEditState() {
    this.setState({
      editing: true,
    });
  }

  @autobind
  exitEditState() {
    this.setState({
      editing: false,
    });
  }

  @autobind
  handleEditWrapper(e) {
    const { form, editorName, editable } = this.props;
    if (!editable) {
      return;
    }
    const editor = form.getFieldInstance(editorName);
    if (editor.focus) {
      editor.focus();
    } else {
      editor.expandSelect();
    }
    this.enterEditState();
    // 阻止React事件传播
    e.stopPropagation();
    // 阻止原生事件传播
    e.nativeEvent.stopImmediatePropagation();
  }

  render() {
    const { editable, style, children, editorName, editorValue } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { value, editing } = this.state;
    const editWrapperClass = classnames({
      [styles.editWrapper]: true,
      [styles.editable]: editable,
      [styles.editing]: editing,
    });
    const editIconClass = classnames({
      [styles.editIcon]: true,
      [styles.showIcon]: editable,
    });

    const editContentClass = classnames({
      [styles.editContent]: true,
    });

    return (
      <div className={editWrapperClass} style={style} onClick={this.handleEditWrapper}>
        <div className={editIconClass}>
          <Icon type="beizhu" />
        </div>
        <div className={editContentClass}>{value}</div>
        {
          React.Children.map(children, child =>
            (<Form>
              <FormItem>
                {
                  getFieldDecorator(editorName, { initialValue: editorValue })(child)
                }
              </FormItem>
            </Form>))
        }
      </div>
    );
  }
}


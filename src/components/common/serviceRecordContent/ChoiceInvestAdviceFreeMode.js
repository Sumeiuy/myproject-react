/**
 * @Author: sunweibin
 * @Date: 2018-04-19 09:20:50
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-25 18:32:29
 * @description 添加涨乐财富通服务方式下的投资建议的自由话术模块
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input, Icon } from 'antd';
import _ from 'lodash';
import cx from 'classnames';

import styles from './choiceInvestAdviceModal.less';

const { TextArea } = Input;

export default class ChoiceInvestAdviceFreeMode extends PureComponent {

  static propTypes = {
    isUpdate: PropTypes.bool.isRequired,
    serveContent: PropTypes.object.isRequired,
    validateContent: PropTypes.bool.isRequired,
    validateTitle: PropTypes.bool.isRequired,
    // 投资建议文本撞墙检测是否有股票代码
    testWallCollisionStatus: PropTypes.bool.isRequired,
    // 获取投资建议文本标题和内容
    onGetInvestAdviceFreeModeData: PropTypes.func.isRequired,
    // 内容错误提示信息
    descErrorInfo: PropTypes.string.isRequired,
    // 标题错误提示信息
    titleErrorInfo: PropTypes.string.isRequired,
    onFormDataChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const { isUpdate, serveContent } = props;
    this.state = {
      // 投资建议标题
      title: isUpdate ? serveContent.title : '',
      // 投资建议内容
      desc: isUpdate ? serveContent.desc : '',
      validateTitle: false,
      validateContent: false,
      // 内容错误提示信息
      descErrorInfo: '',
      // 标题错误提示信息
      titleErrorInfo: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      serveContent: nextSC,
      validateContent: nextVC,
      validateTitle: nextVT,
      descErrorInfo,
      titleErrorInfo,
    } = nextProps;
    const { serveContent: prevSC, validateContent: prevVC, validateTitle: prevVT } = this.props;
    if (nextVC !== prevVC || nextVT !== prevVT) {
      this.setState({
        validateTitle: nextVT,
        validateContent: nextVC,
        descErrorInfo,
        titleErrorInfo,
      });
    }
    if (!_.isEqual(nextSC, prevSC)) {
      this.setState({
        title: nextSC.title || '',
        desc: nextSC.desc || '',
      });
    }
  }

  @autobind
  getData() {
    return this.state;
  }

  @autobind
  checkData() {
    const { title, desc } = this.state;
    if (_.isEmpty(title) || title.length > 15) {
      this.setState({
        titleErrorInfo: '标题最多15个字符',
        validateTitle: true,
      });
      return false;
    }
    if (_.isEmpty(desc) || desc.length > 500) {
      this.setState({
        descErrorInfo: '内容最多500个字符',
        validateContent: true,
      });
      return false;
    }
    this.props.onGetInvestAdviceFreeModeData(title, desc);
    return true;
  }

  @autobind
  handleFreeEditTitleChange(e) {
    const title = e.target.value;
    this.setState({ title, validateTitle: false });
    // 调用了此方法说明表单数据发生了变化
    this.props.onFormDataChange();
  }

  @autobind
  handleFreeEditDescChange(e) {
    const desc = e.target.value;
    this.setState({ desc, validateContent: false });
    // 调用了此方法说明表单数据发生了变化
    this.props.onFormDataChange();
  }

  render() {
    const {
      validateTitle,
      validateContent,
      title,
      desc,
      descErrorInfo,
      titleErrorInfo,
     } = this.state;
    const ctCls = cx([styles.editLine, styles.editLineTextArea]);

    const titleErrorCls = cx({
      [styles.serveContent]: true,
      [styles.validateError]: validateTitle,
    });

    const descErrorCls = cx({
      [styles.serveContent]: true,
      [styles.validateError]: validateContent,
    });

    return (
      <div className={styles.freeModeContainer}>
        <div className={styles.editLine}>
          <div className={styles.editCaption}>标题:</div>
          <div className={styles.editInput}>
            <Input
              className={titleErrorCls}
              value={title}
              onInput={this.handleFreeEditTitleChange}
            />
          </div>
        </div>
        {
          !validateTitle ? null
          : (<div className={styles.validateTips}>{titleErrorInfo}</div>)
        }
        <div className={ctCls}>
          <div className={styles.editCaption}>内容:</div>
          <div className={styles.editInput}>
            <TextArea
              className={descErrorCls}
              value={desc}
              onInput={this.handleFreeEditDescChange}
            />
          </div>
        </div>
        {
          !validateContent ? null
          : (<div className={styles.validateTips}>{descErrorInfo}</div>)
        }
        <div className={styles.tips}><Icon type="exclamation-circle" /> 注：手动输入的服务内容需要经过审批才能发送到客户手机上</div>
      </div>
    );
  }
}

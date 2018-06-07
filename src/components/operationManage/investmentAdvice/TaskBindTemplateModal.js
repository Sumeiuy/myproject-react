/**
 * @Author: sunweibin
 * @Date: 2018-06-06 09:43:38
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-06 15:57:44
 * @description 任务绑定投资建议模板弹出层
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input, Checkbox } from 'antd';
import _ from 'lodash';

import Modal from '../../common/biz/CommonModal';

import styles from './taskBindTemplateModal.less';

const Search = Input.Search;

export default class componentName extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    data: PropTypes.array.isRequired,
    onOK: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    queryTemplateList: PropTypes.func.isRequired,
  }

  static defaultProps = {
    visible: false,
  }

  static contextTypes = {
    dict: PropTypes.object.isRequired,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.originList !== nextProps.data) {
      return {
        optionalList: nextProps.data,
        originList: nextProps.data,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      // 选中的模板ID列表
      templateList: [],
      // 用户筛选过后的模板列表
      optionalList: props.data,
      // 原始的可选模板列表
      originList: props.data,
    };
  }

  componentDidMount() {
    // 因为目前投资模板列表展示的数量控制在100条以内，所以跟需求和后端确认
    // 由前端传递 pageSize = 100 来直接获取所有的数据，然后由前端来进行过滤
    this.props.queryTemplateList({ pageNum: 1, pageSize: 100 });
  }

  @autobind
  generateParameterReg() {
    const { dict: { investAdviceIndexPlaceHolders = [] } } = this.context;
    const parameterRegString = investAdviceIndexPlaceHolders.map(item => `\\${item.value}`).join('|');
    const regString = `(\\s(${parameterRegString}))`;
    // var reg1 = new RegExp('(\\s(\\$服务经理|\\$客户名称))', 'g');
    // 将字典中的投资建议模板参数转化成 RegExp 对象
    return new RegExp(regString, 'g');
  }

  // 将投资建议模板中的内容里面的 $服务经理 参数进行使用html标签包装文本
  // 使其显示高亮
  @autobind
  replaceInvestAdviceParameterInContent(content) {
    if (!this.mentionReg) {
      this.mentionReg = this.generateParameterReg();
    }
    const newContent = content.replace(this.mentionReg,
      (a, b) => `<span class=${styles.investAdviceBindMentionHightlight}>${b}</span>`);
    // 此处用于转化成 html 标签字符串 ，传递给 React 的 dangerouslySetInnerHTML 使用
    return { __html: `<span>${newContent}</span>` };
  }

  @autobind
  handleModalOKBtnClick() {
    const { templateList } = this.state;
    console.warn('handleModalOKBtnClick: templateList', templateList);
    this.props.onOK(templateList);
  }

  @autobind
  handleCloseModal() {
    this.props.onCancel();
  }

  @autobind
  handleTemplateSearch(v) {
    // 此处根据用户输入的值进行可选模板列表的过滤
    if (_.isEmpty(v)) {
      // 如果 Search 框为空，则需要显示所有的数据
      this.setState({ optionalList: this.props.data });
      return;
    }
    const { originList } = this.state;
    const listAfterFilter = _.filter(originList,
      tmpl => tmpl.title.indexOf(v) > 0 || tmpl.content.indexOf(v) > 0);
    this.setState({ optionalList: listAfterFilter });
  }

  @autobind
  handleCheckboxChange(e) {
    const { checked, value } = e.target;
    const { templateList } = this.state;
    if (checked) {
      // 如果选中，则需要将值记录下来
      this.setState({
        templateList: [...templateList, value],
      });
    } else {
      this.setState({
        templateList: _.filter(templateList, item => item !== value),
      });
    }
  }

  @autobind
  renderTamplatePanelsComponnet(list = []) {
    const { templateList } = this.state;
    return list.map(item => (
      <div className={styles.templateCard} key={item.id}>
        <div className={styles.cardHeader}>
          <Checkbox
            checked={_.includes(templateList, item.id)}
            value={item.id}
            onChange={this.handleCheckboxChange}
          >
            {item.title}
          </Checkbox>
        </div>
        <div
          className={styles.cardBody}
          dangerouslySetInnerHTML={this.replaceInvestAdviceParameterInContent(item.content)} // eslint-disable-line
        />
      </div>
    ));
  }

  render() {
    const { visible } = this.props;
    if (!visible) return null;

    const { optionalList } = this.state;

    return (
      <Modal
        visible={visible}
        size="large"
        title="请选择适当的投资建议模板"
        modalKey="taskBindInvestAdviceTemplateModal"
        onOk={this.handleModalOKBtnClick}
        closeModal={this.handleCloseModal}
      >
        <div className={styles.templateListContainer}>
          <div className={styles.containerHeader}>
            <div className={styles.search}>
              <Search
                placeholder="搜索内容"
                onSearch={this.handleTemplateSearch}
                style={{ width: 200 }}
              />
            </div>
            <div className={styles.searchResult}>
              共有{_.size(optionalList)}条可选模板
            </div>
          </div>
          <div className={styles.templateListWrapper}>
            {this.renderTamplatePanelsComponnet(optionalList)}
          </div>
        </div>
      </Modal>
    );
  }
}

/**
 * @Author: sunweibin
 * @Date: 2018-07-16 16:16:13
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-23 10:28:25
 * @description 服务内容选择投资建议模板组件
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Input, Radio } from 'antd';

import EmptyData from './NoTmplList';
import TemplateContent from './TemplateContent';

import styles from './choiceInvestAdviceTmplMode.less';

const Search = Input.Search;

export default class ChoiceInvestAdviceTmplMode extends Component {
  static propTypes = {
    tmplList: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    templateID: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
  }

  static contextTypes = {
    dict: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 搜索关键字
      searchWord: '',
    };
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
  preventKeyDownPropagation(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }

  @autobind
  filterTmplList(v, list) {
    if (_.isEmpty(v)) {
      return [...list];
    }
    const listAfterFilter = _.filter(list,
      tmpl => _.includes(tmpl.title, v) || _.includes(tmpl.content, v));
    return listAfterFilter;
  }

  @autobind
  handleTemplateSearch(v) {
    this.setState({ searchWord: v });
  }

  @autobind
  handleRadioChange(e, title) {
    const { value } = e.target;
    this.props.onSelect({ id: value, title });
  }

  @autobind
  renderTamplatePanelsComponnet(list = []) {
    const { templateID } = this.props;
    return list.map(item => (
      <div className={styles.templateCard} key={item.id}>
        <div className={styles.cardHeader}>
          <Radio
            checked={templateID === item.id}
            value={item.id}
            onChange={e => this.handleRadioChange(e, item.title)}
          >
            {item.title}
          </Radio>
        </div>
        <TemplateContent
          tempLiateId={`${item.id}`}
          content={this.replaceInvestAdviceParameterInContent(item.content)}
        />
      </div>
    ));
  }

  render() {
    const { tmplList } = this.props;

    const isEmptyTmp = _.isEmpty(tmplList);

    const { searchWord } = this.state;

    const filteredTmplList = this.filterTmplList(searchWord, tmplList);

    return (
      <div className={styles.tmplModeContainer}>
        {
          isEmptyTmp ? (<EmptyData />)
          :
          (
            <div>
              <div className={styles.containerHeader}>
                <div className={styles.search}>
                  <Search
                    onKeyDown={this.preventKeyDownPropagation}
                    placeholder="搜索内容"
                    onSearch={this.handleTemplateSearch}
                    style={{ width: 200 }}
                    enterButton
                  />
                </div>
                <div className={styles.searchResult}>
                  共有{_.size(filteredTmplList)}条可选模板
                </div>
              </div>
              <div className={styles.templateListWrapper}>
                {this.renderTamplatePanelsComponnet(filteredTmplList)}
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

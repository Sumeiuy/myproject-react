/**
 * @Descripter: 将文本中的换行符替换成br, 将链接使用<a/> 包裹起来
 * @Author: K0170179
 * @Date: 2018/4/25
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { regxp } from '../../helper';

export default class ForgeryRichText extends PureComponent {
  static propTypes = {
    text: PropTypes.string,
  }

  static defaultProps = {
    text: '',
  }

  replaceUrl(text) {
    return text.replace(regxp.url, (match) => {
      const isWWW = /^www\./.test(match);
      const finalUrl = isWWW ? `http://${match}` : match;
      return `<a href="${finalUrl}" target="_blank" rel="noopener noreferrer" >${match}</a>`;
    });
  }

  replaceText(text) {
    if (text) {
      const textContent = this.replaceUrl(text);
      const textList = textContent.split(regxp.returnLine);
      return _.map(textList, (item, index) => (
        <div
          key={item + index}
        // 处理空行问题
          dangerouslySetInnerHTML={{ __html: _.isEmpty(item) ? '<br/>' : item }}
        />
      ));
    }
    return '--';
  }

  render() {
    const { text } = this.props;
    return (
      this.replaceText(text)
    );
  }
}

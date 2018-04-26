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
    text: PropTypes.string.isRequired,
  }

  replaceUrl(text) {
    const containATagText = text.replace(regxp.url, (match) => {
      const isWWW = /^www\./.test(match);
      const finalUrl = isWWW ? `http://${match}` : match;
      return `<a href="${finalUrl}" target="_blank" rel="noopener noreferrer" >${match}</a>`;
    });
    return <div key={containATagText} dangerouslySetInnerHTML={{ __html: containATagText }} />;
  }

  replaceText(text) {
    if (text) {
      const textList = text.split(regxp.returnLine);
      return _(textList)
        .reduce((accumulator, currentValue) => {
          let finalValue = currentValue;
          if (regxp.url.test(currentValue)) {
            finalValue = this.replaceUrl(currentValue);
            return accumulator.concat(finalValue);
          }
          return accumulator.concat(finalValue,
            <br key={finalValue} />);
        }, []);
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

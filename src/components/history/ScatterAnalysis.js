/**
 * by xuxiaoqin
 * ScatterAnalysis.js
 */
import React, { PropTypes, PureComponent } from 'react';
import { Row, Col } from 'antd';
import _ from 'lodash';
import AbilityScatterAnalysis from './AbilityScatterAnalysis';
import { scatterType } from '../../config';
import styles from './scatterAnalysis.less';

const custScatter = scatterType[0];
const investScatter = scatterType[1];

export default class ScatterAnalysis extends PureComponent {
  static propTypes = {
    contributionAnalysisData: PropTypes.object.isRequired,
    reviewAnalysisData: PropTypes.object.isRequired,
    queryContrastAnalyze: PropTypes.func.isRequired,
    cust: PropTypes.array.isRequired,
    invest: PropTypes.array.isRequired,
    swtichDefault: PropTypes.string.isRequired,
  };

  static defaultProps = {
  };

  render() {
    const {
      queryContrastAnalyze,
      contributionAnalysisData,
      reviewAnalysisData,
      cust,
      invest,
      swtichDefault,
    } = this.props;
    if (_.isEmpty(cust) || _.isEmpty(invest)) {
      return null;
    }
    return (
      <div className={styles.scatterSection}>
        <Row type="flex">
          <Col span={12} className={styles.leftScatterSection}>
            <AbilityScatterAnalysis
              data={contributionAnalysisData}
              queryContrastAnalyze={queryContrastAnalyze}
              title={custScatter.title}
              optionsData={cust}
              type={custScatter.type}
              swtichDefault={swtichDefault}
              style={{
                left: '-85px',
              }}
            />
          </Col>
          <Col span={12} className={styles.rightScatterSection}>
            <AbilityScatterAnalysis
              data={reviewAnalysisData}
              queryContrastAnalyze={queryContrastAnalyze}
              title={investScatter.title}
              optionsData={invest}
              type={investScatter.type}
              swtichDefault={swtichDefault}
              style={{
                left: '-45px',
              }}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

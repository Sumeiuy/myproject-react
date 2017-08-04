/**
 * by xuxiaoqin
 * ScatterAnalysis.js
 */
import React, { PropTypes, PureComponent } from 'react';
import { Row, Col } from 'antd';
import AbilityScatterAnalysis from './AbilityScatterAnalysis';
import styles from './scatterAnalysis.less';

export default class ScatterAnalysis extends PureComponent {
  static propTypes = {
    contributionAnalysisData: PropTypes.object.isRequired,
    reviewAnalysisData: PropTypes.object.isRequired,
    queryContrastAnalyze: PropTypes.func.isRequired,
    cust: PropTypes.array.isRequired,
    invest: PropTypes.array.isRequired,
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
    } = this.props;

    return (
      <div className={styles.scatterSection}>
        <Row type="flex">
          <Col span={12} className={styles.leftScatterSection}>
            <AbilityScatterAnalysis
              data={contributionAnalysisData}
              queryContrastAnalyze={queryContrastAnalyze}
              title={'客户贡献分析'}
              optionsData={{ data: cust, type: 'cust' }}
            />
          </Col>
          <Col span={12} className={styles.rightScatterSection}>
            <AbilityScatterAnalysis
              data={reviewAnalysisData}
              queryContrastAnalyze={queryContrastAnalyze}
              title={'入岗投顾能力分析'}
              optionsData={{ data: invest, type: 'invest' }}
            />
          </Col>
        </Row>
      </div>
    );
  }
}


/**
 * by xuxiaoqin
 * ScatterAnalysis.js
 */
import React, { PropTypes, PureComponent } from 'react';
import { Row, Col } from 'antd';
// import { autobind } from 'core-decorators';
// import _ from 'lodash';
import AbilityScatterAnalysis from './AbilityScatterAnalysis';
// import StaffScatterAnalysis from './StaffScatterAnalysis';
import styles from './scatterAnalysis.less';

export default class ScatterAnalysis extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    contributionAnalysisData: PropTypes.object.isRequired,
    reviewAnalysisData: PropTypes.object.isRequired,
    queryContrastAnalyze: PropTypes.func.isRequired,
    custRange: PropTypes.array.isRequired,
    cust: PropTypes.array.isRequired,
    invest: PropTypes.array.isRequired,
  };

  static defaultProps = {
  };

  render() {
    const {
      location,
      queryContrastAnalyze,
      contributionAnalysisData,
      reviewAnalysisData,
      custRange,
      cust,
      invest,
    } = this.props;

    return (
      <div className={styles.scatterSection}>
        <Row type="flex">
          <Col span={12} className={styles.leftScatterSection}>
            <AbilityScatterAnalysis
              location={location}
              data={contributionAnalysisData}
              queryContrastAnalyze={queryContrastAnalyze}
              custRange={custRange}
              title={'客户贡献分析'}
              optionsData={cust}
            />
          </Col>
          <Col span={12} className={styles.rightScatterSection}>
            <AbilityScatterAnalysis
              location={location}
              data={reviewAnalysisData}
              queryContrastAnalyze={queryContrastAnalyze}
              custRange={custRange}
              title={'入岗投顾能力分析'}
              optionsData={invest}
            />
          </Col>
        </Row>
      </div>
    );
  }
}


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

export default class ScatterAnalysis extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    contributionAnalysisData: PropTypes.object.isRequired,
    reviewAnalysisData: PropTypes.object.isRequired,
    queryContrastAnalyze: PropTypes.func.isRequired,
    custRange: PropTypes.array.isRequired,
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
    } = this.props;
    return (
      <div className="scatterSection">
        <Row type="flex">
          <Col span={12} className="leftScatterSection">
            <AbilityScatterAnalysis
              location={location}
              data={contributionAnalysisData}
              queryContrastAnalyze={queryContrastAnalyze}
              custRange={custRange}
            />
          </Col>
          <Col span={12} className="rightScatterSection">
            <AbilityScatterAnalysis
              location={location}
              data={reviewAnalysisData}
              queryContrastAnalyze={queryContrastAnalyze}
              custRange={custRange}
            />
          </Col>
        </Row>
      </div>
    );
  }
}


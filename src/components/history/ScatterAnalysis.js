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
    location: PropTypes.object.isRequired,
    level: PropTypes.string.isRequired,
    isLvIndicator: PropTypes.bool.isRequired,
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
      location: { query: { boardType } },
      level,
      isLvIndicator,
    } = this.props;
    if (_.isEmpty(cust) || _.isEmpty(invest)) {
      return null;
    }

    return (
      <div className={styles.scatterSection}>
        <Row type="flex" gutter={10}>
          <Col span={12} className={styles.leftScatterSection}>
            <AbilityScatterAnalysis
              data={contributionAnalysisData}
              queryContrastAnalyze={queryContrastAnalyze}
              title={custScatter.title}
              contrastType={'客户类型'}
              optionsData={cust}
              description={'客户贡献'}
              type={custScatter.type}
              isLvIndicator={isLvIndicator}
              swtichDefault={swtichDefault}
              style={{
                left: '-60px',
              }}
            />
          </Col>
          {
            // 经营绩效不展示投顾维度散点图
            // 投顾历史看板下的营业部不展示投顾维度散点图
            (boardType === 'TYPE_LSDB_JYYJ' || (level === '3' && boardType === 'TYPE_LSDB_TGJX'))
              ? <div
                style={{
                  height: '400px',
                }}
              /> :
              <Col span={12} className={styles.rightScatterSection}>
                <AbilityScatterAnalysis
                  data={reviewAnalysisData}
                  queryContrastAnalyze={queryContrastAnalyze}
                  title={investScatter.title}
                  contrastType={'投顾类型'}
                  optionsData={invest}
                  description={'服务经理'}
                  type={investScatter.type}
                  swtichDefault={swtichDefault}
                  isLvIndicator={isLvIndicator}
                  style={{
                    left: '-60px',
                  }}
                />
              </Col>
          }
        </Row>
      </div>
    );
  }
}

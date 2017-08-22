/**
 * by xuxiaoqin
 * ScatterAnalysis.js
 */
import React, { PropTypes, PureComponent } from 'react';
import { Row, Col } from 'antd';
// import _ from 'lodash';
import AbilityScatterAnalysis from './AbilityScatterAnalysis';
import { scatterType } from '../../config';
import styles from './scatterAnalysis.less';

const custScatter = scatterType[0];
const investScatter = scatterType[1];
const EMPTY_LIST = [];
export default class ScatterAnalysis extends PureComponent {
  static propTypes = {
    contributionAnalysisData: PropTypes.object.isRequired,
    reviewAnalysisData: PropTypes.object.isRequired,
    queryContrastAnalyze: PropTypes.func.isRequired,
    cust: PropTypes.array,
    invest: PropTypes.array,
    switchDefault: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    level: PropTypes.string.isRequired,
    isLvIndicator: PropTypes.bool.isRequired,
    currentSelectIndicatorName: PropTypes.string.isRequired,
  };

  static defaultProps = {
    cust: EMPTY_LIST,
    invest: EMPTY_LIST,
  };

  render() {
    const {
      queryContrastAnalyze,
      contributionAnalysisData,
      reviewAnalysisData,
      cust,
      invest,
      switchDefault,
      location: { query: { boardType } },
      level,
      isLvIndicator,
      currentSelectIndicatorName,
    } = this.props;

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
              switchDefault={switchDefault}
              level={level}
              boardType={boardType}
              currentSelectIndicatorName={currentSelectIndicatorName}
              style={{
                left: '-65px',
              }}
            />
          </Col>
          {
            // 投顾历史看板下的营业部不展示投顾维度散点图
            level === '3'
              ? <div
                style={{
                  height: '400px',
                }}
              /> :
              <Col span={12} className={styles.rightScatterSection}>
                <AbilityScatterAnalysis
                  data={reviewAnalysisData}
                  queryContrastAnalyze={queryContrastAnalyze}
                  title={boardType === 'TYPE_LSDB_TGJX' ? '投顾贡献对比' : '服务经理贡献对比'}
                  contrastType={'投顾类型'}
                  optionsData={invest}
                  description={boardType === 'TYPE_LSDB_TGJX' ? '入岗投顾贡献' : '服务经理贡献'}
                  type={investScatter.type}
                  switchDefault={switchDefault}
                  isLvIndicator={isLvIndicator}
                  boardType={boardType}
                  level={level}
                  currentSelectIndicatorName={currentSelectIndicatorName}
                  style={{
                    left: '-65px',
                  }}
                />
              </Col>
          }
        </Row>
      </div>
    );
  }
}

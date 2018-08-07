
/**
 * @Descripter: 单客户打标签，服务与360页面
 * @Author: K0170179
 * @Date: 2018/8/7
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva/index';
import _ from 'lodash';
import { autobind } from 'core-decorators';

import SignCustomerLabel from './SignCustomerLabel';

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  signLabelCust: state.customerLabel.signLabelCust,
  custLabel: state.customerLabel.custLabel,
  custLikeLabel: state.customerLabel.custLikeLabel,
});

const mapDispatchToProps = {
  queryLikeLabelInfo: fetchDataFunction(false, 'customerLabel/queryLikeLabelInfo'),
  signCustLabels: fetchDataFunction(true, 'customerLabel/signCustLabels'),
  addLabel: fetchDataFunction(true, 'customerLabel/addLabel'),
  clearSignLabelCust: fetchDataFunction(true, 'customerLabel/clearSignLabelCust'),
  queryCustSignedLabels: fetchDataFunction(true, 'customerLabel/queryCustSignedLabels'),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class ConnectedSignCustomerLabel extends PureComponent {
  static propTypes = {
    signLabelCust: PropTypes.object.isRequired,
    custLabel: PropTypes.object.isRequired,
    custLikeLabel: PropTypes.array.isRequired,
    queryLikeLabelInfo: PropTypes.func.isRequired,
    queryCustSignedLabels: PropTypes.func.isRequired,
    signCustLabels: PropTypes.func.isRequired,
    addLabel: PropTypes.func.isRequired,
    clearSignLabelCust: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      custId: '',
    };
  }

  componentDidUpdate(prevProps) {
    const { signLabelCust } = this.props;
    if (!_.isEmpty(signLabelCust)
      && signLabelCust !== prevProps.signLabelCust
    ) {
      this.queryCustSignLabel(signLabelCust.currentSignLabelCustId);
    }
  }

  @autobind
  queryCustSignLabel(custId) {
    const { queryCustSignedLabels } = this.props;
    queryCustSignedLabels({ custId }).then(() => {
      this.setState({ custId });
    });
  }

  @autobind
  handleClearCust() {
    this.props.clearSignLabelCust();
    this.setState({
      custId: '',
    });
  }

  render() {
    const {
      signLabelCust,
      custLabel,
      custLikeLabel,
      queryLikeLabelInfo,
      signCustLabels,
      addLabel,
    } = this.props;
    const { custId } = this.state;
    const { currentPytMng, mainPosition } = signLabelCust;
    return (
      <SignCustomerLabel
        currentPytMng={currentPytMng}
        custId={custId}
        custLabel={custLabel}
        queryLikeLabelInfo={queryLikeLabelInfo}
        custLikeLabel={custLikeLabel}
        signCustLabels={signCustLabels}
        handleCancelSignLabelCustId={this.handleClearCust}
        addLabel={addLabel}
        mainPosition={mainPosition}
      />
    );
  }
}

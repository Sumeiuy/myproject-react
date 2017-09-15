/**
 * @file components/contract/ContractDetail.js
 *  合作合约
 * @author wanghan
 */

import React, { PropTypes, PureComponent } from 'react';
// import ReactDOM from 'react-dom';
import { Form, Input, Row, Col } from 'antd';
import { createForm } from 'rc-form';
// import classnames from 'classnames';
import { connect } from 'react-redux';
// import { autobind } from 'core-decorators';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
// import { helper } from '../../utils';
// import { request } from '../../config';
import './contractDetail.less';

const EMPTY_OBJECT = {};
// const EMPTY_LIST = [];
const GETDETAIL = 'contract/getDetail';

const FormItem = Form.Item;

const mapStateToProps = state => ({
  contractDetail: state.contract.contractDetail,
});

const getDataFunction = loading => totype => query => ({
  type: totype,
  payload: query || {},
  loading,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  getDetail: getDataFunction(true)(GETDETAIL),
};

@connect(mapStateToProps, mapDispatchToProps)
@createForm()
export default class ContractDetail extends PureComponent {
  static propTypes = {
    contractDetail: PropTypes.object.isRequired,
    getDetail: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    form: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    const { contractDetail } = this.props;
    const resultData = contractDetail || EMPTY_OBJECT;
    this.state = {
      dataSource: resultData,
      visible: false,
      remarkVisible: false,
      title: '',
      inforTxt: '',
      colSpans: {
        left: 16,
        right: 8,
      },
      nowStatus: true, // PROCESSING / CLOSED
      currentId: '',
      previewVisible: false,
      newWidth: 520,
    };
  }

  componentWillMount() {
    const { location: { query } } = this.props;
    const { currentId } = query;
    if (currentId) {
      this.setState({
        currentId,
      });
      this.handlegetData(currentId);
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize, false);
  }

  componentWillReceiveProps(nextProps) {
    const { contractDetail: nextDetail = EMPTY_OBJECT,
      location: { query: { currentId } },
      } = nextProps;
    const { contractDetail: preDetail = EMPTY_OBJECT,
      location: { query: { currentId: prevCurrentId } },
      } = this.props;

    if (preDetail !== nextDetail) {
      this.setState({
        dataSource: nextDetail,
        currentId,
      });
    }

    /* currentId变化重新请求 */
    if (currentId && (currentId !== prevCurrentId)) {
      this.handlegetData(currentId);
      this.setState({
        currentId,
      });
    }
  }

  componentDidUpdate() {
    const { location: { query } } = this.props;
    const { currentId } = query;
    const { currentId: id } = this.state;

    // 只有当前state里面有currentId
    // 并且当前query里面有currentId
    // 才发起初始化请求
    if (!id && currentId) {
      this.handlegetData(currentId);
    }
    this.setState({ //eslint-disable-line
      currentId,
    });
  }

  componentWillUnmount() {
    // window.removeEventListener('resize', this.handleResize, false);
  }

  /**
   * 数据加载
   */
  handlegetData = (cid) => {
    const { getDetail } = this.props;
    getDetail({
      id: cid,
    });
  }

  render() {
    const {
      dataSource,
    } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;

    const detail = _.clone(dataSource || EMPTY_OBJECT, true);
    const contractName = detail.contractName;
    return (
      <div className="detail_box">
        <Form>
          <div className="inner">
            <div className="row_box">
              <Row gutter={18}>
                <Col span="24">
                  <div id="detail_module" className="module">
                    <div className="mod_header">
                      <h2 className="toogle_title">基本信息</h2>
                    </div>
                    <div className="mod_content">
                      <div className="wrap">
                        <strong className="name">合约名称：</strong>
                        <FormItem
                          hasFeedback
                        >
                          {getFieldDecorator(contractName, {
                            rules: [{ required: true, message: '请输入合约名称!', whitespace: true }],
                          })(
                            <Input style={{ width: 120 }} />,
                          )}
                        </FormItem>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}


/**
 * @Descripter: 添加单客户标签
 * @Author: K0170179
 * @Date: 2018/7/6
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Modal } from 'antd';
import _ from 'lodash';
import { SingleFilterWithSearch } from 'lego-react-filter/src';
import { emp } from '../../../../helper';
import CreateLabel from './CreateLabel';
import logable from '../../../../decorators/logable';
import { replaceKeyWord } from './SignCustomerLabel';
import styles from './addCustomerLabel.less';

const EMPTY_OBJ = {};
const ERROR_MSG = '请选择自定义标签';

export default class SignCustomerLabel extends PureComponent {
  static getDerivedStateFromProps(props, state) {
    const { preVisible } = state;
    const { visible } = props;

    if (visible !== preVisible) {
      return {
        visible,
        preVisible: visible,
      };
    }
    return null;
  }

  static propTypes = {
    currentPytMng: PropTypes.object.isRequired,
    custLikeLabel: PropTypes.array.isRequired,
    queryLikeLabelInfo: PropTypes.func.isRequired,
    signBatchCustLabels: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    condition: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    addLabel: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.selectLabel = EMPTY_OBJ;
    // 初始化加载数据
    this.queryLabelInfo();
    this.state = {
      labelValue: '',
      selectValue: '',
      // 控制定义标签的modal的打开和关闭
      visible: false,
      preVisible: props.visible,
      // 定义校验错误信息
      errorMsg: '',
      // 控制创建标签modal的变化
      createLabelVisible: false,
    };
  }

  @autobind
  @logable({
    type: 'ButtonClick',
    payload: {
      name: '提交',
      value: '多客户打标签',
    },
  })
  handleSubmitSignLabel() {
    const {
      signBatchCustLabels,
      currentPytMng,
      condition,
      location: {
        query: {
          selectAll,
          selectedIds,
        },
      },
    } = this.props;
    const { selectValue: { id } } = this.state;
    if (id) {
      const { ptyMngId } = currentPytMng;
      const payload = {
        labelIds: [id],
      };
      if (selectAll) {
        payload.queryCustsReq = condition;
      }
      if (selectedIds) {
        const custList = decodeURIComponent(selectedIds).split(',');
        const custIds = [];
        _.forEach(custList, (item) => {
          custIds.push(item.split('.')[0]);
        });
        payload.custIds = custIds;
      }
      signBatchCustLabels({
        ...payload,
        ptyMngId,
        orgId: emp.getOrgId(),
      }).then(this.handleCloseModal);
    } else {
      this.setState({
        errorMsg: ERROR_MSG,
      });
    }
  }

  @autobind
  handleCloseModal() {
    const { onClose } = this.props;
    this.setState({
      labelValue: '',
      selectValue: '',
      errorMsg: '',
    });
    onClose();
  }

  @autobind
  queryLabelInfo(labelName = '', callback = _.noop) {
    const { queryLikeLabelInfo } = this.props;
    queryLikeLabelInfo({
      labelNameLike: labelName,
      currentPage: 1,
      pageSize: 10,
    }).then(callback);
  }

  @autobind
  handleSearch(value) {
    this.queryLabelInfo(value, () => {
      this.setState({
        labelValue: value,
      });
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '多客户打标签',
      value: '$args[0].value',
    },
  })
  handleSelect({ value }) {
    const { labelName, labelTypeName } = value;
    const finalValue = {
      ...value,
      value: labelTypeName
        ? `${labelName}(${labelTypeName})`
        : labelName
        ,
    };
    this.setState({
      selectValue: finalValue,
      errorMsg: labelTypeName ? '' : ERROR_MSG,
    });
  }

  @autobind
  getOptionItemValue({ value }) {
    const { labelValue } = this.state;
    return (
      <div className={styles.labelItemWrap}>
        <div>{replaceKeyWord(value.labelName, labelValue)}</div>
        <div className={styles.labelType}>{value.createdOrgName}</div>
      </div>);
  }

  @autobind
  getSearchHeader() {
    const { custLikeLabel } = this.props;
    const { labelValue } = this.state;
    const currentLabel = _.find(
      custLikeLabel,
      labelItem =>
        labelItem.labelName === labelValue,
    );
    if (currentLabel) {
      return null;
    }
    const labelText = labelValue ? `"${labelValue}"` : '';
    return (<div
      className={styles.newLabel}
      onClick={this.handleCloseAddLabelModal}
    >
      {`+ 新建${labelText}标签`}
    </div>);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '关闭' } })
  handleCloseAddLabelModal() {
    this.setState({
      visible: false,
    });
  }

  @autobind
  handleOpenNewLabelModal() {
    const { visible } = this.props;
    if (visible) {
      this.setState({
        createLabelVisible: true,
      });
    }
  }

  @autobind
  handleCloseNewLabelModal(labelId) {
    if (labelId === '') {
      this.setState({
        createLabelVisible: false,
        labelValue: '',
        visible: true,
      });
    } else {
      this.queryLabelInfo('', () => {
        const { custLikeLabel } = this.props;
        const newLabel = _.find(custLikeLabel, { id: labelId });
        this.handleSelect({ value: newLabel });
        this.setState({
          createLabelVisible: false,
          labelValue: '',
          visible: true,
        });
      });
    }
  }
  render() {
    const { custLikeLabel, addLabel } = this.props;
    const { selectValue,
      errorMsg,
      createLabelVisible,
      visible,
      labelValue,
    } = this.state;

    return (
      <span>
        <Modal
          title="添加客户标签"
          width={650}
          visible={visible}
          wrapClassName={styles.signCustomerLabel}
          destroyOnClose
          maskClosable={false}
          onOk={this.handleSubmitSignLabel}
          onCancel={this.handleCloseModal}
          afterClose={this.handleOpenNewLabelModal}
        >
          <div className={styles.selectedInfo}>请为已选择客户选择或添加一个标签：</div>
          <SingleFilterWithSearch
            data={custLikeLabel}
            value={[selectValue]}
            className={styles.signSelect}
            dataMap={['id', 'labelName']}
            filterName="客户标签"
            defaultLabel="点此选择或添加标签"
            useCustomerFilter
            needItemObj
            getOptionItemValue={this.getOptionItemValue}
            onChange={this.handleSelect}
            onInputChange={this.handleSearch}
            searchHeader={this.getSearchHeader()}
            listStyle={{ maxHeight: 300 }}
            dropdownStyle={{ maxHeight: 424 }}
            defaultVisible={true}
          />
          {
            errorMsg ?
              <div className={styles.errorMsg}>{ errorMsg }</div> :
              null
          }
        </Modal>
        <CreateLabel
          visible={createLabelVisible}
          labelName={labelValue}
          addLabel={addLabel}
          closeModal={this.handleCloseNewLabelModal}
        />
      </span>
    );
  }
}

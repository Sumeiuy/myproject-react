import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import InfoTitle from '../common/InfoTitle';
import CommonUpload from '../common/biz/CommonUpload';
import style from './uploadFile.less';

export default class UploadFile extends PureComponent {
  static propTypes = {
    fileList: PropTypes.array,
  }

  static defaultProps = {
    fileList: [],
  }

  constructor() {
    super();
    this.state = {
      fileList: [],
    };
  }

  componentWillMount() {
    this.setState({ fileList: this.props.fileList });
  }

  render() {
    return (
      <div className={style.uploadFile}>
        <InfoTitle head="附件" />
        <CommonUpload fileList={this.state.fileList} />
      </div>
    );
  }
}

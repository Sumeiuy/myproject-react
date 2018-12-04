/*
 * @Author: sunweibin
 * @Date: 2018-12-03 17:02:32
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-03 17:15:59
 * @description 客户画像嵌入，使用iframe导入页面，因为客户画像也是一个Tab所以使用这种方式以保证与其他的Tab内容一致性
 */
import React from 'react';
import PropTypes from 'prop-types';

const custProfitUrl = '/yt/indexProfile.html#/custProfile?user_no=000000';

function Home(props) {
  const {
    location: {
      query: { custId },
    },
  } = props;
  const src = `${custProfitUrl}&brok_id=${custId}`;
  return (
    <iframe title={src} src={src} style={{ height: 'auto' }} />
  );
}

Home.propTypes = {
  location: PropTypes.object.isRequired,
};

export default Home;

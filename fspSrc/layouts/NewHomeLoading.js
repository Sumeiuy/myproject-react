/**
 * @file layouts/loading.js
 * 新框架下的loading
 * @author zhufeiyang
 */

import React from 'react';

function NewHomeLoading({ loading, forceFull }) {
  return (
    <div className="htsc-newIndex-loading-container">
      <div className="htsc-newIndex-content">
        <i className="htsc-newIndex-lego"></i>
        <span className="htsc-newIndex-title">理财服务平台</span>
        <div className="htsc-newIndex-img">
          <span className="htsc-newIndex-loading" />
          <span className="htsc-newIndex-loading-text">Loading...</span>
        </div>
      </div>
    </div>
  );
}

export default NewHomeLoading;

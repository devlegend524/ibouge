import React, { useState } from 'react';
import GeneralTab from './general'
import LocationTab from './location'
import { Link } from "react-router-dom";

import './styles.scss';

const AccountTab = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <>
      <ul className="nav nav-tabs">
        <li
          className={activeTab === 'general' ? 'active' : ''}
        >
          <Link to="" onClick={() => setActiveTab('general')}>General</Link>
        </li>
        <li
          className={activeTab === 'location' ? 'active' : ''}
        >
          <Link to="" onClick={() => setActiveTab('location')}>Location</Link>
        </li>
      </ul>

      <div className="tab-content">
        <div className={activeTab === 'general' ? 'tab-pane active' : 'tab-pane'}>
          <GeneralTab />
        </div>
        <div className={activeTab === 'location' ? 'tab-pane active' : 'tab-pane'}>
          <LocationTab />
        </div>
      </div>
    </>
  );
}

export default AccountTab;

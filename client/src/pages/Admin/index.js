import React from 'react';
import {Link} from 'react-router-dom';

import requireAdmin from '../../hoc/requireAdmin';
import Navbar from '../../components/Navbar';
import './styles.scss';

const Admin = () => {
  return (
    <>
      <Navbar title="Dashboard" />
      <div className="admin-page">
        <h1>Admin dashboard</h1>
        <p>
          This is the Admin page. Only the Admin can access this page. Return
          back to{' '}
          <Link className="bold" to="/">
            Home
          </Link>
        </p>
      </div>
    </>
  );
};

export default requireAdmin(Admin);

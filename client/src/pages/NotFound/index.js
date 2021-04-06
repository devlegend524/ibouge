import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { setTitle }  from '../../actions/commonAction'
import './styles.scss';

const NotFound = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setTitle('404'))
  }, [])
  return (
    <>
      <Navbar />
      <div className="not-found-page mt-58">
        <h1>Not Found 404</h1>
        <p>
          Go back to{' '}
          <Link className="bold" to="/">
            Home
          </Link>
        </p>
      </div>
    </>
  );
};

export default NotFound;

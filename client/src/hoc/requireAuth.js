import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router';

export default (ChildComponent) => {
  class ComposedComponent extends Component {
    // Our component just got rendered\\

    componentWillMount() {
      this.shouldNavigateAway();
    }
    componentDidMount() {
      this.shouldNavigateAway();
    }

    // Our component just got updated
    componentDidUpdate() {
      this.shouldNavigateAway();
    }

    //token ima auth nema, prepisi ga sa func component i useefect
    shouldNavigateAway() {
      if (!this.props.auth.isAuthenticated) {
        console.log('history push');
        this.props.history.push('/login');
      }
    }
    render() {
      return this.props.auth.isAuthenticated ? (
        <ChildComponent {...this.props} />
      ) : (
        <Redirect to="/login" />
      );
    }
  }

  function mapStateToProps(state) {
    return {auth: state.auth};
  }

  return connect(mapStateToProps)(ComposedComponent);
};

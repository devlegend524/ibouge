import { FACEBOOK_AUTH_LINK, GOOGLE_AUTH_LINK, TWITTER_AUTH_LINK } from '../../constants';
import './styles.scss';

const SocialAuth = () => {
  return (
    <div className="btn-group grp-width" role="group" aria-label="social media icons">
      <button
        onClick={() => window.location.href = FACEBOOK_AUTH_LINK}
        type="button"
        className="btn btn-default login-sm-fb"
      >
        <i className="fa fa-facebook" aria-hidden="true"></i>FACEBOOK
      </button>
      <button
        onClick={() => window.location.href = GOOGLE_AUTH_LINK}
        type="button"
        className="btn btn-default login-sm-g"
      >
        <i className="fa fa-google" aria-hidden="true"></i>GOOGLE
      </button>
      <button
        onClick={() => window.location.href = TWITTER_AUTH_LINK}
        type="button"
        className="btn btn-default login-sm-tw"
      >
        <i className="fa fa-twitter" aria-hidden="true"></i>TWITTER
      </button>
    </div>
  );
};

export default SocialAuth;

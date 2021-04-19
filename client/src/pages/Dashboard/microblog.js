import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import {Link} from 'react-router-dom';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import ImageCropper from '../../components/ImageCropper';
import {createMicroBlog} from '../../actions/microblogAction';
import {MapContainer, TileLayer} from 'react-leaflet';
import GeoCoder from '../../components/GeoCoder';
import 'leaflet/dist/leaflet.css';
import uploadPhoto from '../../assets/img/upload-photo.png';
import eventLog from '../../assets/img/event-icon.png';
import addPhoto from '../../assets/img/upload-photo-icon.png';
import './microblog.scss';

const MicroBlog = () => {
  const user = useSelector((state) => state.auth.sess);
  const blogs = useSelector((state) => state.blogs.blogs);
  const dispatch = useDispatch();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [newBlogImageUrl, setNewBlogImageUrl] = useState(uploadPhoto);
  const [microBlogName, setMicroBlogName] = useState('');
  const [coordinates, setCoordinates] = useState([]);
  const createNewMicroblog = () => {
    const data = {
      name: microBlogName,
      users: [],
      microblogImgFile: newBlogImageUrl,
      coordinates: coordinates,
      albumName: 'microblog-image',
    };
    dispatch(createMicroBlog(data));
    setOpen(false);
  };

  const openMicroblogFromList = (blog) => {
    console.log(blog);
    history.push('/');
  };

  const getMicroblogPic = (imgUrl) => {
    setNewBlogImageUrl(imgUrl);
  };
  const handleChangePic = () => {};
  const setMicroblogPic = () => {
    setCropperOpen(true);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleUpdateCity = (data) => {
    setCoordinates([data.geocode.center.lat, data.geocode.center.lng]);
  };
  return (
    <>
      <div className="user-event-box" style={{height: '300px'}}>
        <div style={{height: '18%'}}>
          <h4 className="event-box-heading">
            My Microblogs
            <a
              className="event-box-heading-add-event btnd"
              onClick={handleClickOpen}
              style={{cursor: 'pointer'}}
            >
              <i className="fa fa-plus" /> ADD NEW
            </a>
          </h4>
        </div>
        <div style={{height: '80%', width: '100%', overflowY: 'auto'}}>
          {blogs.map((myMicroblog, index) => (
            <div
              key={index}
              className="events-wrap-converse"
              style={{cursor: 'pointer'}}
              onClick={(e) => openMicroblogFromList(myMicroblog)}
              aria-hidden="true"
            >
              <div className="col-md-2 col-sm-2 col-xs-2 colPadZero">
                <img
                  src={
                    myMicroblog.microblogImage
                      ? myMicroblog.microblogImage
                      : eventLog
                  }
                  className="events-convers-img"
                  alt="events"
                />
              </div>
              <div className="col-md-9 col-sm-9 col-xs-9 colPadZero">
                <div className="event-heading-convers">
                  <span>{myMicroblog.name}</span>
                </div>
                <div className="event-sub-heading-convers">
                  {/* <span>on {myMicroblog.created_date | date: 'shortDate'}</span> */}
                </div>
              </div>
              <div className="col-md-1 col-sm-1 col-xs-1 colPadZero my-microblog-seperator-border">
                <Link to="" className="event-box-arrow-view-event">
                  <i className="fa fa-chevron-right" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="body"
        maxWidth="sm"
        fullWidth={true}
        aria-labelledby="alert-dialog-title"
      >
        <DialogContent>
          <div id="topHeader">
            <div id="topHeaderInnerDivForPicture">
              <img id="uploadPhoto" src={newBlogImageUrl} alt="microblog" />
              <img
                id="setMicroBlogPic"
                onClick={setMicroblogPic}
                src={addPhoto}
                alt="upload"
              />
            </div>
          </div>
          <div id="microBlogFormDiv">
            <form id="microBlogForm">
              <div className="form-group">
                <label className="group-name" id="new_microblogName">
                  Microblog Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputBox"
                  value={microBlogName}
                  onChange={(e) => setMicroBlogName(e.target.value)}
                />
              </div>
              <div id="mapContainer">
                <p>Add location: Search on map</p>
                <div id="microblogMap">
                  <MapContainer
                    style={{height: '300px', width: '100%'}}
                    zoom={9}
                    zoomControl={false}
                    center={user.location?.coordinates}
                  >
                    <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <GeoCoder handleSearch={handleUpdateCity} />
                  </MapContainer>
                </div>
              </div>
            </form>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={createNewMicroblog} color="primary">
            Save
          </Button>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <ImageCropper
        open={cropperOpen}
        setOpen={setCropperOpen}
        setImageUrl={getMicroblogPic}
        handleChangePic={handleChangePic}
      />
    </>
  );
};

export default MicroBlog;

import React, {useState, useCallback, useRef, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Button from '@material-ui/core/Button';
import profile_default_img from '../../assets/img/upload-photo.png';
import ReactCrop from 'react-image-crop';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {changeProfilePic} from '../../api/users';
import 'react-image-crop/dist/ReactCrop.css';
import './styles.scss';
const ImageCropper = (props) => {
  useEffect(() => {}, [props]);
  useEffect(() => {
    props.setOpen(props.open);
    return () => {
      props.setOpen(false);
    };
  }, [props]);
  const handleChangeImage = () => {
    uploadImage();
    handleClose();
    props?.handleChangePic();
  };
  const handleClose = () => {
    props.setOpen(false);
  };
  const [upImg, setUpImg] = useState(profile_default_img);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({unit: '%', width: 50, aspect: 16 / 16});
  const [completedCrop, setCompletedCrop] = useState(null);
  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
    props.setImageUrl(img.src);
  }, []);
  const uploadImage = (canvas, crop) => {
    if (!crop || !canvas) {
      return;
    }
    props.setOpen(false);
    canvas.toBlob(
      (blob) => {
        const previewUrl = window.URL.createObjectURL(blob);
        props.setImageUrl(previewUrl);

        // window.URL.revokeObjectURL(previewUrl);
      },
      'image/png',
      1
    );
  };
  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }
    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  }, [completedCrop]);
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        scroll="body"
        aria-labelledby="alert-dialog-title"
      >
        <DialogContent>
          <div>
            <input type="file" accept="image/*" onChange={onSelectFile} />
          </div>
          <div className="static_width">
            <ReactCrop
              src={upImg}
              onImageLoaded={onLoad}
              cropShape="round"
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
            />
          </div>
          <div className="text-center">
            <canvas
              ref={previewCanvasRef}
              // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
              style={{
                width: Math.round(completedCrop?.width ?? 0),
                height: Math.round(completedCrop?.height ?? 0),
              }}
            />
          </div>
          <DialogActions>
            <Button onClick={handleChangeImage} color="primary">
              Upload Image
            </Button>
            <Button autoFocus onClick={handleClose} color="default">
              Cancel
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageCropper;

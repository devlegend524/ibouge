import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Nabvar from "../../components/Navbar";
import { setTitle } from "../../actions/commonAction";

import "./styles.scss";

const CreateEvent = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setTitle("Create-Event"));
  }, []);
  return (
    <>
      <Nabvar />
      <div></div>
    </>
  );
};

export default CreateEvent;

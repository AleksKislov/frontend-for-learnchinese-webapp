import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../layout/Spinner";

const UserProfile = ({ match }) => {
  useEffect(() => {
    loadProfile(match.params.id);
  }, []);

  const [profile, setProfile] = useState(null);

  const loadProfile = async id => {
    try {
      const { data } = await axios.get("/api/profile/user/" + id);
      setProfile(data);
    } catch (err) {
      console.log(err);
    }
  };

  return profile ? (
    <div className='row'>
      <div className='col-md-1'>
        <img className='mr-3' src={`https:${profile.avatar}`} style={imgStyle} alt='Avatar' />
      </div>
      <div className='col-md-11'>
        <p>Пользователь: {profile.name}</p>
        <p>Роль: {profile.role || "изучающий"}</p>
        <p>ID пользователя: {profile._id}</p>
      </div>
    </div>
  ) : (
    <Spinner />
  );
};

const imgStyle = {
  width: "40px",
  borderRadius: "8px"
};

export default UserProfile;

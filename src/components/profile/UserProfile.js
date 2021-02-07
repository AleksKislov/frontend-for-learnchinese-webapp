import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../layout/Spinner";
import Tippy from "@tippyjs/react";

const UserProfile = ({ match }) => {
  useEffect(() => {
    loadProfile(match.params.id);
  }, []);

  const [profile, setProfile] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

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
        <p>
          <strong>Пользователь:</strong> {profile.name}
        </p>
        <p>
          <strong>Роль:</strong> {profile.role || "изучающий"}
        </p>
        <p>
          <strong>ID пользователя:</strong> {`@@${profile._id}@@`}{" "}
          <Tippy content={"Кнопка копирования ID"} placement='bottom'>
            <button
              className='btn btn-sm btn-primary'
              onClick={() => {
                setIsCopied(true);
                navigator.clipboard.writeText(`@@${profile._id}@@, `);
              }}
            >
              <i className='far fa-copy'></i>
            </button>
          </Tippy>{" "}
          {isCopied && <span className='text-danger'> Скопировано!</span>}
        </p>

        <div className='alert alert-dismissible alert-success'>
          По ID можно обращаться к пользователям в комментариях. Чтобы скопировать - нажмите кнопку
        </div>
      </div>
    </div>
  ) : (
    <Spinner />
  );
};

const imgStyle = {
  width: "60px",
  borderRadius: "8px"
};

export default UserProfile;

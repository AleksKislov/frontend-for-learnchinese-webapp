import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

const SetAvatar = ({ user }) => {
  useEffect(() => {
    getRandStr();
  }, []);

  const skinColors = [
    false,
    { rus: "загорелый", eng: "tanned" },
    { rus: "желтый", eng: "yellow" },
    { rus: "бледный", eng: "pale" },
    { rus: "светлый", eng: "light" },
    { rus: "коричневый", eng: "brown" },
    { rus: "темно-коричневый", eng: "darkBrown" },
    { rus: "черный", eng: "black" }
  ];

  const [str, setStr] = useState("example");
  const [filters, setFilters] = useState({
    skin: skinColors[0]
  });

  const getRandStr = () => {
    const symbols = "abcdefghijklmnopqrstuvwxyz0123456789";
    const randLength = Math.ceil(Math.random() * 10);
    let str = "";

    for (let i = 0; i < randLength; i++) {
      str += symbols[Math.floor(symbols.length * Math.random())];
    }

    setStr(str);
  };

  const selectSkin = e => {
    setFilters({
      ...filters,
      skin: skinColors[parseInt(e.target.options[e.target.options.selectedIndex].value)].eng
    });
  };

  return (
    <div className='row'>
      <div className='col-sm-1'>
        {user && <img src={`https://${user.avatar}`} alt='avatar' style={imgStyle} />}
      </div>
      <div className='col-sm-2'>
        <div className='btn btn-sm btn-outline-primary' onClick={getRandStr}>
          Рандомизировать
        </div>
      </div>
      <div className='col-sm-6'>
        <img
          src={`https://avatars.dicebear.com/api/avataaars/${str}.svg?${
            filters.skin ? "skin[]=" + filters.skin : ""
          }`}
          alt='pic'
        />
      </div>
      <div className='col-sm-3'>
        <form>
          <div className='form-group'>
            <label for='skin'>Цвет кожи</label>
            <select className='form-control' id='skin' onChange={e => selectSkin(e)}>
              <option defaultValue='0' value='0'>
                Случайно
              </option>
              {skinColors.map((color, ind) => {
                if (ind !== 0) return <option value={ind}>{color.rus}</option>;
              })}
            </select>
          </div>
        </form>
      </div>
    </div>
  );
};

const imgStyle = {
  width: "60px",
  borderRadius: "8px"
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, {})(SetAvatar);

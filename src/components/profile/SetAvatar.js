import React, { useEffect } from "react";
import { connect } from "react-redux";

const SetAvatar = ({ user }) => {
  return (
    <div className='row'>
      <div className='col-sm-1'>{user && <img src={`https://${user.avatar}`} alt='avatar' />}</div>
      <div className='col-sm-11'>
        <img src='https://avatars.dicebear.com/api/avataaars/therefor.svg' alt='pic' />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, {})(SetAvatar);

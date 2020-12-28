import React, { Fragment, useState, useEffect } from "react";
import TippyTooltip from "../translation/TippyTooltip";
import { v4 as uuid } from "uuid";
import Tippy from "@tippyjs/react";
import { countZnChars } from "../../actions/helpers";
import { connect } from "react-redux";
import { readToday, unreadToday } from "../../actions/auth";

const Paragraph = ({
  chunk,
  translation,
  hideFlag,
  index,
  originTxt,
  user,
  readToday,
  unreadToday,
  toEdit
}) => {
  const numOfChars = countZnChars(originTxt);
  const [alreadyRead, setAlreadyRead] = useState(false);

  useEffect(() => {
    if (user && !toEdit) {
      if (user.read_today_arr && user.read_today_arr[window.location.pathname]) {
        if (user.read_today_arr[window.location.pathname].includes(index)) setAlreadyRead(true);
      }
    }
  }, [user]);

  const readOrUnread = async () => {
    if (alreadyRead) {
      unreadToday({ num: numOfChars, path: window.location.pathname, ind: index });
    } else {
      readToday({ num: numOfChars, path: window.location.pathname, ind: index });
    }
    setAlreadyRead(!alreadyRead);
  };

  const paragraphNum = (
    <Tippy content='Параграф №'>
      <div className='paragraphNum'>{index + 1}</div>
    </Tippy>
  );

  const paragraphPlus = (
    <Tippy content={`Прочитано ${numOfChars} 字`}>
      <div
        className={`paragraphToRead paragraph-${alreadyRead ? "minus" : "plus"}`}
        onClick={() => readOrUnread()}
      >
        <i className={`fas fa-${alreadyRead ? "minus" : "plus"}-square`}></i>
      </div>
    </Tippy>
  );

  return (
    <Fragment>
      <div className={`result col-sm-${hideFlag ? "12" : "6"} my-1`}>
        <div
          className={`card border-primary ${alreadyRead && "alreadyRead"}`}
          style={{ height: "100%" }}
        >
          <p className='card-text textPadding'>
            {chunk.map(word => (
              <TippyTooltip word={word} key={uuid()} />
            ))}
          </p>
          {paragraphNum}
          {paragraphPlus}
        </div>
      </div>
      <div className='col-sm-6 my-1' style={hideFlag ? hidden : {}}>
        <div className='card border-primary' style={{ height: "100%" }}>
          <p className='card-text textPadding'>{translation}</p>
          {paragraphNum}
        </div>
      </div>
    </Fragment>
  );
};

const hidden = {
  display: "none"
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, { readToday, unreadToday })(Paragraph);

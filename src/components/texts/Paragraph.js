import React, { Fragment, useState } from "react";
import TippyTooltip from "../translation/TippyTooltip";
import { v4 as uuid } from "uuid";
import Tippy from "@tippyjs/react";
import { countZnChars } from "../../actions/helpers";

const Paragraph = ({ chunk, translation, hideFlag, index, originTxt }) => {
  const numOfChars = countZnChars(originTxt);
  const [alreadyRead, setAlreadyRead] = useState(false);

  const paragraphNum = (
    <Tippy content={<span>{"Параграф №"}</span>}>
      <div className='paragraphNum'>{index + 1}</div>
    </Tippy>
  );

  const paragraphPlus = (
    <Tippy content={<span>{`Прочитано ${numOfChars} 字`}</span>}>
      <div
        className={`paragraphToRead paragraph-${alreadyRead ? "minus" : "plus"}`}
        onClick={() => setAlreadyRead(!alreadyRead)}
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

export default Paragraph;

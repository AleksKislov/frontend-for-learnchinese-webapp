import React, { Fragment } from "react";
import TippyTooltip from "../translation/TippyTooltip";
import { v4 as uuid } from "uuid";

const Paragraph = ({ chunk, translation, hideFlag }) => {
  return (
    <Fragment>
      <div className={`result col-sm-${hideFlag ? "12" : "6"} my-1`}>
        <div className='card border-primary' style={{ height: "100%" }}>
          <p className='card-text textPadding'>
            {chunk.map(word => (
              <TippyTooltip word={word} key={uuid()} />
            ))}
          </p>
        </div>
      </div>
      <div className='col-sm-6 my-1' style={hideFlag ? hiddenStyle : {}}>
        <div className='card border-primary' style={{ height: "100%" }}>
          <p className='card-text textPadding'>{translation}</p>
        </div>
      </div>
    </Fragment>
  );
};

const hiddenStyle = {
  display: "none"
};

export default Paragraph;

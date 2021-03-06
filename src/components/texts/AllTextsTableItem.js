import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { textCategories } from "../../apikeys.json";
import { levelStars } from "../../actions/helpers.js";
import Tippy from "@tippyjs/react";
import { connect } from "react-redux";

const AllTextsTableItem = ({ text, hide, category, hideLevel, user, publisher }) => {
  const { _id, level, title, likes, hits, categoryInd, comments_id, name, date } = text;

  useEffect(() => {
    if (hide === 0) setHideId(false);
    if (hide === 1) setHideId(isRead(_id));
    if (hide === 2) setHideId(!isRead(_id));
    // console.log({ category, categoryInd });
    setRightCategory(category === 0 || category === categoryInd + 1);
    setRightLevel(hideLevel === 0 || level === hideLevel);
    setRightPublisher(publisher === "all" || publisher === name);
  }, [hide, category, hideLevel, publisher]);

  const isRead = textid => (user ? user.finished_texts.includes(textid) : false);
  const [hideIt, setHideId] = useState(false);
  const [rightCategory, setRightCategory] = useState(true);
  const [rightLevel, setRightLevel] = useState(true);
  const [rightPublisher, setRightPublisher] = useState(true);

  return (
    !hideIt &&
    rightCategory &&
    rightLevel &&
    rightPublisher && (
      <tr>
        <td>
          <small>{date.split("T")[0]}</small>
        </td>
        <td>{levelStars(level)}</td>
        <td className='text-left'>
          <Link to={`/texts/${_id}`}>{title}</Link>
        </td>
        <td>{textCategories[categoryInd]}</td>
        <td>
          <Link to={`/user/${text.user}`}>{name}</Link>
        </td>
        <Tippy content={`${likes.length} раз сказали спасибо`} placement='bottom'>
          <td>{likes.length}</td>
        </Tippy>
        <Tippy content={`${hits} просмотров`} placement='bottom'>
          <td>{hits}</td>
        </Tippy>
        <Tippy content={`${comments_id.length} комментариев`} placement='bottom'>
          <td>{comments_id.length}</td>
        </Tippy>
        {user && (
          <td style={{ paddingRight: "1.5rem" }}>
            <Tippy content={`${isRead(_id) && "Прочитано"}`} placement='bottom'>
              {isRead(_id) && <i className='fas fa-check-circle text-success'></i>}
            </Tippy>
          </td>
        )}
      </tr>
    )
  );
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, {})(AllTextsTableItem);

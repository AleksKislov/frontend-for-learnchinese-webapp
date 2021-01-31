import React from "react";
import { Link } from "react-router-dom";
import { textCategories } from "../../apikeys.json";
import { levelStars } from "../../actions/helpers.js";
import Tippy from "@tippyjs/react";

const AllTextsTableItem = ({ text }) => {
  const { _id, level, title, likes, hits, categoryInd, comments_id } = text;

  return (
    <tr>
      <td>{levelStars(level)}</td>
      <td className='text-left'>
        <Link to={`/texts/${_id}`}>{title}</Link>
      </td>
      <td>{textCategories[categoryInd]}</td>
      <Tippy content={`${likes.length} раз сказали спасибо`} placement='bottom'>
        <td>{likes.length}</td>
      </Tippy>
      <Tippy content={`${hits} просмотров`} placement='bottom'>
        <td>{hits}</td>
      </Tippy>
      <Tippy content={`${comments_id.length} комментариев`} placement='bottom'>
        <td>{comments_id.length}</td>
      </Tippy>
      <td>
        <i className='fas fa-check-circle text-success'></i>
      </td>
    </tr>
  );
};

export default AllTextsTableItem;

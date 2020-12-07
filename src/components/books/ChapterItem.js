import React from "react";
import { Link } from "react-router-dom";

const ChapterItem = ({ chapter, ind }) => {
  const {
    chineseTitle,
    russianTitle,
    id // chapter id
  } = chapter;

  const onClick = async e => {};

  return (
    <tr onClick={e => onClick(e)}>
      <td>{ind + 1}</td>
      <td>{chineseTitle}</td>
      <td>{russianTitle}</td>
    </tr>
  );
};

export default ChapterItem;

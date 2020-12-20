import React from "react";
import { Link } from "react-router-dom";

const ChapterItem = ({ chapter, ind, bookId }) => {
  const { chineseTitle, russianTitle, chapterId, length, pages } = chapter;

  const onClick = async e => {};

  // <td>{ind + 1}</td>
  return (
    <tr onClick={e => onClick(e)}>
      <td>{chineseTitle}</td>
      <td>
        <Link to={`/books/${bookId}/${chapterId}/0`}>{russianTitle}</Link>
      </td>
      <td>{length}</td>
      <td>
        {pages.map((page, pageInd) => (
          <Link to={`/books/${bookId}/${chapterId}/${pageInd}`}>
            <button type='button' class='btn btn-info btn-sm mx-1'>
              {pageInd + 1}
            </button>
          </Link>
        ))}
      </td>
    </tr>
  );
};

export default ChapterItem;

import React from "react";

const RatingItem = ({ user, ind }) => {
  const { num, userid, length, name } = user;

  let index;
  index = ind;
  if (ind === 1) index = "🥇";
  if (ind === 2) index = "🥈";
  if (ind === 3) index = "🥉";

  return (
    userid !== "5f301a8f0aa547478da68c18" && (
      <tr className={ind === 3 || ind === 1 || ind === 2 ? "font-weight-bold" : ""}>
        <td>{index}</td>
        <td className='text-left'>{name}</td>
        <td>{num}</td>
        <td>{length}</td>
      </tr>
    )
  );
};

export default RatingItem;

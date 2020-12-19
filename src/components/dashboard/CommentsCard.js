import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getLastComments } from "../../actions/posts";
import { Link } from "react-router-dom";

const CommentsCard = ({ getLastComments, comments, loading }) => {
  useEffect(() => {
    getLastComments();
  }, [getLastComments]);

  return (
    <div className=''>
      <h4 className=''>Последние 10 комментариев:</h4>
      <ul className='list-group'>
        {!loading &&
          comments.map(comment => (
            <Link
              to={`/${comment.destination}s/${comment.post_id}`}
              className='list-group-item list-group-item-action'
              key={comment._id}
            >
              <span className='text-info'>{comment.name}</span>
              <span className='badge badge-primary float-right mx-2'>{fromNow(comment.date)}</span>
              <p>{comment.text}</p>
            </Link>
          ))}
      </ul>
    </div>
  );
};

const fromNow = date => {
  const timestampNow = Date.now();
  const commentTimestamp = Date.parse(date);
  const seconds = parseInt((timestampNow - commentTimestamp) / 1000);
  const day = 3600 * 24; // seconds in a day
  // const month = 3600 * 24 * 30; // seconds in a month
  if (seconds < 60) {
    return seconds + " сек.";
  } else if (seconds >= 60 && seconds < 3600) {
    const minutes = parseInt(seconds / 60);
    return minutes + " мин.";
  } else if (seconds >= 3600 && seconds < day) {
    const hours = parseInt(seconds / 3600);
    return hours + " ч.";
  } else {
    // if(seconds >= day && seconds < month)
    const days = parseInt(seconds / day);
    return days + " дн.";
  }
};

const mapStateTioProps = state => ({
  comments: state.posts.lastComments,
  loading: state.posts.loading
});

export default connect(mapStateTioProps, { getLastComments })(CommentsCard);

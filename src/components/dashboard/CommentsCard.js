import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getLastComments } from "../../actions/posts";
import Moment from "moment";
import { Link } from "react-router-dom";

const CommentsCard = ({ getLastComments, comments, loading }) => {
  useEffect(() => {
    getLastComments();
  }, [getLastComments]);

  return (
    <div className=''>
      <h4 className=''>Последние Комментарии</h4>
      <ul className='list-group'>
        {!loading &&
          comments.map(comment => (
            <Link
              to={`/${comment.post_id ? `posts/${comment.post_id}` : ``}`}
              className='list-group-item list-group-item-action'
              key={comment._id}
            >
              <span className='text-info'>{comment.name}</span>
              <span className='badge badge-primary float-right mx-2'>
                {Moment(comment.date).fromNow()}
              </span>
              <p>{comment.text}</p>
            </Link>
          ))}
      </ul>
    </div>
  );
};

const mapStateTioProps = state => ({
  comments: state.posts.lastComments,
  loading: state.posts.loading
});

export default connect(mapStateTioProps, { getLastComments })(CommentsCard);

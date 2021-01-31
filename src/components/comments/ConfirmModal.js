import React, { useState } from "react";
import { deleteComment } from "../../actions/comments";
import { connect } from "react-redux";

const ConfirmModal = ({ deleteComment, commentToDelete }) => {
  const [state, setState] = useState(commentToDelete ? true : false);

  return (
    <div
      className='modal fade'
      id='confirmModal'
      tabIndex='-1'
      role='dialog'
      aria-labelledby='confirmModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-sm' role='document'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title' id='confirmModalLabel'>
              Точно?
            </h5>
            <button
              type='button'
              className='btn btn-outline-secondary btn-sm'
              data-dismiss='modal'
              aria-label='Close'
            >
              <i className='fas fa-times'></i>
            </button>
          </div>
          <div className='modal-body'>Подтвердите удаление</div>
          <div className='modal-footer'>
            <button
              disabled={state ? true : false}
              type='button'
              data-dismiss='modal'
              className='btn btn-danger btn-sm'
              onClick={e =>
                deleteComment(
                  commentToDelete.destination,
                  commentToDelete.post_id,
                  commentToDelete._id
                )
              }
            >
              Подтверждаю
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  commentToDelete: state.comments.commentToDelete
});

export default connect(mapStateToProps, { deleteComment })(ConfirmModal);

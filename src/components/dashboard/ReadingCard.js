import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Tippy from "@tippyjs/react";
import { setReadGoal } from "../../actions/auth";
import { setAlert } from "../../actions/alert";

const ReadingCard = ({ user, setReadGoal }) => {
  const [goal, setGoal] = useState(0);

  const onClick = async () => {
    const input = parseInt(document.getElementById("readingGoal").value);

    if (input) {
      setGoal(input);
      await setReadGoal(input);
    } else {
      setAlert("Введите только цифры", "danger");
    }
  };

  return (
    user && (
      <div className='card bg-light border-primary mb-3'>
        <div className='card-body'>
          <h4 className='card-title'>Чтение</h4>
          <p className='card-text'>
            <Tippy content='Прочитать иероглифов в день'>
              <span>
                <span className='text-muted'>Дневная цель:</span> {goal || user.daily_reading_goal}{" "}
                字
              </span>
            </Tippy>
          </p>

          {!user.daily_reading_goal && (
            <div className='form-group'>
              <label className='col-form-label col-form-label-sm'>
                Установить кол-во иероглифов, которые желательно прочитать за день
              </label>
              <div className='input-group mb-3'>
                <div className='input-group-prepend'>
                  <button className='btn btn-secondary' type='button' onClick={onClick}>
                    Установить
                  </button>
                </div>
                <input type='text' className='form-control' placeholder='Цифры' id='readingGoal' />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, { setReadGoal })(ReadingCard);

import React, { useState, useEffect } from "react";
import { parseRussian, shuffleArr } from "../../actions/helpers";
import { useInterval } from "../../actions/customHooks";

const TypingGame = ({ words }) => {
  const [shuffledWords, setShuffledWords] = useState(null);
  const [questionNum, setQuestionNum] = useState(1);
  const [start, setStart] = useState(false);
  useEffect(() => {
    setShuffledWords(shuffleArr(words).slice(0, 10));
  }, [words]);

  useEffect(() => {
    if (shuffledWords) setQuestion(shuffledWords[0]);
  }, [shuffledWords]);

  const [width, setWidth] = useState(0);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [wrong, setWrong] = useState(0);
  const [correct, setCorrect] = useState(0);

  useInterval(() => {
    if (start) {
      setWidth(width + 0.5);
      if (width >= 100) {
        setNewQuestion();
      }
    }
  }, 100);

  const setNewQuestion = () => {
    setWidth(0);
    setQuestion(shuffledWords[questionNum]);
    setQuestionNum(questionNum + 1);
  };

  useEffect(() => {
    if (questionNum > 10) setStart(false);
  }, [questionNum]);

  const checkIt = e => {
    if (e.key === "Enter") {
      if (answer === question.chinese) {
        setCorrect(correct + 1);
        setNewQuestion();
      } else {
        setWrong(wrong + 1);
      }
      setAnswer("");
    }
  };

  const setNewGame = () => {
    setWidth(0);
    setQuestionNum(0);
    setShuffledWords(shuffleArr(words).slice(0, 10));
    setQuestion(shuffledWords[0]);
  };

  return (
    shuffledWords && (
      <div className='card bg-light mb-3'>
        <div className='gameLines'>
          <div className='answerLineGreen answerLine' style={{ width: "100%" }}></div>
          <div className='answerLineRed answerLine' style={{ width: `${width}%` }}></div>
        </div>

        <div className='card-body'>
          <h4 className='card-title'>Мой Тест</h4>
          {start ? (
            <div className=''>
              <h6 className='card-subtitle mb-2'>Вопрос {questionNum}/10</h6>
              <p
                className='card-text text-sm'
                dangerouslySetInnerHTML={{ __html: question && parseRussian(question.translation) }}
              ></p>
              <input
                className='form-control form-control-sm'
                type='text'
                placeholder='ответ'
                id='answer'
                onChange={e => setAnswer(e.target.value)}
                value={answer}
                onKeyDown={e => checkIt(e)}
                autoComplete='off'
              />
              <label className='col-form-label col-form-label-sm' htmlFor='answer'>
                Верно: {correct}, ошибки: {wrong}
              </label>
            </div>
          ) : (
            <button className='btn btn-info' onClick={() => setStart(true)}>
              Старт
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default TypingGame;

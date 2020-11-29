import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { removeWord, loadLengths } from "../../actions/hskTable";
import { myAudioURL } from "../../apikeys.json";

const WordsItem = ({ removeWord, lexicon, loadLengths, hideFlag }) => {
  let { word_id, chinese, pinyin, translation, level } = lexicon;

  const onClick = e => {
    const tagName = e.target.tagName;

    if (tagName !== "BUTTON" && tagName !== "I") {
      removeWord(word_id);

      setTimeout(() => {
        loadLengths();
      }, 100);
    }
  };

  const playIt = (word_id, level) => {
    switch (level) {
      case 1:
        word_id = parseInt(word_id) - 1;
        break;
      case 2:
        word_id = parseInt(word_id) - 1 - 150;
        break;
      case 3:
        word_id = parseInt(word_id) - 1 - 300;
        break;
      case 4:
        word_id = parseInt(word_id) - 1 - 600;
        break;
      case 5:
        word_id = parseInt(word_id) - 1 - 1200;
        break;
      case 6:
        word_id = parseInt(word_id) - 1 - 2500;
        break;
      default:
        break;
    }

    new Audio(`${myAudioURL}hsk${level}/${word_id}.mp3`).play();
    return false;
  };

  return (
    <tr onClick={e => onClick(e)}>
      <td>{word_id}</td>
      <td>
        <h4>{!hideFlag.chinese && chinese}</h4>
      </td>
      <td>{!hideFlag.pinyin && pinyin}</td>
      <td>{!hideFlag.translation && translation}</td>
      <td>
        <button className='btn btn-info' onClick={() => playIt(word_id, level)}>
          <i className='fas fa-play'></i>
        </button>
      </td>
    </tr>
  );
};

WordsItem.propTypes = {
  lexicon: PropTypes.object.isRequired,
  removeWord: PropTypes.func.isRequired,
  loadLengths: PropTypes.func.isRequired
};

export default connect(null, { removeWord, loadLengths })(WordsItem);

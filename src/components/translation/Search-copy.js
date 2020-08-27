import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  puppeteerFunc,
  addWord,
  // removeWord,
  loadUserWords,
  loadUserWordsLen
} from "../../actions/userWords";
import "./style.css";
import HanziWriter from "hanzi-writer";
import Spinner from "../layout/Spinner";
import Tippy from "@tippyjs/react";

const Search = ({
  dictResponse,
  puppeteerFunc,
  loading,
  addWord,
  loadUserWords,
  loadUserWordsLen
}) => {
  useEffect(() => {
    const dictRefs = document.getElementsByClassName("dict-ref");

    [...dictRefs].forEach(el => {
      el.addEventListener("click", async e => {
        const showCharDiv = document.getElementById("showCharDiv");
        showCharDiv.innerHTML = "";
        const inputValue = e.currentTarget.innerHTML;

        if (/\p{Script=Han}/u.test(inputValue)) {
          for (let i = 0; i < inputValue.length; i++) {
            const writer = HanziWriter.create("showCharDiv", inputValue[i], {
              width: 60,
              height: 60,
              padding: 0,
              showOutline: true,
              radicalColor: "#168F16",
              delayBetweenLoops: 3000
            });
            writer.loopCharacterAnimation();
          }
        }

        await puppeteerFunc(inputValue);
      });
    });
  }, [dictResponse]);

  const [showMore, setShowMore] = useState(true);

  const onSubmit = async e => {
    e.preventDefault();
    const inputId = document.getElementById("searchInput");
    const inputValue = inputId.value;
    const showCharDiv = document.getElementById("showCharDiv");
    showCharDiv.innerHTML = "";

    if (/\p{Script=Han}/u.test(inputValue)) {
      for (let i = 0; i < inputValue.length; i++) {
        const writer = HanziWriter.create("showCharDiv", inputValue[i], {
          width: 60,
          height: 60,
          padding: 0,
          showOutline: true,
          radicalColor: "#168F16",
          delayBetweenLoops: 3000
        });
        writer.loopCharacterAnimation();
      }
    }

    inputId.value = "";
    await puppeteerFunc(inputValue);
  };

  const onClick = e => {
    const m3 = document.getElementsByClassName("m3");

    if (showMore) {
      [...m3].forEach(el => {
        el.classList.add("m3-hide");
      });
    } else {
      [...m3].forEach(el => {
        el.classList.remove("m3-hide");
      });
    }
    setShowMore(!showMore);
  };

  const updateVocabulary = word => {
    addWord(word);
    setTimeout(() => {
      loadUserWords();
      loadUserWordsLen();
    }, 100);
  };

  return (
    <Fragment>
      <div style={{ maxWidth: "500px", margin: "auto" }}>
        <form onSubmit={e => onSubmit(e)}>
          <div className='form-group'>
            <label className='control-label'>Input addons</label>
            <div className='form-group'>
              <div className='input-group mb-3'>
                <input type='text' className='form-control' id='searchInput' />
                <div className='input-group-append' id='searchButton'>
                  <button className='btn btn-primary' type='submit'>
                    <i className='fas fa-search'></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div id='showCharDiv'></div>

      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          {dictResponse && (
            <Tippy content={<span>Показать/скрыть примеры, если есть</span>}>
              <button
                className='btn btn-sm btn-warning'
                onClick={e => onClick(e)}
                id='showMoreButton'
              >
                {showMore ? "Меньше" : "Больше"}
              </button>
            </Tippy>
          )}
          <button className='btn btn-sm btn-info' onClick={e => updateVocabulary(e)}>
            {/** 
                    {clicked ? <i className='fas fa-minus'></i> : <i className='fas fa-plus'></i>}

          */}
            <i className='fas fa-plus'></i>
          </button>
          <div id='outputDiv' dangerouslySetInnerHTML={{ __html: dictResponse }}></div>
        </Fragment>
      )}
    </Fragment>
  );
};

Search.propTypes = {
  dictResponse: PropTypes.string
};

const mapStateToProps = state => ({
  dictResponse: state.userwords.dictResponse,
  loading: state.userwords.loading
});

export default connect(mapStateToProps, {
  puppeteerFunc,
  loadUserWords,
  loadUserWordsLen,
  addWord
})(Search);

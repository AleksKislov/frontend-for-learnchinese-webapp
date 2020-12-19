import React, { useEffect } from "react";
import { connect } from "react-redux";
import { loadTexts, clearText } from "../../actions/texts";
import Spinner from "../layout/Spinner";
import TextCard from "./TextCard";

const Texts = ({ loadTexts, texts, loading, clearText }) => {
  useEffect(() => {
    clearText();
    loadTexts();
  }, [loadTexts]);

  return (
    <div className='row'>
      <div className='col-md-3'>
        <div className='card bg-light mb-3'>
          <div className='card-body'>
            <p className='card-text'>
              Чтение текстов на китайском языке с параллельным переводом каждого параграфа, а также
              с буквальным переводом каждого слова (по клику).
            </p>
          </div>
        </div>
      </div>

      <div className='col-md-9'>
        <h2>Чтение Текстов</h2>

        {loading ? <Spinner /> : texts.map(text => <TextCard key={text._id} text={text} />)}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  texts: state.texts.texts,
  loading: state.texts.loading
});

export default connect(mapStateToProps, { loadTexts, clearText })(Texts);

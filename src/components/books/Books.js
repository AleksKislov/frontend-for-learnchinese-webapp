import React, { useEffect } from "react";
import { connect } from "react-redux";
import { loadBooks, clearBook } from "../../actions/books";
import BookCard from "./BookCard";
import Spinner from "../layout/Spinner";

const Books = ({ loadBooks, books, loading }) => {
  useEffect(() => {
    clearBook();
    loadBooks();
  }, [loadBooks]);

  return (
    <div className='row'>
      <div className='col-md-3'>
        <div className='card bg-light mb-3'>
          <div className='card-body'>
            <p className='card-text'>
              Чтение книг на китайском языке с параллельным переводом каждого параграфа, а также с
              буквальным переводом каждого слова (по клику).
            </p>
          </div>
        </div>
      </div>

      <div className='col-md-9'>
        <h2>Книги на китайском языке</h2>

        {loading ? <Spinner /> : books.map(book => <BookCard key={book._id} book={book} />)}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  books: state.books.books,
  loading: state.books.loading
});

export default connect(mapStateToProps, { loadBooks, clearBook })(Books);

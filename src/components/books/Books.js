import React, { useEffect, useState } from "react";
import BookCard from "./BookCard";
import Spinner from "../layout/Spinner";
import axios from "axios";

const Books = () => {
  useEffect(() => {
    loadBooks();
  }, []);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState(null);

  const loadBooks = async () => {
    try {
      const { data } = await axios.get("/api/books/allbooks");
      setBooks(data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
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

export default Books;

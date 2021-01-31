import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../layout/Spinner";
import Tippy from "@tippyjs/react";
import AllTextsTableItem from "./AllTextsTableItem";

const AllTextsTable = ({}) => {
  useEffect(() => {
    loadAllTexts();
  }, []);

  const [texts, setTexts] = useState(null);

  const loadAllTexts = async () => {
    try {
      const { data } = await axios.get("/api/texts");
      setTexts(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='row'>
      <div className='col-sm-3'>все тексы списком</div>

      <div className='col-sm-9'>
        <div className='table-responsive'>
          <table className='table table-hover text-center'>
            <thead>
              <tr className='table-info'>
                <th className=''>Уровень</th>
                <th className='text-left'>Название</th>
                <th>Категория</th>
                <Tippy content='Кол-во благодарностей' placement='bottom'>
                  <th>
                    <i className='fas fa-heart'></i>
                  </th>
                </Tippy>
                <Tippy content='Кол-во просмотров' placement='bottom'>
                  <th>
                    <i className='fas fa-eye'></i>
                  </th>
                </Tippy>
                <Tippy content='Кол-во комментариев' placement='bottom'>
                  <th>
                    <i className='fas fa-comment-dots'></i>
                  </th>
                </Tippy>
                <th>Прочитано</th>
              </tr>
            </thead>
            <tbody>
              {texts ? (
                texts.map(text => <AllTextsTableItem key={text._id} text={text} />)
              ) : (
                <tr>
                  <td colSpan='7'>
                    <Spinner />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllTextsTable;

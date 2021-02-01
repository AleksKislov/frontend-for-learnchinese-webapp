import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../layout/Spinner";
import Tippy from "@tippyjs/react";
import AllTextsTableItem from "./AllTextsTableItem";
import LevelFilter from "./common/LevelFilter";
import CategoryFilter from "./common/CategoryFilter";
import ReadFilter from "./common/ReadFilter";
import UnsetFiltersBtn from "./common/UnsetFiltersBtn";
import { Helmet } from "react-helmet";
import TextsInfoCard from "./common/TextsInfoCard";
import PleaseShareText from "./common/PleaseShareText";
import ReadingCard from "../dashboard/ReadingCard";

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

  const [categoryFlag, setCategoryFlag] = useState(0);
  const [hideReadFlag, setHideReadFlag] = useState(0);
  const [hideLevelFlag, setHideLevelFlag] = useState(0);
  const onLevelSelect = e =>
    setHideLevelFlag(parseInt(e.target.options[e.target.options.selectedIndex].value));

  const onReadSelect = e =>
    setHideReadFlag(parseInt(e.target.options[e.target.options.selectedIndex].value));

  const onCategorySelect = e => {
    setCategoryFlag(parseInt(e.target.options[e.target.options.selectedIndex].value));
  };

  const clearFilters = () => {
    setCategoryFlag(0);
    setHideReadFlag(0);
    setHideLevelFlag(0);
    document.getElementById("levelFilt").value = 0;
    document.getElementById("readFilt").value = 0;
    document.getElementById("categoryFilt").value = 0;
  };

  return (
    <div className='row'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Тексты на китайском языке с переводом | Chinese+</title>
      </Helmet>
      <div className='col-sm-3'>
        <TextsInfoCard text={"Все проверенные тексты Читалки единым списком"} />
        <PleaseShareText />
        <ReadingCard />
      </div>

      <div className='col-sm-9'>
        <h2>Тексты на китайском языке с переводом</h2>

        <div className='form-group row'>
          <LevelFilter onChange={onLevelSelect} />
          <ReadFilter onChange={onReadSelect} />
          <CategoryFilter onChange={onCategorySelect} />
          <UnsetFiltersBtn onClick={clearFilters} />
        </div>
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
                <Tippy content='Прочитано ли' placement='bottom'>
                  <th style={{ paddingRight: "1.5rem" }}>
                    <i className='fas fa-clipboard-check'></i>{" "}
                  </th>
                </Tippy>
              </tr>
            </thead>
            <tbody>
              {texts ? (
                texts.map(text => (
                  <AllTextsTableItem
                    key={text._id}
                    text={text}
                    hide={hideReadFlag}
                    category={categoryFlag}
                    hideLevel={hideLevelFlag}
                  />
                ))
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

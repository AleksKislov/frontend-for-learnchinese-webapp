import axios from "axios";
import { unsplash } from "../apikeys.json";
import React from "react";

/**
 *
 * @param {array} allwords
 * @param {array} wordsFromDB
 */
export const itirateWordsFromDB = (allwords, wordsFromDB) => {
  return allwords.map(word => {
    for (let i = 0; i < wordsFromDB.length; i++) {
      if (word === wordsFromDB[i].chinese) {
        return wordsFromDB[i];
      }
    }
    return word;
  });
};

export const chunkArrayFunc = arr => {
  // get indexes for \n in the array of words
  let inds = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === "\n") {
      inds.push(i);
    }
  }
  // console.log(inds);

  let chunkedArr = [];

  for (let i = 0; i < inds.length; i++) {
    if (i === 0) {
      chunkedArr.push(arr.slice(0, inds[i]));
    } else {
      chunkedArr.push(arr.slice(inds[i - 1] + 1, inds[i]));
    }
  }
  chunkedArr.push(arr.slice(inds[inds.length - 1] + 1));

  return chunkedArr;
};

export const getWords = async words => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  let res;
  try {
    res = await axios.post("/api/dictionary/allwords", words, config);
  } catch (err) {
    console.log(err);
  }
  return res.data;
};

/**
 * @param {Object} obj - text from texts or page in books
 */
export const parseChineseWords = async obj => {
  const wordsFromDB = await getWords(obj.chinese_arr);
  const newArr = itirateWordsFromDB(obj.chinese_arr, wordsFromDB);
  return chunkArrayFunc(newArr); // array of object arrays
};

export const segmenter = async text => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  let res;
  try {
    res = await axios.post("/api/dictionary/segmenter", { text }, config);
  } catch (err) {
    console.log(err);
  }
  return res.data;
};

export const getPhotos = async pic_theme => {
  const config = { headers: { Authorization: unsplash } };

  const photosDiv = document.getElementById("photosDiv");
  photosDiv.innerHTML = "";

  try {
    const { data } = await axios.get(
      `https://api.unsplash.com/search/photos?query=${pic_theme}&per_page=5&orientation=portrait`,
      config
    );

    // console.log(data.results[1].urls.small);

    data.results.forEach(el => {
      const img = document.createElement("img");
      img.src = el.urls.small;
      photosDiv.appendChild(img);
      img.classList.add("imgToChoose");
    });
  } catch (err) {
    console.log(err);
  }
};

export const numberToStr = num => {
  let arr = num.toString().split("");
  const length = arr.length;
  if (length < 4) {
    return arr.join("");
  } else {
    arr.splice(length - 3, 0, " ");
    return arr.join("");
  }
};

/**
 * for counting Chinese characters in Paragraph component
 * @param {string} str  - Chinese text
 * @returns {number}    - number of Chinese chars in str w/o spaces
 */
export const countZnChars = str => str.replaceAll(" ", "").length;

/**
 *
 * @param {string} href - window.location.href
 */
export const checkBaseUrl = href =>
  href.includes("localhost") ? "http://localhost:5000" : "https://www.chineseplus.club";

/**
 * @param {number} lvl -
 */
export const levelStars = lvl => {
  if (lvl === 3)
    return (
      <span className='text-warning'>
        <i className='fas fa-star'></i>
        <i className='fas fa-star'></i>
        <i className='fas fa-star'></i>
      </span>
    );
  if (lvl === 2)
    return (
      <span className='text-warning'>
        <i className='fas fa-star'></i>
        <i className='fas fa-star'></i>
      </span>
    );
  if (lvl === 1)
    return (
      <span className='text-warning'>
        <i className='fas fa-star'></i>
      </span>
    );
};

/**
 * for Analytics, Post, TextCard, Comment
 * @param {string} date
 * @param {boolean} onlyDate
 */
export const dateToStr = (date, onlyDate) => {
  const str = new Date(date);
  const options = { year: "numeric", month: "short", day: "numeric" };
  const rusDate = str.toLocaleDateString("ru-RU", options); // 22 авг. 2020 г.
  if (onlyDate) return rusDate;
  return `${rusDate}, ${date.slice(11, 16)}`;
};

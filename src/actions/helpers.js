import axios from "axios";
import { unsplash } from "../apikeys.json";

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

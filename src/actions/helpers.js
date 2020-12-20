import axios from "axios";

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
  // console.log(wordsFromDB);
  const newArr = obj.chinese_arr.map(word => {
    for (let i = 0; i < wordsFromDB.length; i++) {
      if (word === wordsFromDB[i].chinese) {
        return wordsFromDB[i];
      }
    }
    return word;
  });

  return chunkArrayFunc(newArr); // array of object arrays
};

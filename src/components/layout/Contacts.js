import React from "react";
import { Helmet } from "react-helmet";

const Contacts = () => {
  return (
    <div>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Связь с Chinese+</title>
      </Helmet>
      <h2>Пойти на Контакт</h2>
      <p>Телеграм: @sinokislov</p>
      <p>Почта: sinokislov@gmail.com</p>
      <p>
        Вы также можете просто писать здесь в Гостевой или в любом месте, где есть комментарии.
        <br />
        Любое сообщение с сайта сразу поступает в мой телеграм.
      </p>
      <p>
        Если хотите показать скриншот с багом, то лучше сразу в почту или телеграм писать. Спасибо!
      </p>
    </div>
  );
};

export default Contacts;

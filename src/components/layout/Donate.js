import React from "react";

const Contacts = () => {
  return (
    <div>
      <h2>Поддержать Проект</h2>
      <h5>1. Регулярное</h5>
      <p className=''>
        Лучше всего - поддерживать регулярно. Для этого удобно пользователься проверенным сервисом{" "}
        <a href='https://www.patreon.com/buyilehu' target='_blank'>
          Patreon
        </a>
      </p>

      <h5>2. Карта, СМС или Яндекс.Деньги</h5>
      <p>
        <iframe
          src='https://yoomoney.ru/quickpay/shop-widget?writer=seller&targets=%D0%9F%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%B0%D1%82%D1%8C%20Chinese%2B&targets-hint=&default-sum=&button-text=14&hint=&successURL=&quickpay=shop&account=41001889184273'
          width='423'
          height='222'
          frameborder='0'
          allowtransparency='true'
          scrolling='no'
        ></iframe>
      </p>

      <h5>3. </h5>
    </div>
  );
};

export default Contacts;

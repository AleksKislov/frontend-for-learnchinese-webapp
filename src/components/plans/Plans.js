import React, { useEffect } from "react";
import axios from "axios";

const Plans = ({}) => {
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const { data } = await axios.get("/api/plans");
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='row'>
      <div className='col-sm-12'>
        <h2>Канбан и Планы Проекта</h2>
      </div>
      <div className='col-sm-3'>
        <h5 className='text-center'>бэклог</h5>
      </div>
      <div className='col-sm-3'>
        <h5 className='text-center'>к выполнению</h5>
      </div>
      <div className='col-sm-3' style={{ backgroundColor: "#3498db" }}>
        <h5 className='text-center'>выполняется</h5>
      </div>
      <div className='col-sm-3' style={{ backgroundColor: "#18bc9c" }}>
        <h5 className='text-center'>выполнено</h5>

        <div className='card border-primary mb-3'>
          <div className='card-header'>UX для загрузки картинки</div>
          <div className='card-body'>
            <p className='card-text'>
              Some quick example text to build on the card title and make up the bulk of the card's
              content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;

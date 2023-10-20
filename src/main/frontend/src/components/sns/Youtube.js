/**
 * @author jeongyearim
 * @email [example@mail.com]
 * @create date 2023-10-20 11:17:37
 * @modify date 2023-10-20 11:17:43
 * @desc [description]
 */
import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import '../../assets/css/MainNews.css';

const Youtube = () => {
  return (
    <Carousel fade className="d-flex align-items-center" interval={5000} controls={false}>
      <Carousel.Item>
        <div className="d-flex flex-row ">
          <div className='text-start'>
            <p className='video-text-1'>
                First slide label
            </p>
            <p  className='video-text-2'>
                Description for the first video goes here.
            </p>
          </div>
          <iframe
           className='video'
            title="First Video"
            width="460"
            height="280"
            src="https://www.youtube.com/embed/nbYWT1QK6oo"
            frameBorder="0"
            allowFullScreen
          />
        </div>
        <Carousel.Caption>
          {/* Optional: You can add caption here */}
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <div className="d-flex flex-row">
          <div className='text-start'>
            <p className='video-text-1'>
                Second slide label
            </p>
            <p className='video-text-2'>
                Description for the second video goes here.
            </p>
          </div>
          <iframe
          className='video'
            title="Second Video"
            width="460"
            height="280"
            src="https://www.youtube.com/embed/XYEjbD3rf78"
            frameBorder="0"
            allowFullScreen
          />
        </div>
        <Carousel.Caption>
          {/* Optional: You can add caption here */}
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default Youtube;

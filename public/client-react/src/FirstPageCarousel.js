import Carousel from 'react-bootstrap/Carousel';

export function FirstPageCarousel(probs) {
    const  Carousel_list = [];
  
    for(let img of probs.images){
      Carousel_list.push(
        <Carousel.Item className="d-flex justify-content-center">
          <img
            className="d-block w-100"
            src={img.url}
            style={{objectFit:'contain', width: '100%', height: '100%'}}
          />
        </Carousel.Item>
      )
    }
  
  
    return (
      <Carousel className="d-flex justify-content-center" style={{width:'30rem'}} slide={false}>
        {Carousel_list}
      </Carousel>
    );
  }
  
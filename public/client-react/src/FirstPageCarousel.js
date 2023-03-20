import Carousel from 'react-bootstrap/Carousel';

export function FirstPageCarousel(probs) {
    const  Carousel_list = [];
  
    for(let img of probs.images){
      Carousel_list.push(
        <Carousel.Item style={{height: '25rem', width:'25rem'}}>
          <img
            className="d-block w-100"
            src={img.url}
            style={{objectFit:'contain', width: '100%', height: '100%'}}
          />
        </Carousel.Item>
      )
    }
  
  
    return (
      <Carousel slide={false}>
        {Carousel_list}
      </Carousel>
    );
  }
  
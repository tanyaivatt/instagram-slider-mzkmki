import React, { Component } from 'react';
import InstagramItem from './../components/InstagramItemV2';
import classNames from 'classnames';

export default class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSlide: 0,
      totalSlides: 0,
      slideStep: 1,
      interval: 8000
    }
    setInterval(() => {
      this.nextSlide();
    }, this.state.interval);
  }

  gotoSlide = (slideNo) => {
    this.updateSlidesTotal();
    const { currentSlide, totalSlides } = this.state;

    if (slideNo > totalSlides) {
      slideNo = 0;
    } else if (slideNo < 0) {
      slideNo = totalSlides;
    }
    this.setState({
      currentSlide: slideNo
    })
  }

  nextSlide = () => {
    const { currentSlide, slideStep } = this.state;
    this.gotoSlide(currentSlide + slideStep);
  }

  prevSlide = () => {
    const { currentSlide, slideStep } = this.state;
    this.gotoSlide(currentSlide - slideStep);
  }

  updateSlidesTotal = () => {
    const { slides } = this.props;
    this.setState({
      totalSlides: slides.length - 1
    })
  }
  componentDidMount() {
    this.updateSlidesTotal();
  }

  render() {
    const { slides } = this.props;
    const { currentSlide } = this.state;
    const allSlides = slides.map((slide, key) => (
      <div className={classNames('carousel__slide',
        { 'carousel__slide--current': key == currentSlide }
      )} key={key}>
        <InstagramItem {... slide} />
      </div>
    ))
    return (
      <div className="carousel">
        <div className="carousel__slides">
          {allSlides}
        </div>
        <div className="carousel__controls">
          <hr />
          total:{this.state.totalSlides}
          <br />
          current: {this.state.currentSlide}
          <button onClick={this.prevSlide} >{'<PREV'} </button>
          <button onClick={this.nextSlide} >NEXT> </button>
        </div>
      </div>
      );
  }
}
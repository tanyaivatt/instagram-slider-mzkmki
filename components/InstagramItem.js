import React, { Component } from 'react';
import store from 'store2';
import classNames from 'classnames';
import { distanceInWordsToNow } from 'date-fns'
import locale from 'date-fns/locale/pl';

const imagesStore = store.namespace('images');

export default class InstagramItem extends Component {

  render() {
    const { caption, id, imageUri, likes, date } = this.props;
    const now = new Date().getTime();
    const diferenceInSeconds = (1000 * 60 * 60 * 24 * 7); // one week
    const isNew = !!(date + diferenceInSeconds > now);

    const image = imagesStore(id) || imageUri || '';

    const userPhotoStyle = {
      backgroundImage: `url(${image})`
    }
    const mainPhotoStyle = {
      backgroundImage: `url(${image})`
    }

    const userName = '';
    const medium = (<div className="instagram-image" style={mainPhotoStyle}></div>);
    return (
      <div className={classNames('instagram-wrapper',
        { 'instagram-wrapper--new': isNew }
      )}
        data-instagram-id={id} >
        <div className="instagram-image-wrapper">
          {medium}
          <div className="image-caption">{caption}</div>
        </div>
        <div className="instagram-info clearfix">
          <div className="user-info">
            <div className="user-photo" style={userPhotoStyle} ></div>
            <div className="user-name">{userName}</div>
          </div>
          <div className="info-wrapper info-wrapper--likes">
            <div className="heart icon"></div>
            <span>{likes}</span>
          </div>
          <div className="info-wrapper time-wrap">
            <span>{distanceInWordsToNow(date, { locale })} temu</span>
          </div>
        </div>
      </div >
    );
  }
}

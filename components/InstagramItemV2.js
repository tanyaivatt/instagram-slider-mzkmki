import React, { Component } from 'react';
import store from 'store2';
import classNames from 'classnames';
import { distanceInWordsToNow } from 'date-fns'
import locale from 'date-fns/locale/pl';

const imagesStore = store.namespace('images');

export default class InstagramItem extends Component {

  render() {
    const { caption, id, imageUri, likes, date, userName, userPhoto } = this.props;
    const now = new Date().getTime();
    const diferenceInSeconds = (1000 * 60 * 60 * 24 * 7); // one week
    const isNew = !!(date + diferenceInSeconds > now);

    const image = imagesStore(id) || imageUri || '';
    const userLink = '';
    const formattedDate = distanceInWordsToNow(date, { locale });
    return (
      <article className={classNames('instagram-item',
        { 'instagram-item--new': isNew }
      )} key={id}>







        <header className="instagram-item__header">
          <a href={userLink} className="instagram-item__author">
            <img src={userPhoto} className="instagram-item__author-image" />
            <span className="instagram-item__author-name">{userName}</span>
          </a>
        </header>
        <figure className="instagram-item__figure">
          <img src={image} alt="" className="instagram-item__figure-image" />
          <figcaption className="instagram-item__figure-caption">{caption}</figcaption>
        </figure>
        <footer className="instagram-item__footer">
          <section className="instagram-item__footer-likes">
            <i className="heart icon"></i> {likes}
          </section>
          <section className="instagram-item__footer-date">
            <i className="clock icon"></i> {formattedDate}
          </section>
        </footer>
      </article>
    );
  }
}

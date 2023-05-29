import React, { Component } from 'react';
import { render } from 'react-dom';
import Carousel from './containers/Carousel';
import axios from 'axios';
import store from 'store2';
import syncRequest from 'sync-request';
import './style.scss';

const imagesStore = store.namespace('images');
const defaultStore = store.namespace('default');
const feedUri = `https://www.instagram.com/explore/locations/663072778/rynek-kawiarnia-galeria/?__a=1`;

class App extends Component {
  constructor() {
    super();
    const slides = defaultStore('slides') || [];
    this.state = {
      slides,
      downloading: false
    }
    
  }

  getUserDataByPostShortcode = (postShortcode) => {
    console.log(postShortcode);
    const url = `https://www.instagram.com/p/${postShortcode}/?__a=1` + '';
    const responnse = syncRequest('GET', url);    
    const data = JSON.parse(responnse.getBody());
    return data.graphql.shortcode_media.owner
  }

  parseData = (raw) => {
    const slides = raw.map(single => {
      const caption_node = single.node.edge_media_to_caption.edges;
      const userData = this.getUserDataByPostShortcode(single.node.shortcode);
      console.log(userData);
      return {
        caption: caption_node.length ? caption_node[0].node.text : '',
        id: single.node.id,
        owner: single.node.owner.id,
        imageUri: single.node.display_url,
        likes: single.node.edge_liked_by.count,
        date: single.node.taken_at_timestamp * 1000,
        ownerId: single.node.owner.id,
        userName: userData.full_name,
        userPhoto: userData.profile_pic_url
      }
    })

    defaultStore('slides', slides);
    return slides;
  }

  storeImage = (url, id) => {
    axios.get(url, { responseType: 'arraybuffer' })
      .then((response) => {
        let image = btoa(
          new Uint8Array(response.data)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        imagesStore(id, `data:${response.headers['content-type'].toLowerCase()};base64,${image}`);
      });
  }

  storeImages = () => {
    this.state.slides.map((slide) => {
      const {imageUri, id} = slide;
      if (!imagesStore(id)){
        this.storeImage(imageUri, id);
        console.log('stored', id);
      }      
    });
  }

  getFreshImages = () => {
    this.setState({downloading: true});
    axios.get(feedUri)
      .then(res => {

        console.log(res);
        const raw = res.data.graphql.location.edge_location_to_media.edges;
        const slides = this.parseData(raw);
        this.setState({ slides, downloading: false });
        this.storeImages();
      });
  }

  componentDidMount() {
    this.getFreshImages();
  }

  render() {
    const { slides } = this.state;
    return (
      <div>
        <Carousel slides={slides} />
        <span>{this.state.downloading ? 'pobieranie': 'ok'}</span>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));

import { Component } from 'react';
import { ImageGalleryItem } from './ImageGalleryItem';

export class ImageGallery extends Component {
  state = {
    images: null,
    error: null,
    status: 'idle',
  };

  componentDidUpdate(prevProps, prevState) {
    const userImageURL = 'https://pixabay.com/api/';
    const API_KEY = '28317670-7d33057fc4b50d7a50d831995';

    if (prevProps.inputValue !== this.props.inputValue) {
      this.setState({ status: 'pending' });
      fetch(
        `${userImageURL}?key=${API_KEY}&q=${this.props.inputValue}&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=12`
      )
        .then(respons => {
          if (respons.ok) {
            return respons.json();
          }

          return Promise.reject(
            new Error(`The image ${this.props.inputValue} not faund !!!`)
          );
        })
        .then(images => this.setState({ images, status: 'resolved' }))
        .catch(error => this.setState({ error, status: 'rejected' }));
    }
  }

  render() {
    const { images, error, status } = this.state;

    if (status === 'idle') {
      return <div>Enter name image!</div>;
    }

    if (status === 'pending') {
      return <div>Loading...</div>;
    }

    if (status === 'rejected') {
      return <h1>{error.massage}</h1>;
    }

    if (status === 'resolved') {
      return (
        <ul>
          {images.hits.map(({ id, webformatURL }) => (
            <li key={id}>
              <ImageGalleryItem webformatURL={webformatURL} />
            </li>
          ))}
        </ul>
      );
    }
  }
}

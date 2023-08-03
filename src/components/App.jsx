import { useState, useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PostsApiService from 'services/PostApiService';

import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from 'components/Button/Button';
import { Loader } from 'components/Loader/Loader';

import { AppContent } from './App.module';

const postApiService = new PostsApiService();

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryPage, setGalleryPage] = useState(1);
  const [totalHits, setTotalHits] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!searchQuery) return;

    const fetchGalleryItems = (query, page) => {
      setLoading(true);

      postApiService.query = query;
      postApiService.page = page;

      postApiService
        .fetchPost()
        .then(data => {
          const newData = data.hits.map(
            ({ id, tags, webformatURL, largeImageURL }) => ({
              id,
              tags,
              webformatURL,
              largeImageURL,
            })
          );

          setGalleryItems(prevGalleryItems => [
            ...prevGalleryItems,
            ...newData,
          ]);
          setTotalHits(data.totalHits);

          if (!data.totalHits) {
            setError(true);

            return toast.warn(
              'Sorry, there are no images matching your search query. Please try again.'
            );
          }

          if (page === 1) {
            toast.success(`Hooray! We found ${data.totalHits} images.`);
          }
        })
        .catch(error => {
          toast.error(error.message);
          setError(true);
          setGalleryItems([]);
          setTotalHits(0);
          setGalleryPage(1);
        })
        .finally(() => setLoading(false));
    };

    fetchGalleryItems(searchQuery, galleryPage);
  }, [searchQuery, galleryPage]);

  const handleFormSubmit = searchQuery => {
    setSearchQuery('');
    setGalleryItems([]);
    setTotalHits(0);
    setGalleryPage(1);
    setError(false);

    setSearchQuery(searchQuery);
  };

  const onLoadMore = () => {
    setGalleryPage(prevGalleryPage => prevGalleryPage + 1);
  };

  return (
    <AppContent>
      <Searchbar onSubmit={handleFormSubmit} />

      {error && <h2>Please, enter search word!</h2>}
      {!error && <ImageGallery galleryItems={galleryItems} />}
      {loading && <Loader />}
      {0 < galleryItems.length && galleryItems.length < totalHits && (
        <Button onClick={onLoadMore} />
      )}

      {/* Additions  */}
      <ToastContainer autoClose={3000} theme="dark" />
    </AppContent>
  );
};


// export class App extends Component {
//   state = {
//     searchQuery: ``,
//     galleryItems: [],
//     galleryPage: 1,

//     loading: false,
//     isButtonShow: false,
//     error: true,
//   };

//   componentDidUpdate(_, prevState) {
//     const prevQuery = prevState.searchQuery;
//     const nextQuery = this.state.searchQuery;
//     const prevPage = prevState.galleryPage;
//     const nextPage = this.state.galleryPage;

//     if (prevQuery !== nextQuery) {
//       this.setState({ galleryPage: 1, galleryItems: [], isButtonShow: false });
//       if (nextPage === 1) {
//         this.fetchGalleryItems(nextQuery, nextPage);
//       }
//     } else if (prevPage !== nextPage) {
//       this.fetchGalleryItems(nextQuery, nextPage);
//     }
//   }

//   fetchGalleryItems = (nextQuery, nextPage) => {
//     this.setState({ loading: true, error: false });

//     postApiService.query = nextQuery;
//     postApiService.page = nextPage;

//     postApiService.fetchPost().then(data => {
//       postApiService.hits = data.totalHits;

//       const newData = data.hits.map(
//         ({ id, tags, webformatURL, largeImageURL }) => ({
//           id,
//           tags,
//           webformatURL,
//           largeImageURL,
//         })
//       );
//       const currentData = [...this.state.galleryItems, ...newData];

//       this.setState(prevState => ({
//         galleryItems: [...prevState.galleryItems, ...newData],
//       }));

//       if (!data.totalHits) {
//         this.setState({ loading: false, error: true });
//         return toast.warn(
//           'Sorry, there are no images matching your search query. Please try again.'
//         );
//       }

//       if (currentData.length >= data.totalHits) {
//         this.setState({
//           loading: false,
//           isButtonShow: false,
//           error: false,
//         });
//         return;
//       }

//       if (nextPage === 1) {
//         toast.success(`Hooray! We found ${postApiService.hits} images.`);
//       }

//       this.setState({
//         loading: false,
//         isButtonShow: true,
//         error: false,
//       });
//     });
//   };

//   handleFormSubmit = searchQuery => {
//     this.setState({ searchQuery });
//   };

//   onLoadMore = () => {
//     this.setState(prevState => ({
//       galleryPage: prevState.galleryPage + 1,
//     }));
//   };

//   render() {
//     const { galleryItems, loading, isButtonShow, error } = this.state;

//     return (
//       <AppContent>
//         <Searchbar onSubmit={this.handleFormSubmit} />

//         {error && <h2>Please, enter search word!</h2>}
//         {!error && <ImageGallery galleryItems={galleryItems} />}
//         {loading && <Loader />}
//         {isButtonShow && <Button onClick={this.onLoadMore} />}

//         {/* Additions  */}
//         <ToastContainer autoClose={3000} theme="dark" />
//       </AppContent>
//     );
//   }
// }

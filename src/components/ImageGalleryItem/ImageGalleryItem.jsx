import { Modal } from 'components/Modal/Modal';
import { GalleryItem, GalleryImg } from './ImageGalleryItem.module';
import { useState } from 'react';
import PropTypes from 'prop-types';

export const ImageGalleryItem = ({
  galleryItem: { webformatURL, largeImageURL, tags },
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(isModalOpen => !isModalOpen);
  };

  return (
    <>
      <GalleryItem className="gallery-item" onClick={toggleModal}>
        <GalleryImg src={webformatURL} alt={tags} />
      </GalleryItem>
      {isModalOpen && (
        <Modal
          largeImageURL={largeImageURL}
          alt={tags}
          onCloseModal={toggleModal}
        />
      )}
    </>
  );
};

ImageGalleryItem.propTypes = {
  galleryItem: PropTypes.shape({
    webformatURL: PropTypes.string.isRequired,
    largeImageURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
  }).isRequired,
};
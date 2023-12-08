import React from 'react';
import Modal from 'react-modal';

// Modal.setAppElement('#__next');

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'black'
  },
  content: {
    maxWidth: '500px',
    height: '300px',
    margin: 'auto',
    padding: '20px',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
};

const Popup = ({ isOpen, onClose, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Popup"
      style={customStyles}
    >
      {children}
      {/* <button style={{color:'black'}} onClick={onClose}>Close</button> */}
    </Modal>
  );
};

export default Popup
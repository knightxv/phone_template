import React from 'react';

const Avatar = ({ src, ...props }) => {
  return (
    <img
      src={src || require('../assets/avatar.png')}
      style={{ width: '1rem', height: '1rem', borderRadius: '50%' }}
      {...props}
    />
  );
};

Avatar.propTypes = {
};

export default Avatar;

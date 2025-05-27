import PropTypes from "prop-types";

const Imagebackground = ({ src, alt, className }) => {
  return <img src={src} alt={alt} className={`w-full h-full object-cover ${className}`} />;
};

Imagebackground.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Imagebackground;
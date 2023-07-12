import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const PostContext = createContext();

export const PostContext_Provider = ({ children }) => {
  const [isPosted, setIsPosted] = useState(0);

  return (
    <PostContext.Provider value={{ isPosted, setIsPosted }}>
      {children}
    </PostContext.Provider>
  );
};

PostContext_Provider.propTypes = {
  children: PropTypes.node.isRequired,
};

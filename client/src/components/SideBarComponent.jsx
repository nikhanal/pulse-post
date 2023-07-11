import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { TiMessages } from "react-icons/ti";
import PropTypes from "prop-types";
import tw from "tailwind-styled-components";
import LogoWhite from "../assets/logos/PulsePost-logos_white.png";

const IconTextDiv = tw.div`
  flex items-center gap-3
`;

const LinkText = tw.span`
  hidden
  transition-all duration-100 ease-out
  font-semibold
  text-xs
  group-hover:block transition-all duration-100 ease-out
`;

export const SideBarComponent = ({ image }) => {
  return (
    <div
      className="group flex items-center justify-center fixed top-0 left-0 w-16 h-full bg-[#16181c] text-white overflow-hidden transition-all duration-100 
    ease-out hover:w-36"
    >
      <div className="flex flex-col justify-between h-[90%]">
        <Link to="/">
          <IconTextDiv>
            <img src={LogoWhite} className="w-6 h-6" />
            <LinkText>Pulse Post</LinkText>
          </IconTextDiv>
        </Link>
        <div className="flex flex-col gap-8">
          <Link to="/">
            <IconTextDiv>
              <AiOutlineHome className="w-6 h-8" />
              <LinkText>Home</LinkText>
            </IconTextDiv>
          </Link>
          <Link to="/search">
            <IconTextDiv>
              <BiSearch className="w-6 h-8" />
              <LinkText>Search</LinkText>
            </IconTextDiv>
          </Link>
          <Link to="/messge">
            <IconTextDiv>
              <TiMessages className="w-6 h-8" />
              <LinkText>Messages</LinkText>
            </IconTextDiv>
          </Link>
        </div>
        <div>
          <Link to="/login">
            <IconTextDiv>
              {image}
              <LinkText>Login</LinkText>
            </IconTextDiv>
          </Link>
        </div>
      </div>
    </div>
  );
};
SideBarComponent.propTypes = {
  image: PropTypes.any,
};

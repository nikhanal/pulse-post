import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const userId = localStorage.getItem('userid');
  
  useEffect(() => {
    // Only fetch unread messages if user is logged in
    if (userId) {
      fetchUnreadMessages();
      
      // Set up interval to check for new messages every 30 seconds
      const interval = setInterval(fetchUnreadMessages, 30000);
      
      return () => clearInterval(interval);
    }
  }, [userId]);
  
  const fetchUnreadMessages = async () => {
    try {
      const res = await fetch(`http://pulse-post.onrender.com/messages/unread/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error('Error fetching unread messages:', error);
    }
  };
  return (
    <div
      className="group flex items-center justify-center fixed top-auto bottom-0 left-0 w-full h-16 md:top-0 md:bottom-auto md:h-full md:w-16 bg-black text-white overflow-hidden transition-all duration-100 
    ease-out md:hover:w-36 z-10"
    >
      <div className="flex flex-row md:flex-col justify-between w-full md:h-[90%] px-4 md:px-0">
        <Link to="/">
          <IconTextDiv>
            <img src={LogoWhite} className="w-6 h-6" />
            <LinkText>Pulse Post</LinkText>
          </IconTextDiv>
        </Link>
        <div className="flex flex-row md:flex-col gap-8 md:gap-8">
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
          <Link to="/messages">
            <IconTextDiv className="relative">
              <TiMessages className="w-6 h-8" />
              {unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-[#1d9bf0] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>
              )}
              <LinkText>Messages {unreadCount > 0 && `(${unreadCount})`}</LinkText>
            </IconTextDiv>
          </Link>
        </div>
        <div>
          <IconTextDiv
            className=" cursor-pointer"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("name");
              localStorage.removeItem("username");
              navigate("/");
            }}
          >
            {image}
            <LinkText className="dropbtn">Logout</LinkText>
          </IconTextDiv>
        </div>
      </div>
    </div>
  );
};
SideBarComponent.propTypes = {
  image: PropTypes.any,
};

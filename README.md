# PulsePost

![PulsePost Logo](client/src/assets/logos/PulsePost-logos_white.png)

A modern social media platform with Twitter-like features including posts, comments, likes, and real-time messaging.

## Live Demo

[https://pulsepost.onrender.com](https://pulsepost.onrender.com)

## Features

- **User Authentication**: Secure login and registration system
- **Posts**: Create, view, edit, and delete posts with media support
- **Comments**: Add and delete comments on posts
- **Likes**: Like posts (with protection against multiple likes from the same user)
- **Real-time Messaging**: Private conversations between users
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices

## Tech Stack

### Frontend
- React.js
- Tailwind CSS with tailwind-styled-components
- Context API for state management
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads

## Project Structure

```
pulse-post/
├── client/                # Frontend React application
│   ├── public/            # Public assets
│   └── src/
│       ├── assets/        # Images, logos, etc.
│       ├── components/    # Reusable React components
│       ├── context/       # React Context providers
│       └── pages/         # Page components
└── server/                # Backend Node.js application
    ├── models/            # Mongoose models
    └── uploads/           # Uploaded media files
```

## Key Components

### Frontend

- **PostComponent**: Displays individual posts with like and comment functionality
- **CommentSectionComponent**: Handles comments on posts
- **MessagesPage**: Main interface for the messaging system
- **ConversationList**: Shows all conversations for the current user
- **MessageChat**: Displays and handles individual message conversations
- **SideBarComponent**: Navigation sidebar with unread message indicators

### Backend Models

- **User.js**: User account information
- **Post.js**: Post content, likes, and media references
- **Comment.js**: Comments on posts
- **Message.js**: Private messages between users

## API Endpoints

### Authentication
- `POST /login`: User login
- `POST /register`: User registration

### Posts
- `GET /getposts`: Retrieve all posts
- `POST /post`: Create a new post
- `POST /like`: Like a post
- `POST /delete`: Delete a post

### Comments
- `GET /comments/:postid`: Get comments for a post
- `POST /comment`: Add a comment
- `DELETE /comment/:commentid`: Delete a comment

### Messaging
- `GET /conversations/:userId`: Get all conversations for a user
- `GET /messages/:userId/:otherUserId`: Get messages between two users
- `GET /messages/unread/:userId`: Get count of unread messages
- `POST /message`: Send a new message

## Real-time Features

The application uses polling to implement real-time features:

- Message conversations update every 3 seconds
- Conversation list refreshes every 5 seconds
- Unread message count updates every 30 seconds

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Backend Setup

1. Navigate to the server directory:
   ```
   cd pulse-post/server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```
   cd pulse-post/client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Future Enhancements

- WebSockets for true real-time messaging
- Image optimization for faster loading
- Advanced user profiles
- Notifications system
- Search functionality

## License

MIT

## Contact

For questions or feedback, please open an issue on this repository.

---

Built with ❤️ by the PulsePost team

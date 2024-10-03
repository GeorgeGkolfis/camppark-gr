🏕️# CampPark Greece

**CampPark Greece** is a web-based application designed for campers and park-goers to discover
  and explore various camping sites. The project is built with a focus on user experience, 
  enabling users to search, review, and interact with different camping locations.

🌟## Features
🔍- **Search & Create Campsites**: Users can search for campsites and create their own.
🔑- **User Authentication**: Secure login and registration functionality(Strongly recommended for better overhaul experience).
⭐- **Reviews and Ratings**: Users can review and rate campsites.
🗺️- **Interactive Map**: Integrated with mapping services to visually explore campgrounds.

⚙️## Technologies Used
- **Backend**: Node.js, Express.js, Mongoose(Object Data Modeling)
- **Frontend**: JavaScript, EJS (Embedded JavaScript), CSS3
- **Database**: MongoDB(Atlas)
- **Styling**: Bootstrap5, Custom CSS3
- **Other Tools**:☁️ Cloudinary(image hosting),🗺️ Maptieler(creating and customizing maps),🚀 Render(deployment). 

📂## Project Structure
```├── cloudinary/            # Configures and manages Cloudinary image uploads```\
```├── controllers/           # Contains the logic for handling requests```\
```├── models/                # Mongoose schemas and models for MongoDB```\
```├── node_modules/          # Contains all npm packages and dependencies(You have to install it)```\
```├── public/                # Static assets such as CSS, JavaScript, and images```\
```├── routes/                # Defines all the routes for the application```\
```├── seeds/                 # Scripts for seeding the database with test data```\
```├── utils/                 # Utility functions and middlewares ```\
```├── views/                 # EJS templates for rendering HTML```\
```├── .env                   # Contains environment variables for configuration(You have to create it)```\
```├── .gitignore             # Specifies files and directories to be ignored by Git```\
```├── app.js                 # Main application file, initializes and runs the Express server```\
```├── middleware.js          # Contains custom middleware functions for request processing and authentication```\
```├── package-lock.json      # Locks the versions of installed npm packages to ensure consistent installations```\
```├── package.json           # Project metadata and dependencies```\
```├── README.md              # Project documentation (this file)```\
```└── schemas.js             # Defines Joi validation schemas for request data validation and sanitization```

🔑## Environment Variables
This project uses environment variables for configuration. Here’s an example of the variables required in the .env file:
```├──CLOUDINARY_CLOUD_NAME=your-cloudinary-name```\
```├──CLOUDINARY_KEY=your-api-key```\
```├──CLOUDINARY_SECRET=your-api-secret```\
```├──MAPTILER_API_KEY=your-api-key```\
```└──DB_URL=mongodb+srv://your-db-url```
Make sure to set these up before running the application.

🌐## Live Application
The **CampPark Greece** application is deployed and can be accessed at https://camppark-gr.onrender.com (contact me to make it live).

📧## Questions or Support
If you have any questions, need assistance, or would like to provide feedback, please feel free to contact me at [georgiosgolfis@gmail.com].

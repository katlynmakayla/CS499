# CS465


Architecture

I used two types of frontend development in this project. The customer site used Express with server-rendered HTML and JavaScript, which worked but was less interactive. The admin side uses an Angular single-page application (SPA), where components manage their own templates, styles, and logic. This makes the admin site easier to maintain and lets it update the page dynamically without full reloads. The backend uses a MongoDB NoSQL database because it can store flexible data like trips, bookings, and itineraries in a format that matches JSON, which the frontend and backend use to communicate.

Functionality

JSON is different from JavaScript because it is just a data format, not a programming language, but it works perfectly with JavaScript. JSON is used to send data between the frontend and backend. For example, when I get trip data from the API, it comes as JSON, and when I add or edit trips, I send JSON back to the server. I refactored parts of the app to make reusable Angular components for forms, tables, and confirmation screens. This made the code simpler, easier to update, and reduced repetition.

Testing

I tested the SPA by making GET, POST, PUT, and DELETE requests to the API in the browser and using Postman. I checked that trips were correctly added, edited, or deleted in the database. I also used console logging to watch the data being sent and received, which helped me catch problems. After adding admin login security, I tested authentication with mock credentials to make sure only logged-in users could access the admin features. This ensured the SPA and API were working together.

Reflection

This course helped me gain real experience building a full stack web application with the MEAN stack. I learned how to connect the frontend and backend, use JSON for data, build reusable UI components, and add security to an admin site. I also learned how to test my application and make sure it worked correctly. These skills have already helped improve my work as a software developer. Working on the Software Design Document helped me learn how best to showcase my work in software development to non-developers and businesses stakeholders. 

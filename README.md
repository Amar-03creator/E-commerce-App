MERN Stack E-commerce Application
This is a complete e-commerce website built with the MERN stack (MongoDB, Express, React, Node.js). It includes a storefront for customers and a dashboard for admins.
Live Website: https://e-commerce-app-chi-roan.vercel.app/
Key Features
User registration and login.
A full product catalog with search and filtering.
A functional shopping cart.
Checkout with PayPal.
An admin panel to manage products and orders.
Tech Stack
Frontend: React (Vite), Redux, Tailwind CSS
Backend: Node.js, Express.js, MongoDB
Deployment: The frontend is hosted on Vercel, and the backend is on Render.
How to Run This Project Locally
1. Clone the project
git clone [https://github.com/Amar-03creator/E-commerce-App.git](https://github.com/Amar-03creator/E-commerce-App.git)
cd E-commerce-App


2. Run the Backend
# Go to the backend folder
cd back-end

# Install packages
npm install

# Create a .env file and add your secret keys (like MONGO_URI)

# Start the server
npm run dev


3. Run the Frontend
# Go to the frontend folder
cd e-commerce

# Install packages
npm install

# Create a .env file with VITE_API_URL="http://localhost:5000"

# Start the app
npm run dev


Important Note on Deployment
The backend is hosted on Render's free plan, which goes to sleep after 15 minutes of inactivity. To keep the server awake 24/7, this project uses a free service called UptimeRobot to send a request every 5-10 minutes. This prevents the initial
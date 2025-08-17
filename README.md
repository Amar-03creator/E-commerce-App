MERN Stack E-commerce ApplicationThis is a complete e-commerce website built with the MERN stack (MongoDB, Express, React, Node.js). It includes a storefront for customers and a dashboard for admins.Live Website: https://e-commerce-app-chi-roan.vercel.app/Key FeaturesUser registration and login.A full product catalog with search and filtering.A functional shopping cart.Checkout with PayPal.An admin panel to manage products and orders.Tech StackFrontend: React (Vite), Redux, Tailwind CSSBackend: Node.js, Express.js, MongoDBDeployment: The frontend is hosted on Vercel, and the backend is on Render.How to Run This Project Locally1. Clone the projectgit clone [https://github.com/Amar-03creator/E-commerce-App.git](https://github.com/Amar-03creator/E-commerce-App.git)
cd E-commerce-App
2. Run the Backend# Go to the backend folder
cd back-end

# Install packages
npm install

# Create a .env file and add your secret keys (like MONGO_URI)
# Start the server
npm run dev
3. Run the Frontend# Go to the frontend folder
cd e-commerce

# Install packages
npm install

# Create a .env file with VITE_API_URL="http://localhost:5000"
# Start the app
npm run dev
Important Note on DeploymentThe backend is hosted on Render's free plan, which goes to sleep after 15 minutes of inactivity. To keep the server awake 24/7, this project uses a free service called UptimeRobot to send a request every 5-10 minutes. This prevents the initial loading delay.AuthorAmarnath NayakGitHub: @Amar-03creatorLinkedIn: amarnath-nayak-5783721b9

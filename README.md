# Joke App

This Joke App allows users to sign in with ZAPT and explore jokes. Users can view a list of jokes, generate jokes by interacting with external APIs, and add their own jokes to the shared database.

## User Journeys

### 1. Sign In

1. **Open the App:** When the user opens the app, they see a "Sign in with ZAPT" prompt above the authentication component.
2. **Learn More About ZAPT:** There's a link to the ZAPT marketing site (`https://www.zapt.ai`) that opens in a new tab.
3. **Authenticate:** The user can sign in using email and password or via social login providers like Google, Facebook, or Apple.
4. **Access Granted:** Upon successful authentication, the user is redirected to the home page of the app.

### 2. Viewing Jokes

1. **Joke List:** After signing in, the user is presented with a list of jokes fetched from the database.
2. **Infinite Scroll:** Users can scroll through the list to read all the jokes. More jokes load automatically as they scroll down.

### 3. Generating a Joke via API

1. **Generate Joke Button:** On the home page, there's a button labeled "Generate Joke from API".
2. **Trigger API Call:** When the user clicks the button, an external API is called to fetch a new joke.
3. **Loading State:** While fetching, the button displays a loading state to prevent multiple clicks.
4. **Display New Joke:** Once the joke is fetched, it's displayed prominently at the top of the page.

### 4. Adding a New Joke

1. **Access Form:** Below the generated joke, there's a form to submit a new joke.
2. **Input Joke Details:** The user enters the setup and punchline of their joke into the input fields.
3. **Submit Joke:** The user clicks the "Add Joke" button to submit their joke.
4. **Loading State:** The button shows a loading state to indicate the joke is being added.
5. **View Added Joke:** After the joke is successfully added, it appears at the top of the joke list.

### 5. Sign Out

1. **Sign Out Button:** There's a "Sign Out" button in the header.
2. **End Session:** Clicking this button signs the user out and redirects them back to the sign-in page.

## Features

- **Authentication:** Secure sign-in with ZAPT, including social login options.
- **View Jokes:** Browse through jokes with infinite scrolling for a seamless experience.
- **Generate Jokes:** Fetch jokes from an external API and display them in the app.
- **Add Jokes:** Users can contribute their own jokes to the shared database.
- **Responsive Design:** The app is optimized for all screen sizes, ensuring a pleasant user experience on mobile, tablet, and desktop devices.
- **User-friendly Interface:** Intuitive design with clear feedback during loading states and actions.

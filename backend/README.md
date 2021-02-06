# A great description of our project

Our app HelpWhoNeeds serves to establish a link between Vulnerable people who are shielding especially in these pandemic times and a Volunteer who will help them with their needs. SInce some may not like being referred to as Vuilnerable we will usen the label Requestee for them in this app and it's forms.
This app is a responsive SPA - you may view it on a variety of different devices such as laptop, phone or tablet. Once either user has registered themselves they will create a task list which will be picked up by a Volunteer in their vicinity (local area). The Volunteer can search and select tasks close to them within a certain distance. Requestee can have a preferred Volunteer also via their search. Once the Task is assigned an email notification will be sent to both users.
Registration uses Post Code lookup for address to default. Search is between 2 postcodes not addresses.
Volunteer can mark themselves Available or Unavailable with a toggle switch in their Profile Page. Profile Page can be used to update their details if they wish.
There is an inbuilt Admin user too for which Django functionality has been used.
We migrated our data from MySQL to Postgres as it had more extensions and better comaptibiity.
Our Cloud deployment is on AWS as host with EC2 server/instance running 24x7 which we connect to via APache webserver for http requests.
We have used Firebase for front end authentication after researching several options such as Amazon Amplify etc. Currently due to time limits there is no back end authentication.
Currently we have not used Cookies / session management due to the scope of this project.
In the About pages you will find information on User data, GDPR, Privacy & Term and Conditions.

Future Enhancements include but are not limited to:

Feedback rating for Volunteer Service
Feedback Rating for App - hease of use etc
Video/Voice Features

Django - Gelocation features & Rest Framework have been used

Rest APIs written


....................................
# Requirements

    A Windows, Mac or Linux computer, tablet or Android/iPhone
    NVM.
    NodeJS. Install using nvm: nvm install v10.17.0. Remember to add nvm use v10.17.0 to your preferred shell startup file.
    You may need to install npm globally npm install -g npm.
    It is recommended you restart your shell to ensure changes added the startup file are applied.

# Installation steps for Backend
1. Install Python (3.8+)
2. Navigate to backend folder
3. Create a virtual environment with a preferable name
4. Activate virtual environment
5. run `pip install -r requirements.txt`
6. run `python manage.py runserver`
7. go to 127.0.0.1:8000 in browser and enjoy our project

 # Installation steps for Frontend
1. $ npx create-react-app my-app
   $ cd my-app
2. $ npm start 
3.  Go to https://yourtechangels.github.io/helpwhoneeds/

# NPM scripts

# NPM will provide the following services:

    npm run test runs the RTL, Python & JS unit tests from the test/.. directory
    npm run build builds JS/CSS xxx, used on CI environment for building xxx
    npm run dev builds JS and CSS (with source maps).

# Developing
Clone the Repository

As usual, you get started by cloning the project to your local machine:

$ git clone <copiedlinkfromrepo>

Checkout the branch you are developing against

$ git checkout -b <new-branch>
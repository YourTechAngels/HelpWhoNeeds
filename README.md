# helpwhoneeds -

This is our app deployed to github pages:

https://yourtechangels.github.io/helpwhoneeds/

# HelpWHoNeeds Project

Our app HelpWhoNeeds serves to establish a link between Vulnerable people who are shielding especially in these pandemic times and a Volunteer who will help them with 
their needs. Since some may not like being referred to as "Vulnerable" we will using the label Requestee for them in this app and it's forms.
This app is a responsive SPA - you may view it on a variety of different devices such as laptop, phone or tablet. Once either user has registered themselves they will 
create a task list which will be picked up by a Volunteer in their vicinity (local area). The Volunteer can search and select tasks close to them within a certain distance. Requestee can have a preferred Volunteer also via their search. Once the Task is assigned an email notification will be sent to both users.
Registration uses Post Code lookup to auto-populate the relevant address fields. Search is between 2 postcodes not addresses. The Vulnerable can also select their preferred Volunteer within their locale.
Volunteer can mark themselves Available or Unavailable with a toggle switch in their Profile Page. Profile Page can be used to update their details if they wish.
There is an inbuilt Admin user too for which Django functionality has been used.
We migrated our data from MySQL to Postgres as it had more extensions and better comaptibiity.
Our Cloud deployment is on AWS as host with EC2 server/instance running 24x7 which we connect to via Apache webserver for http requests.
We have used Firebase for front end authentication after researching several options such as Amazon Amplify etc. 

In the About pages you will find information on User data, GDPR, Privacy & Term and Conditions.

Django - Gelocation features & Rest Framework have been used.

Future Enhancements include but are not limited to:

Feedback rating for Volunteer Service
Feedback Rating for App - hease of use etc
Video/Voice Features

# Todos
Todo list application built using Rails & React.

## Environment
The Rails API utilizes Ruby 3.3.5 and Rails 7. The React frontend requires NodeJS and was developed using Version 20. You should ensure you have these installed on your machine before attempting to run this project. There are idiomatic version files in each directory.

A Docker Compose stack is also utilized for local infrastructure and both the frontend and backend are deployed using Dockerfiles. It's expected that you have Docker installed on your machine.

## Development
#### Run the Server
1. Clone the repo
2. Navigate to backend directory `cd ./todos/backend`
3. Copy example .env file `.example.env .env`
4. Ensure environment variables are exported. I like [direnv](https://direnv.net/)
5. Stand up your local infrastructure (Postgres) `docker-compose up -d`
6. Run a Bundle install `bundle install`
7. Run DB Migrations `rails db:migrate`
8. Start the Rails server `rails s`

## Run the Client
8. In a new terminal navigate to the `frontend` directory `cd ./todos/frontend`
9. Install dependencies `npm install`
10. Start the client `npm run dev`

If all went well, you should be presented with a localhost address which you can navigate to and begin developing on the app.

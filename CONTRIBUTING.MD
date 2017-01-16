# Run Locally and test achievements

To test your achievements locally, you need do the following:

## prerequisites

1. Create a dummy `MongoDB` database. You can use https://mlab.com/ to create one in the cloud.
>If you're using `mlab`, you need to create a database, and then create a database user.
After creating a database, click on Users**-->**Add database user
![Users-->Add database user](/screenshots/create-db-user.png)
Now, go to your database homepage, and copy the database url. you need to enter your database username and password (**NOT YOUR MLAB ACCOUNT!**)
![mongodb url](/screenshots/mongodb-url.png)

2. Create an account at https://ngrok.com/ so you can connect your local server to a **GitHub Repository**
> you'll need the **ngrok token**:
![ngrok token](/screenshots/ngrok-token.png)

## quick start

1. clone achievibit locally (we prefer using [ungit](https://github.com/FredrikNoren/ungit)
2. run `npm install` to install all dependencies
3. run the following command, replacing all the urls we got in the **prerequisites** step `node index.js --databaseUrl "<mongodb-url>" --ngrokToken "<ngrok-token>"`
4. if everything worked, you should see the `achievibit` logo, and an ngrok url under it.
5. follow the instructions in the [`README.MD`](/README.MD) file to connect a test repository to your local achievibit (replace the url with your ngrok url). Make sure **Content type** is set to **application\json**
> ![connect repo](/screenshots/connect-to-repo.png)
6. check that the achievement works on your database (your user got your achievement on your test repository).
if your achievement requires interaction with another user, talk to one of the developers and we'll help test it (reviewing a test pull request, etc.).

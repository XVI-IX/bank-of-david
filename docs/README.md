# Bank of David

This is a Psuedo Bank application.

## Setting up the app

### Install Dependcies
1. NodeJs - Follow inStructions to install the lastest version of NodeJs for your platform in the [nodejs docs](https://nodejs.org/en/download)

2. npm dependencies - Once nodejs is installed, install the required dependencies by going to the root of the directory and run:
```bash
npm install
```
running this installs the dependencies needed for the app.

#### Key Dependencies

- [Express](https://expressjs.com/): Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

- [Mongoose](https://mongoosejs.com/): Mongoose is an elegant mongodb object modeling for node.js

- [Dotenv](https://www.npmjs.com/package/dotenv): Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology.

### Environment Variables
To run the app a `.env` file needs to be created containing important environment variables. In the root of the directory create a `.env` file.
This file must contain:
* [FLW_PUBLIC_KEY](https://developer.flutterwave.com/docs/integration-guides/authentication/) - Public key for flutterwave authentication
* [FLW_SECRET_KEY](https://developer.flutterwave.com/docs/integration-guides/authentication/) - Secret key for flutterwave authentication
* [MONGO_URI](https://www.mongodb.com/docs/manual/reference/connection-String/) - URI to connect your app to your MongoDB
* [NUMBERVERIFY](https://numverify.com/) - Number Validation
* PORT - Port on which the app should run, 3000 is recommended
* [SECRET](https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx) - Secret to generate JWT
* SPAN - Time span before expiration of JWT
* REDIS_URL - Connection to redis instance if available

### The Database
The database for this project has five models
1. **`Customer`** - This is a representation of every customer that patronizes the application. This model has fields:
    * **`firstName (Str)`** - Customer's first name
    * **`middleName (Str)`** - Customer's middle name, this is **optional**
    * **`lastName (Str)`** - Customer's last name
    * **`dob (Date)`** - Customer's date of birth
    * **`address (Str)`** - Customer's home address
    * **`age (Number)`** - Customer's age. When this is not provided, the field is calculated from the customer's date of birth.
    * **`email (Str)`** - Customer's email. This field is validated to confirm if email provided matches email patterns
    * **`password (Str)`** - Customer's password, the password is automatically hashed using the SECRET provided in your **`.env`** file
    * **`createdAt (Date)`** - Date the customer's account is created.
    * **`modifiedAt (Date)`** - Date the customer's data was last modified.
    * **`userName (Str)`** - Customer's username, if not provided a username is generated using the first and lastname. This **`must be unique`**
    * **`phoneNumber (Number)`** - Customer's phone number, this is also validated to check if the number actually exists.
    * **`bvn`** - Bank verification number
    * **`postalCode`** - Literally, the postal code

2. **`Account`** - This is a representation of a customer's account. This model has fields:
    * **`customerId`** - Thos is a reference to the id of the customer that owns this account
    * **`accountName (Str)`** - This is the name assigned to the account, it defaults to the first and last name of the customer.
    * **`accountNumber`** - This is to represent the account number, this is a fake number actually.
    * **`balance`** - Customer's account balance.
    * **`currency`** - The account's currency
    * **`createdAt`** - Date of account creation
    * **`modifiedAt`** - last date of account modification.

    An account is automatically created the moment a user signs up
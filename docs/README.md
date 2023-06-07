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
#### **`Customer`** 
  This is a representation of every customer that patronizes the application. This model has fields:
  * **`firstName (Str)`** - Customer"s first name
  * **`middleName (Str)`** - Customer"s middle name, this is **optional**
  * **`lastName (Str)`** - Customer"s last name
  * **`dob (Date)`** - Customer"s date of birth
  * **`address (Str)`** - Customer"s home address
  * **`age (Number)`** - Customer"s age. When this is not provided, the field is calculated from the customer"s date of birth.
  * **`email (Str)`** - Customer"s email. This field is validated to confirm if email provided matches email patterns
  * **`password (Str)`** - Customer"s password, the password is automatically hashed using the SECRET provided in your **`.env`** file
  * **`createdAt (Date)`** - Date the customer"s account is created.
  * **`modifiedAt (Date)`** - Date the customer"s data was last modified.
  * **`userName (Str)`** - Customer"s username, if not provided a username is generated using the first and lastname. This **`must be unique`**
  * **`phoneNumber (Number)`** - Customer"s phone number, this is also validated to check if the number actually exists.
  * **`bvn`** - Bank verification number
  * **`postalCode`** - Literally, the postal code

#### **`Account`**
This is a representation of a customer"s account. This model has fields:
  * **`customerId`** - Thos is a reference to the id of the customer that owns this account
  * **`accountName (Str)`** - This is the name assigned to the account, it defaults to the first and last name of the customer.
  * **`accountNumber`** - This is to represent the account number, this is a fake number actually.
  * **`balance`** - Customer"s account balance.
  * **`currency`** - The account"s currency
  * **`createdAt`** - Date of account creation
  * **`modifiedAt`** - last date of account modification.

    An account is automatically created the moment a user signs up

#### **`Cards`**
This a representation of a card linked to an account. This model has fields:
  * **`accountId`** - This is a reference to the id of the account that owns this card.
  * **`cardNumber`** - A valid card number, this field is validated.
  * **`displayString`** - This is to display only the last 4 digits of the card.
  * **`cardProvider`** - represents the card provider
  * **`cvv`** - stores the cvv of the card, this is hashed
  * **`date`** - Card expiry date.

#### **`Transactions`**
This stores the transactions processed through this application
  * **`accountId`** - This is a reference to the id of the account that made transaction
  * **`date`** - Date the transaction was made
  * **`amount`** - amount transacted
  * **`transType`** - Type of transaction, credit and debit
  * **`accountNumber`** - Account number from which transaction was recorded.
  * **`bankCode`** - Bank code for recieving bank
  * **`fullName`** - Full name of recieving account
  * **`description`** - Description of transaction
  * **`fees`** - fees charged on the transaction
  * **`reference`** - reference code for transaction
  * **`bankName`** - Bank name for recieving banks

## Endpoints

**Base URL**: `127.0.0.1:3000/api/v1`

### Authentication Endpoints
`POST /auth/signup`
* Register new customer
* **Request arguments**: customer details
```JSON
{
  "firstName": "John",
  "middleName": "Smith",
  "lastName": "Doe",
  "dob": "22-10-23",
  "address": "xxxxxxxxxx",
  "phoneNumber": "+23490101920",
  "bvn": "xxxxxxxxxxxx",
  "postalCode": "xxxxx",
  "email": "xxxxxxxx@xxxx.xxx",
  "password": "xxxxxxxx"
}
```
* **Return**: User authorization.

`POST /auth/login`
* Log in user if credentials found
* **Request arguments**: email and password
```JSON
{
  "email": "xxxxxxxx@xxxx.xxx",
  "password": "xxxxxxxx"
}
```
* **Return**: User authorization.

### Other Endpoints

#### `GET /`

* Fetches the profile of authenticated customer
* **Request arguments**: None
* Returns: JSON Object containing user profile information
```JSON
{
  "_id":{"$oid":"645516cc46779324a4e929ae"},"firstName":"David-Daniel",
  "middleName":"Oluwaponmile",
  "lastName":"Ojebiyi",
  "dob":{"$date":{"$numberLong":"10"}},
  "address":"None of your business",
  "email":"oladoja14@gmail.com",
  "password":"$2a$10$j/hiQVoJH1zUHm3z3XKAJehxQRK6.LrtiN9yV0YwjIg.RSiUBIVc.",
  "createdAt":{"$date":{"$numberLong":"1683297874224"}},"modifiedAt":{"$date":{"$numberLong":"1683297874224"}},"userName":"xviix",
  "phoneNumber":"+23490xxxxxxx2",
  "bvn":"$2a$10$j/hiQVoJH1zUHm3z3XKAJeOMvaaW41yACjnqxZ8i6Vq2vbx9dCkQu","postalCode":{"$numberInt":"1910991"},
  "age":{"$numberInt":"22"},
  "__v":{"$numberInt":"0"}}
```

#### `GET /balance`
* Fetches the account balance of customer
* **Request arguments**: None
* **Returns**: JSON object containing the account balance
```JSON
{
  balance: 0.00
}
```

#### `PATCH /`
* Update Customer data
* **Request arguments**: 
```JSON
{
  "phoneNumber": "+234567890",
  "email": "xxxxxxxxx@xxxx.xxxx"
}
```
* **Returns**: JSON object containing success message
```JSON
{
  "msg": "Profile updated",
  "success": true
}
```

#### `GET account/`
* Fetches all the accounts owned by user in session
* **Request Arguments:** None
* **Returns**:

```JSON
  {
    "_id": "645516cd46779324a4e929b",
    "customerId": "645516cc46779324a4e929ae",
    "accountName": "David-Daniel Ojebiyi",
    "accountNumber": 6729442601,
    "balance": 0,
    "currency":  "NGN",
    "createdAt": "2023-05-05T14:44:36.733+00:00",
    "modifiedAt": "2023-05-05T14:44:36.733+00:00"
  }
```

#### `POST account/`
* Adds a new account for the user in session.
* **Request Arguments**: 
```JSON
{
  "accountNumber": 6874837281,
  "currency": "NGN"
}
```
* **Returns**: 
```JSON
{
  "msg": "Account added successfully",
  "success": true
}
```

#### `POST account/:accountId/send`
* Sends money from account to specified reciever.
* **Request Arguments**:
```JSON
{
  "amount": 100,
  "accountNumber": 6874837281,
  "account_bank": "First Bank",
  "narration": "Documentation funds"
}
```

#### `POST account/:accountId/schedule`
* Schedules a transaction
* **Request Arguments**:
```JSON
{
  "schedule_name": "Tola's Allowance",
  "schedule_date": "2023-05-05T14:44:36.733+00:00", 
  "amount": 10000,
  "accountNumber": 6874837281, 
  "bankCode": 044,
  "fullName": "Omotolani Ojo", 
  "bankName": "Access Bank",
  "frequency": "Monthly"
}
```
* **Returns**: 
```JSON
{
  "success": true,
  "msg": "Schedule created successfully",
  "data": {
    "schedule_name": "Tola's Allowance",
    "frequency": "Monthly",
    "amount": 10000,
    "accountNumber": 6874837281
  }
    }
```

#### `GET account/:accountId/schedule`
* Fetches all schedules made on the account by user in session
* **Request Arguments**: None
* **Returns**: 
```JSON
{
  "schedule_name",
  "accountId",
  "customerId",
  "schedule_date",
  "amount",
  "bankCode",
  "accountNumber",
  "bankName",
  "fullName",
  "frequency"
}
```
# Admin UI

This project is a React app for managing user data. It allows you to view, filter, edit, delete, and select users from a list fetched from the provided Users API.

## Getting Started

These instructions will help you set up and run the project on your local machine.

### Prerequisites

Before running the app, ensure you have [Node.js](https://nodejs.org/) installed on your system.

### Installation

1. Clone this repository to your local machine:

```bash
git clone <repository_url>
```

2. Navigate to the project directory:

```bash
cd admin-ui
```

3. Install the required dependencies:

```bash
npm install
```

## Usage

To run the app in development mode, use the following command:

```bash
npm start
```

The app will be available at http://localhost:3000 in your browser. The page will automatically reload when you make changes.

## Features

The app includes the following features based on the provided requirements:

1. Column titles stand out from the entries.
2. A search bar allows filtering users based on properties.
3. Editing and deleting a row in memory.
4. Pagination with navigation buttons that update based on filtering.
5. Selecting one or more rows with a grayish background highlight.
6. Checkbox to select/deselect all displayed rows on the current page.

## API Integration

The app fetches user data from the provided Users API. The API endpoint is:

```bash
GET https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json
```

The data is sorted by the id field and used to populate the user list in the app.

## Deployment

To build the app for production, use the following command:

```bash
npm run build
```

The built app will be located in the build folder and is ready for deployment.

## Acknowledgements

This project was bootstrapped with Create React App [Create React App](https://github.com/facebook/create-react-app).

## Testing

Instructions for running tests will be added here in the future.

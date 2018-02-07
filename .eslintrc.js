module.exports = {
    "extends": "airbnb",
    "env": {
        "jest": true,
        "es6": true,
        "browser": true,
    },
    "rules": {
        // .jsx is legacy according to 
        // https://github.com/facebook/create-react-app/issues/3052
        "react/jsx-filename-extension": false,
    }
};

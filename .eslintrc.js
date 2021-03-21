module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Handlebars": false
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "off"
        ],
        "quotes": [
            "error",
            "single",
            {"allowTemplateLiterals": true}
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": [
            "off"
        ]
    }
};
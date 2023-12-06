module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "import/no-webpack-loader-syntax": "off" // Desactiva la regla específica para import/no-webpack-loader-syntax
    },
    "settings": {
        "import/resolver": {
            "webpack": {
                "config": "path/to/your/webpack.config.js"
            }
        }
    }
};
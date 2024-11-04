# New Angular App

Create new Angular application with auth and layout libraries.

## Get Started

```sh
npx @emilgramdk/new-angular-app my-app
cd my-app
npm run start
```

It will create a directory called `my-app` inside the current folder.<br>
Inside that directory, it will generate the initial project structure and install the transitive dependencies:

```
my-app
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── certs
│   ├── localhost_cert.pem
│   ├── localhost_key.pem
├── public
│   ├── favicon.ico
│   ├── logo.svg
└── src
    ├── app
    ├── config.ts
    ├── index.html
    ├── main.ts
    ├── styles.css
```

No configuration or complicated folder structures, only the files you need to build your app.<br>
Once the installation is done, you can open your project folder:

```sh
cd my-app
```

Inside the newly created project, you can run some built-in commands:

### `npm run start`

Runs the app in development mode.<br>
Open [https://localhost:4200](https://localhost:4200) to view it in the browser.

The page will automatically reload if you make changes to the code.<br>
You will see the build errors and lint warnings in the console.

## Learn More

To learn more about the libraries used in this template, take a look at the following resources:

- [Auth Documentation](https://www.npmjs.com/package/@emilgramdk/ngx-auth-service) - learn about authentication and api requests.
- [Layout Documentation](https://www.npmjs.com/package/@emilgramdk/ngx-layout) - learn about how to use the layout.
- [PrimeNG Documentation](https://primeng.org/autocomplete) - learn about the PrimeNG components.

## License

This project is licensed under the MIT License.

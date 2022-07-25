# Major-Project
Steps to setup project

- Install NodeJs (Version >= 12.0)

- Install CUDA which is required for running Tensorflow environment.

  Link: [CUDA Installation](https://youtu.be/OEFKlRSd8Ic)
  
- Install all the required python libraries which are imported in our project to run the machine learning part.

  ```pip install keras tensorflow pandas numpy sklearn seaborn matplotlib```

- Install all the required node modules which are specified in package.json file

  ```npm install```

- Install Truffle : [Truffle setup](https://trufflesuite.com/docs/truffle/getting-started/installation/)
- Install Ganache : [Ganache setup](https://trufflesuite.com/ganache/)
- [Metamask setup](https://medium.com/@alias_73214/guide-how-to-setup-metamask-d2ee6e212a3e#:~:text=Open%20up%20a%20new%20Chrome,corner%20of%20the%20chrome%20browser.)
- Install MongoDB : [MongoDB setup](https://medium.com/@LondonAppBrewery/how-to-download-install-mongodb-on-windows-4ee4b3493514)
- Migrate the contract to Ganache
  
  ```truffle compile```
  
  ```truggle migrate --reset```
  
- Run the project 

  ```node app.js```
- Open the webapp using ```127.0.0.1:3000``` in the browser.

JCBills
========
Keep track of bills.

##Setup  
JCBills runs on nodejs and MongoDB.

```
git clone https://github.com/sjaak666/jcbills.git jcbills
cd jcbills
npm install
cd public
bower install
cd ..
mv config.js.default config.js
[edit config.js]
cd dbadmin
node createUsers
cd ..
node index
```

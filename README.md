# FCC Issue Tracker

Live demo:
https://fcc-issue-track.herokuapp.com/

req.params: URL
req.body: form submit

easily make filter object:
```javascript
const filterObject = Object.assign(req.query);
```

console log object:
```javascript
console.log(JSON.stringify(object))
```

check if object is empty:
```javascript
Object.keys(obj).length === 0;
```

https://stackoverflow.com/questions/71230787/mongodb-subdocument-structure-best-practices-and-queries

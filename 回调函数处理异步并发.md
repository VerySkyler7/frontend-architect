## 利用回调函数处理异步并发

```

import fs from 'fs'

type IPerson = {
    age: number;
    name: string;
} & {
    [key: string]: string;
}

const cacheFn = (times: number, callback: Function) => {
    const obj = {} as IPerson;
    return (key: string, value: string) => {
        obj[key] = value;
        --times && callback(obj)
    }
}

const fn = cacheFn(2, (data: IPerson) => {
    console.log(data);
})

fs.readFile('./doc/name.txt', 'utf-8', (err, data) => {
    fn('name', data);
})

fs.readFile('./doc/age.txt', 'utf-8', (err, data) => {
    fn('age', data);
})
```

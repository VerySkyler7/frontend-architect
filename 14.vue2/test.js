const obj = {

    a: 1
}

const fnstr = `with(this) {
    return () => {
        console.log(this.a);
    }
}`

const fn = new Function(fnstr);

obj.b = fn;
obj.b()
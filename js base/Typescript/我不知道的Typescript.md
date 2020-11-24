### 0. 直接运行ts
- 使用vscode安装code runner插件，可以直接右键run运行ts文件
### 1. ts是否能在html中直接执行？
- ts文件中如果不包含ts语法的内容，是可以被html执行的(其实任何文件，只要符合js语法，都可以直接在script中执行)
### 2. 将ts文件转为js文件
- 全局安装了typescript后，可以通过tsc编译一个ts文件，将其编译为js文件。
```
tsc test.ts // 生成test.js文件
```
### 3. class在ts中的表现
- class在js基础上，新增了封装、继承、多态
- 在下文有对class的详细描述
### 4. tsconfig.json
- tsc --init 生成tsconfig.json文件，可以对ts的编译方式进行配置
### 5. rootDir&outDir
- rootDir为编译的入口文件夹，outDir为针对rootDir生成文件的文件夹。
- 如果没有配置rootDir默认会寻找当前项目所有的ts文件进行编译。
- typescript.json文件会要求rootDir文件夹下包含项目中所有的ts文件，如果在rootDir之外包含有ts文件，typescript.json则会报错。
- 使用include可以指定只编译哪些文件。
```
{
  "compilerOptions": {
    "outDir": "./dist",                        /* Redirect output structure to the ### directory. */
  },
 "include": ["src"]  
}
```
### 6. 不同的文件如何定义相同名字变量
- 不同文件如果想定义相同变量需要配置isolated。加了此配置会要求所有的文件必须是模块。
```
{
  "compilerOptions": {
    "isolatedModules": true,   
  },
}
```
### 7. Object
- Object可以给它赋任意值，看似和any很像。但其实差别很大。Object类型的变量可以给它赋任意值，但不能调用变量真正类型的方法，只能调用Object.prototye上的方法。
```
let obj: Object = 1; // correct
obj = []; // correct
obj.push(1); // error
obj.toString(); // correct
```
- Object是一个interface, Object { toString(): string }，它处于原型链的最顶端，因此ts允许将任意的值(除null、undefined)赋给它。但只能调用Object接口上的方法。
### 8. null&undefined
- null和undefined官网描述是它两可以是任意类型的子类型，但此规则在ts中默认是关闭的，如果要应用此规则，通过tsc --init出来的typescript.json中，将"strictNullChecks": 设置为false即可。
```
let a: number = null; // 默认为error 需要将strictNullChecks设置为false
let a = null; // correct 此时a的类型为any，因此可以给null
```
- 如果要给一个类型的值赋值null或undefined，官方推荐写法
```
let a : number | undefined = undefined;
```
### 9. 通过decalre声明函数
- 通过declare可以声明函数的类型
- 下文declare会进一步详细描述
```
declare function test(): void;
```
### 10. object
- object表示非原始值的类型，也就是引用值类型。
```
let a: object;
a = 1; // error
a = function(){}; // correct
```
- 它和Object不是一回事，Object是一个interface，任意值都可以赋值给Object类型。
- object和Object的相同点,属于他们类型的值,只能调用原型链顶端的方法。
10.### 1. void表示未定义
- 当函数没有返回值的时候，返回值的类型则属于void
- 当this没有任何指向的时候，this属于void类型
### 11. 类型推断
- 如果一个变量没有赋任何值，默认类型为any
```
let a; // a为any
```
- 无法使用类型推断的场景
```
function test(a) { } // error 函数的参数必须声明类型
let a = 0;
a = ''; // error 
let b: string | number;
b = 0; // correct
b = ''; // correct
```
- 联合类型会根据最新的赋值决定其类型
```
let a;
a = [];
a = '';
a.length; // correct
a.push(); // error

let b: string | number;
b = '';
b.toLowerCase(); // correct
b = 1;
b.toLowerCase(); // error
```
### 12. 接口
- 定义对象全局属性、值类型
```
interface ITest {
  [propName: string]: string;  // 当propName的类型为string时，obj的key值可以为number、string、symbol，如果类型为number，obj的key类型只能是number和symbol
}
const obj: ITest = {
  a: '1', // correct
  1: '1', // correct 数字1默认会转成string
  [Symbol()]: '1', // correct Symbol可以作为key值
  b: 1, // error
}
```
- extends 要求定义一个类型，a和b是number类型，其余属性必须是string类型
```
type ITest = {
  a: number;
  b: number;
} | {
  [propName: string]: string
}

const obj: ITest = {
  a: 1,
  b: 2,
  c: ''
} // correct
```
- 只读属性只能初始化，不能二次赋值
```
interface ITest {
  readonly a: string;
}
const obj: ITest = {
  a : 'a'
}
obj.a = 'b' // error
```
- 使用接口定义数组
```
interface stringArr {
  [index: number]: number
}
const arr: stringArr = [ 1, 2, 3 ]
```
### 13. 类数组的定义方式
```
interface IArgs {
  [index: number]: string;
  length: number;
}

const arr0: IArgs = { 0: '', 1: '', length: 2 };  // correct
const arr1: string[] = { 0: '', 1: '', length: 2 }; // error
```
### 14. 函数注解
- ts中不可以将一个函数作为构造函数
```
function Test () {}
new Test() // error
```
- 函数表达式的注解方式
```
const test1: () => number = () => { return 1; }
```
- 函数参数如果是可选参数，同时有默认值，则无需使用？号
```
function test (name = 1) {
}
test() // correct
test(1) // correct
test('1') // error
```
- 参数的收集(可变参数)
  - 需要使用数组类型进行收集
```
function test (name: string, ...restArg: string[]) { // restArg只能放在参数的最后面
}
test('a', 'b', 'c') // correct
test('a', 1, 2) // error
```
- 函数重载 本质上只是进行了不同参数不同返回值的说明，调用函数时可以有明确的提示。
```
function test(num: number): number;
function test(str: string): string;
function test(par: number | string): number | string {
    if(typeof par === 'number') {
        return Number(par);
    }
    return par + '';
}
```
### 15. this
- 一个独立的函数，函数中的this必须要指明类型
```
function test () {
  console.log(this) // error
}
function test (this: void) {
  console.log(this) // correct
}
```
- 通过函数参数声明this的类型时，需要将this放到参数的第一位作为一个假的参数
```
function test(this: void, num: number) {
    console.log(this, num)
}
test(1) // correct
test(this, 2) //error
```
- 一个独立函数中的this如果被明确了类型，独立调用函数时，this参数将不能被认为是假的参数
```
interface ITest {}
const obj : ITest = {}
function test(this: ITest, num: number) {
  console.log(num)
}
test.call(obj, 1) // correct
test(1) // error  此时会报错 this此时属于void 不能将其分配给ITest类型
```
- this如果被正确使用的情况下，ts默认会按第一层(第二层指的是可能把函数交给一个独立变量)代码含义将其类型进行注解(注解的意思即为声明类型)。
- 如果将noImplicit配置为false，ts默认注解this将失效，此时this默认为any
- 因此最好将this进行显示的注解
```
interface IObj {
    fn: () => () => void
}

const obj: IObj = {
    fn: function (this: IObj) {
        return () => {
            console.log(this);
        }
    }
}

obj.fn()() // obj
```
- 如果第三库的接口对函数中的this做了明确类型定义，将函数作为参数传递时，则要使用**非**箭头函数，以为箭头函数的this是和箭头函数在哪定义的有关，而非箭头函数的this取决于如何调用。
```
// 第三方类库
interface Iobj {
    x: number
}
interface IFn {
    (this: Iobj):void;
}
function run (fn: IFn) {
    const obj : Iobj = { x: 1 }
    fn.call(obj)
}
// 调用者

class Test {
    a = (this: Iobj) => { // error ts提示 箭头函数不允许有this
        console.log(this);
    }
    b(this: Iobj){ // correct
        console.log(this);
    }
}
const t = new Test()
run(t.a) // 实例t
run(t.b) // {x:1}
```
### 16. class
- 成员变量需要在方法外部声明类型并初始化值(或者constructor中初始化值)
- 设置strictPropertyInitialize为false后可以不初始化成员变量的值
```
class Animal {
    habit: string;  // error 没有给habit初始化值
    constructor() {
    }
}
```
- class的继承
- 如果子类存在constructor，constructor里必须使用super执行父类的constructor(无论父类是否写了constructor)，并将super放置到子类this操作之前。
- 子类的成员方法中super代表父类的实例
```
class Animal {
    name: string; 
    constructor(name: string) {
        this.name = name;
    }
    say(){
        console.log(this.name);
    }
}

class Pig extends Animal {
    age: number;
    constructor(name: string){
        this.age = 2; //error       
        super(name);
        this.age = 3; // correct
    }
    sayHabit() {
        super.say(); // 此处的super代表Animal的实例
    }
}
```
### 16.1 公共，私有，受保护修饰符
1. public代表class内部、class的实例、继承类内部、继承类的实例都可以访问, 默认为public
2. private代表只能在class的内部方法，class的实例及继承类都不可以访问
3. protected代表只能在class的内部、子类的内部进行访问，class的实例及子类的实例都不可以访问
```
class Animal {
    public name: string = 'name' // correct public可以在任意地方访问
    private age: number = 18 // correct private 只能在class内部访问
    protected weight: number = 100 // correct protected 只能在父类和子类的内部访问
}

class Pig extends Animal {
    say(){
        this.name = "pig" // correct public可以在任意地方访问
        this.weight = 80 // correct protected 可以在父类、子类的内部访问
        this.age = 16 // error private 只能在父类内部访问
    }
}

const animal = new Animal()
animal.name = "name1" // correct public 在哪都可以访问
animal.age = 20 // error private 规则 只能在class的内部访问
animal.weight = 200 // error protected 规则只能在父类和子类的内部访问

const pig = new Pig()
pig.name = 'pig' // correct public 在哪都可以访问
pig.age = 19 // error  private 规则 只有class的内部可以访问
pig.weight = 100 // error protected 规则 只有父类及子类的内部可以访问
```
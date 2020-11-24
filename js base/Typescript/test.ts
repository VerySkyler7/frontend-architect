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
        super(name);
        this.age = 3; // correct
    }
    sayHabit() {
        super.say(); // 此处的super代表Animal的实例
    }
}

const p = new Pig('佩奇');
p.sayHabit();
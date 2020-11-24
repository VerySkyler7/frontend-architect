class Animal {
    public name: string = 'name' // correct public可以在任意地方访问
    private age: number = 18 // correct private 只能在class内部访问
    protected weight: number = 100 // correct protected 只能在父类和子类的内部访问
}

class Pig extends Animal {
    say(){
        this.name = "pig" // correct public可以在任意地方访问
        this.weight = 80 // correct protected 可以在父类、子类的内部访问
    }
}

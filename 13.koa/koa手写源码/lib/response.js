const response = {
    _body:undefined,
    get body(){
        return this._body;
    },
    set body(content){
        this.res.statusCode = 200;
        this._body = content;
    }
};

module.exports = response
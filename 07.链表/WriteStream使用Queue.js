/**
 * 核心思路
 * 1. 参数初始化
 * 2. 触发open
 * 3. 触发write
 * 	1. 做分支处理：根据writting判断是否为第一次写入，如果是，则进入真实写入硬盘。如果不是则缓存起来存到内存。
 * 	2. 计算返回值：将写入的数据转成buffer，将buffer的长度累加给len，如果len大于等于highWaterMark则返回false
 * 	3. 计算needDrain：needDrain和write返回值相反，如果返回true，则不需要触发drain
 * 4. 真实写入
 * 	1. 写入后将len-1，回调cb。在真实写入前将cb包裹到clearCache中，执行cb前，会先执行clearCache
 * 5. 清理缓存
 * 	1. 执行clearCache时，切割取出缓存队列中的第一个，将第一个的cache传入到_write中进行真实写入
 * 	2. 当缓存清理完毕后触发drain，同时将writting置为false，意味着下一次write从写入硬盘开始。
 * 
 * 核心技能：
 * 1. 将多个异步方法同步执行，如果要有顺序，可以将异步方法的值缓存到队列中，执行完一个方法，从缓存中shift一个新的方法。
 * 2. 异步代码通过发布订阅进行解耦  例如
 * 之前没有可读流和可写流的时候   fs.read和fs.write必须要嵌套使用才能读写文件  可读流和可写流利用了发布订阅后  就可以将他两拆分了
 */

const EE = require('events')
const fs = require('fs')
const path = require('path');
const Queue = require('./Queue');

class WriteStream extends EE {
	constructor(path, options = {}) {
		super();
        this.path = path;
		this.flags = options.flags || 'w';
		this.start = options.start || 0;
		this.highWaterMark = options.highWaterMark || 1024 * 16;
		this.encoding = options.encoding || 'utf-8';
		this.mode = options.mode || 0o666;
		this.emitClose = options.emitClose || true;
		this.autoClose = options.autoClose || true;

		this.writting = false; // writting为true代表非首次写入。如果drain之后，会重置该值
		this.len = 0; // 代表准备写入的长度，写入后需要减少相应的长度
		this.offset = this.start; // 写入偏移量
		this.needDrain = false;
		this.caches = new Queue; // 存放非首次写入的数据
        this.isEnd = false; // 是否调用了end

		this.open();
	}

	destroy(err) {
		if(err) this.emit('err', err);
		if(typeof this.fd === 'number' && (this.autoClose || this.emitClose)) {
			fs.close(this.fd, () => {
				this.emit('close');
			})
		}
	}

	open() {
		fs.open(this.path, this.flags, this.mode, (err, fd) => {
			if (err) this.destroy(err);
			this.fd = fd;
			this.emit('open', this.fd);
		})
	}

	/**
	 * 不触发drain 已实现
	 * 触发关闭 已实现
	 * 写入数据 存在bug
	 * afer end will error
	 */
	end(chunk, encoding = this.encoding, cb = () => {}) {

        // 由于其余的write为异步执行，在end中直接destroy会导致其余的write无法写完
        const handleEnd = () => {
            this.destroy();
            cb();
        }
        
        this.isEnd = true;
		if(chunk) {
			this.write(chunk, encoding, handleEnd, true);
		}
	}

	clearCache() {
		const data = this.caches.offer()
		if(data) {
			this._write(
				data.chunk,
				data.encoding,
				data.cb
			);
		} else {
			this.writting = false;
			if(this.needDrain) {
				this.needDrain = false;
				this.emit('drain');
			}
		}
	}

	write(chunk, encoding = this.encoding, cb = () => {}, isEndWrite = false) {

        if(this.isEnd && !isEndWrite) throw new Error('write can\'t after end');

		chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		this.len += chunk.length;
		const result = this.len < this.highWaterMark;
		this.needDrain = this.isEnd ? !this.isEnd : !result; 

		const clearCache = () => {
			this.clearCache();
			cb();
		}
		
		if (this.writting) {
			this.caches.add({
				chunk,
				encoding,
				cb: clearCache
			})
		} else {
			this.writting = true;
			this._write(chunk, encoding, clearCache)
		}
		return result;
	}

	_write(chunk, encoding, cb) {
		if (typeof this.fd !== 'number') {
			return this.once('open', () => this._write(chunk, encoding, cb));
		}
		fs.write(this.fd, chunk, 0, chunk.length, this.offset, (err, written) => {
			this.offset += written;
			this.len -= written;
			cb();
		})
	}
}

module.exports = WriteStream;

// --------------------------测试代码可打开注释-----------------------------------

// const fs = require('fs')
// const path = require('path')

const ws = new WriteStream(path.resolve(__dirname, 'copy.md'), {
	// const ws = fs.createWriteStream(path.resolve(__dirname, 'test/copy.md'), {
	highWaterMark: 2,
})

let i = 0;

function write() {
	while (i < 10) {
		const res = ws.write(i++ + '');
		if (!res) {
			break;
		}
	}
	if (i === 10) {
		// 1. close事件，需要通过end方法进行触发
		// 2. end方法需要写到write之后，end后不可以继续write
		// 3. end后不会再触发drain事件，因此drain会被触发9次
        ws.end('END');
        // ws.write('8')
	}
}

ws.on('open', (fd) => {
	console.log('fd', fd);
})

ws.on('drain', () => {
	console.log(i + '我达到了highWaterMark并将ws.write的数据写入到文件中了');
	write();
})

write();

ws.on('close', () => {
	console.log('close');
})
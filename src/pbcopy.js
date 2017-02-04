const cp = require('child_process')
const Writable = require('stream').Writable
const Readable = require('stream').Readable

const isFunction = fn => 
    typeof fn === 'function' && typeof fn.call === 'function'

// const createWritable

const createWritableWithCallback = (cb) => {
    if (!isFunction(cb)) throw new Error('Callback must be a function')
    const ws = new Writable({
        write: (chunk, encoding, next) => {
            // assume cb is a function, because checked above
            cb.call(null, chunk, encoding)
            next(null) // return no error
        },
    })
    return ws
}
const createRS = () => 
    new Readable({
        read: (size) => {
            console.error(this)
            this.push(null)
            // push(
            // do stuff!
        },
    })

const createWS = () => 
    createWritableWithCallback((chunk, encoding) => {
        console.error('got data', chunk, encoding)
    })

function validateString(string) {
    if (typeof string !== 'string') throw new Error('expecting string')
}
validateString.asPromise = (string) => {
    try {
        validateString(string)
    } catch (err) {
        return Promise.reject(err)
    }
    return Promise.resolve(string)
}
function createProcessPromise(proc) {
    return new Promise((resolve, reject) => {
        proc.on('close', resolve)
        proc.on('error', reject)
    })
}
// expecting string to be string, hence pure? 
function pureCopy(string) {
    return new Promise((resolve, reject) => {
        try {
            const echo = cp.spawn('echo', [string])
            const pbcopy = cp.spawn('pbcopy') 

            echo.stdout.pipe(pbcopy.stdin)
            echo.stdout.pipe(process.stdout)
            return resolve([echo, pbcopy])
        } catch (err) {
            return reject(err)
        }
    })
}

function close(processes) {
    // const echoClosePromise = createProcessPromise(res.echo)
    // const pbcopyClosePromise = createProcessPromise(res.pbcopy)
    const promises = processes.map(createProcessPromise)
    return Promise.all(promises)
}

function copy(string) {
    return validateString.asPromise(string)
        .then(pureCopy)
        .then(close)
        .then(() => {
            console.error(`${string} copied!`)
            return string
        })
}

// copy('hello world')
    // .then(console.log)
    // .catch(console.error)

module.exports = (input) => { 
    if (typeof input === Readable) {
        console.error('copy readable')
        return Promise.resolve(input)
    } else if (typeof input === 'string') {
        return copy(input)
    }
}


//console.error(cp)

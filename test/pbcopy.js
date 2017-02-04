const pbcopy = require('../src/pbcopy')

const pbcopyTestSuite = { 
    'should copy string to pasteboad': () => {
        const pbcopyPromise = pbcopy('hi there')
        return pbcopyPromise
    },
    'should copy readable stream to pasteboard': () => {
        //return pbcopy
        //
    },
}

module.exports = pbcopyTestSuite
